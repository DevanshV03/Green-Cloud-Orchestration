import { Router } from "express";
import express from 'express';
import axios from 'axios';


const router = express.Router();

// Mapping from cloud region codes to Electricity Maps zone codes
export const REGION_TO_ZONE = {
    // AWS Regions
    'us-east-1': 'US-CAR-CPLE',  // Virginia
    'us-east-2': 'US-MIDA-PJM',  // Ohio
    'us-west-1': 'US-CAL-CISO',  // California
    'us-west-2': 'US-NW-PACW',   // Oregon
    'ca-central-1': 'CA-ON',     // Canada
    'eu-west-1': 'IE',           // Ireland
    'eu-west-2': 'GB',           // London
    'eu-west-3': 'FR',           // Paris
    'eu-central-1': 'DE',        // Frankfurt
    'eu-central-2': 'CH',        // Zurich
    'eu-north-1': 'SE',          // Stockholm
    'eu-south-1': 'IT-NO',       // Milan
    'eu-south-2': 'ES',          // Spain
    'ap-south-1': 'IN-WE',       // Mumbai
    'ap-south-2': 'IN-SO',       // Hyderabad
    'ap-northeast-1': 'JP-TK',   // Tokyo
    'ap-northeast-2': 'KR',      // Seoul
    'ap-northeast-3': 'JP-KN',   // Osaka
    'ap-southeast-1': 'SG',      // Singapore
    'ap-southeast-2': 'AU-NSW',  // Sydney
    'ap-southeast-3': 'ID',      // Jakarta
    'ap-southeast-4': 'AU-VIC',  // Melbourne
    'ap-east-1': 'HK',           // Hong Kong
    'sa-east-1': 'BR-CS',        // São Paulo
    'af-south-1': 'ZA',          // Cape Town
    'me-central-1': 'AE',        // UAE
    'il-central-1': 'IL',        // Tel Aviv

    // GCP Regions
    'us-central1': 'US-MIDA-PJM',    // Iowa
    'us-east1': 'US-CAR-CPLE',       // South Carolina
    'us-west1': 'US-NW-PACW',        // Oregon
    'southamerica-east1': 'BR-CS',   // São Paulo
    'europe-west1': 'BE',            // Belgium
    'europe-west2': 'GB',            // London
    'europe-west3': 'DE',            // Frankfurt
    'europe-north1': 'FI',           // Finland
    'europe-west9': 'FR',            // Paris
    'asia-northeast1': 'JP-TK',      // Tokyo
    'asia-northeast3': 'KR',         // Seoul
    'asia-east1': 'TW',              // Taiwan
    'asia-east2': 'HK',              // Hong Kong
    'asia-south1': 'IN-WE',          // Mumbai
    'me-central1': 'QA',             // Doha
    'me-central2': 'SA',             // Dammam
    'me-west1': 'IL',                // Tel Aviv
};

/**
 * Reusable function to fetch carbon intensity and renewable percentage for a region.
 * Used by both the /carbon-footprint route and the recommendation API.
 * 
 * @param {string} regionValue - Cloud region code (e.g. 'us-east-1')
 * @param {string} provider - Cloud provider ('aws' or 'gcp')
 * @returns {Promise<{regionCode, carbonIntensity, renewablepercent, fallback?}>}
 */
export async function fetchCarbonData(regionValue, provider = 'aws') {
    const datetime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const dataCenterProvider = provider.toLowerCase();

    try {
        // Try datacenter-specific API first
        const response = await axios.get('https://api.electricitymaps.com/v3/carbon-intensity/latest', {
            params: {
                dataCenterRegion: regionValue,
                dataCenterProvider: dataCenterProvider,
                datetime: datetime
            },
            headers: {
                'auth-token': process.env.EMAPS_API_KEY
            }
        });

        const renewableresponse = await axios.get('https://api.electricitymaps.com/v3/renewable-energy/latest', {
            params: {
                dataCenterRegion: regionValue,
                dataCenterProvider: dataCenterProvider,
                datetime: datetime
            },
            headers: {
                'auth-token': process.env.EMAPS_API_KEY
            }
        });

        return {
            regionCode: regionValue,
            carbonIntensity: response.data.carbonIntensity,
            renewablepercent: renewableresponse.data.value
        };

    } catch (datacenterError) {
        console.log(`Datacenter API failed for ${regionValue}, trying zone fallback...`);

        // Fallback: Try zone-based API
        const zoneCode = REGION_TO_ZONE[regionValue];

        if (!zoneCode) {
            console.error(`No zone mapping found for region: ${regionValue}`);
            throw new Error(`Region not supported: ${regionValue}`);
        }

        try {
            const zoneResponse = await axios.get('https://api.electricitymaps.com/v3/carbon-intensity/latest', {
                params: { zone: zoneCode },
                headers: { 'auth-token': process.env.EMAPS_API_KEY }
            });

            // Renewable data might not be available for all zones, default to 0
            let renewablePercent = 0;
            try {
                const renewableResponse = await axios.get('https://api.electricitymaps.com/v3/power-breakdown/latest', {
                    params: { zone: zoneCode },
                    headers: { 'auth-token': process.env.EMAPS_API_KEY }
                });
                renewablePercent = renewableResponse.data.renewablePercentage || 0;
            } catch (renewErr) {
                console.log(`Renewable data not available for zone ${zoneCode}`);
            }

            return {
                regionCode: regionValue,
                carbonIntensity: zoneResponse.data.carbonIntensity,
                renewablepercent: renewablePercent,
                fallback: true
            };

        } catch (zoneError) {
            console.error(`Zone fallback also failed for ${regionValue}:`, zoneError.message);
            throw new Error(`Failed to fetch carbon intensity for ${regionValue}`);
        }
    }
}

// Route handler — thin wrapper around fetchCarbonData()
router.post('/carbon-footprint', async (req, res) => {
    const { regionValue, provider = 'aws' } = req.body;

    try {
        const data = await fetchCarbonData(regionValue, provider);
        res.status(200).json(data);
    } catch (error) {
        if (error.message.includes('not supported')) {
            return res.status(400).json({
                error: 'Region not supported',
                regionCode: regionValue
            });
        }
        res.status(500).json({
            error: 'Failed to fetch carbon intensity',
            regionCode: regionValue
        });
    }
});

export default router;
