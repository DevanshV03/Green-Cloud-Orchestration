import express from 'express';
import UserPreference from '../models/UserPreference.js';
import { fetchCarbonData } from './carbonFootprintRoutes.js';
import { generateCloudRegions, selectOptimalRegion, calculateCarbonSavings } from '../services/recommendationService.js';

const router = express.Router();

/**
 * Generates a ping URL for a given region code and provider.
 * Server-side equivalent of frontend/src/utils/urlGenerator.js
 */
function getPingUrl(regionCode, provider = 'AWS') {
    if (!regionCode) return null;

    if (provider === 'GCP') {
        return `https://${regionCode}-run.googleapis.com/apis/run.googleapis.com/v1`;
    }

    // Default: AWS DynamoDB endpoint
    return `https://dynamodb.${regionCode}.amazonaws.com`;
}

// ─────────────────────────────────────────────────
// POST /api/preferences — Save user preferences
// ─────────────────────────────────────────────────
router.post('/preferences', async (req, res) => {
    try {
        const { applicationUrl, taskType, provider, selectedZones, serverMap } = req.body;

        // Validation
        if (!applicationUrl || !taskType || !provider || !selectedZones || selectedZones.length === 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['applicationUrl', 'taskType', 'provider', 'selectedZones (non-empty array)']
            });
        }

        // Normalize URL (trim trailing slash)
        const normalizedUrl = applicationUrl.replace(/\/+$/, '').trim();

        // Upsert: create or update preferences for this URL
        const saved = await UserPreference.findOneAndUpdate(
            { applicationUrl: normalizedUrl },
            {
                applicationUrl: normalizedUrl,
                taskType,
                provider,
                selectedZones,
                serverMap: serverMap || {},
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json({
            message: 'Preferences saved successfully',
            data: saved,
        });

    } catch (error) {
        console.error('Error saving preferences:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                details: error.message,
            });
        }

        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

// ─────────────────────────────────────────────────────────────
// GET /api/recommend/regions?url=<app-url> — Step 1: Get regions to ping
// ─────────────────────────────────────────────────────────────
router.get('/recommend/regions', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'Missing "url" query parameter' });
        }

        const normalizedUrl = url.replace(/\/+$/, '').trim();

        const preferences = await UserPreference.findOne({ applicationUrl: normalizedUrl });

        if (!preferences) {
            return res.status(404).json({
                error: 'No preferences found for this URL',
                applicationUrl: normalizedUrl,
            });
        }

        // Build regions with ping URLs
        const regions = preferences.selectedZones.map(regionCode => ({
            regionCode,
            pingUrl: getPingUrl(regionCode, preferences.provider),
        }));

        res.status(200).json({
            applicationUrl: preferences.applicationUrl,
            taskType: preferences.taskType,
            provider: preferences.provider,
            regions,
        });

    } catch (error) {
        console.error('Error fetching regions:', error.message);
        res.status(500).json({ error: 'Failed to fetch regions' });
    }
});

// ────────────────────────────────────────────────────────────────
// POST /api/recommend/decide — Step 2: Get recommendation
// ────────────────────────────────────────────────────────────────
router.post('/recommend/decide', async (req, res) => {
    try {
        const { applicationUrl, latencies } = req.body;

        if (!applicationUrl || !latencies || !Array.isArray(latencies)) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['applicationUrl', 'latencies (array of {regionCode, latency})']
            });
        }

        const normalizedUrl = applicationUrl.replace(/\/+$/, '').trim();

        // 1. Look up preferences
        const preferences = await UserPreference.findOne({ applicationUrl: normalizedUrl });

        if (!preferences) {
            return res.status(404).json({
                error: 'No preferences found for this URL',
                applicationUrl: normalizedUrl,
            });
        }

        // 2. Fetch live carbon data for each selected zone
        const carbonResults = await Promise.all(
            preferences.selectedZones.map(async (regionCode) => {
                try {
                    return await fetchCarbonData(regionCode, preferences.provider);
                } catch (err) {
                    console.error(`Failed to fetch carbon data for ${regionCode}:`, err.message);
                    return null;
                }
            })
        );

        // Filter out failed fetches
        const validCarbonResults = carbonResults.filter(r => r !== null);

        if (validCarbonResults.length === 0) {
            return res.status(502).json({
                error: 'Failed to fetch carbon data for all regions',
            });
        }

        // 3. Merge carbon data with client-provided latency
        const mergedData = validCarbonResults.map(carbonItem => {
            const matchingLatency = latencies.find(l => l.regionCode === carbonItem.regionCode);
            return {
                ...carbonItem,
                estimatedLatency: matchingLatency ? matchingLatency.latency : 0,
                provider: preferences.provider,
            };
        });

        // 4. Generate rich region objects and run scoring algorithm
        const formattedRegions = generateCloudRegions(mergedData);
        const recommended = selectOptimalRegion(formattedRegions, preferences.taskType);
        const carbonSavings = calculateCarbonSavings(recommended, formattedRegions);

        // 5. Resolve target server URL from saved serverMap
        const targetServerUrl = preferences.serverMap?.get(recommended.id) || null;

        // 6. Return recommendation
        res.status(200).json({
            recommendedDataCenter: recommended,
            targetServerUrl,
            allRegions: formattedRegions,
            carbonSavings,
            preferences: {
                taskType: preferences.taskType,
                provider: preferences.provider,
                selectedZones: preferences.selectedZones,
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Error in recommendation:', error.message);
        res.status(500).json({ error: 'Failed to generate recommendation' });
    }
});

export default router;
