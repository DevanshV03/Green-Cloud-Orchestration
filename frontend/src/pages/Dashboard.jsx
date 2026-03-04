import { useState, useEffect } from "react";

// Components
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import TaskTypeSelector from "../components/Dashboard/TaskTypeSelector";
import CloudProviderSelector from "../components/Dashboard/CloudProviderSelector";
import AvailabilityZoneSelector from "../components/Dashboard/AvailabilityZoneSelector";
import ApplicationUrlInput from "../components/Dashboard/ApplicationUrlInput";
import RegionCard from "../components/Dashboard/RegionCard";
import GreenScoreChart from "../components/Dashboard/GreenScoreChart";
import RoutingDecisionCard from "../components/Dashboard/RoutingDecisionCard";
import InfoPanel from "../components/Dashboard/InfoPanel";
import PhaseDisclaimer from "../components/Dashboard/PhaseDisclaimer";
import ImpactStats from "../components/ImpactStats";
import Pricing from "../components/Pricing";
import ContextWidgets from "../components/ContextWidgets";


// Services & Data Logic
import { fetchCarbonIntensity, savePreferences } from "../services/api";
import { measureLatency } from "../services/latencyService";
import { getPingUrl } from "../utils/urlGenerator";

import {
  generateCloudRegions,
  selectOptimalRegion,
  calculateCarbonSavings,
} from "../data/regionData";

function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [taskType, setTaskType] = useState("green");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedZone, setSelectedZone] = useState([]);
  const [applicationUrl, setApplicationUrl] = useState("");
  const [manualSelection, setManualSelection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error', message: '' }
  const [serverMap, setServerMap] = useState({}); // { regionCode: serverUrl }

  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- EFFECT: Fetch & Generate Data (PARALLEL MODE) ---
  useEffect(() => {
    const loadData = async () => {
      // 1. If no zones are selected, clear the dashboard
      if (selectedZone.length === 0) {
        setRegionData([]);
        setManualSelection(null);
        return;
      }

      // Determine provider for API calls (default to AWS if none selected)
      const currentProvider = selectedProvider || "AWS";

      setLoading(true);
      try {
        // --- STEP 2: PREPARE TASKS ---

        // Task A: Ask Backend for Carbon Data (with provider)
        const carbonPromise = fetchCarbonIntensity(selectedZone, currentProvider);

        // Task B: Ask Browser to Ping AWS Regions (Client-Side)
        const latencyPromises = selectedZone.map(async (zoneCode) => {
          // We generate the URL dynamically based on provider
          const url = getPingUrl(zoneCode, currentProvider);

          // If we have a URL, measure it. If not, return default high latency.
          const latency = url ? await measureLatency(url) : 0;

          return { id: zoneCode, latency };
        });

        // --- STEP 3: FIRE PARALLEL REQUESTS ---
        const [carbonResults, latencyResults] = await Promise.all([
          carbonPromise,
          Promise.all(latencyPromises)
        ]);

        // --- STEP 4: MERGE DATA ---
        const mergedData = carbonResults.map((carbonItem) => {
          // Find the matching latency result
          const matchingLatency = latencyResults.find(l => l.id === carbonItem.regionCode);

          return {
            ...carbonItem, // Contains: regionCode, carbonIntensity
            estimatedLatency: matchingLatency ? matchingLatency.latency : 0,
            provider: currentProvider
          };
        });

        // --- STEP 5: GENERATE RICH UI OBJECTS ---
        // Ensure generateCloudRegions inside regionData.js uses 'estimatedLatency'
        const formattedRegions = generateCloudRegions(mergedData);

        setRegionData(formattedRegions);

      } catch (error) {
        console.error("Failed to load region data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedZone, selectedProvider]);

  // --- DERIVED STATE (Filtering) ---
  const filteredRegions = regionData.filter((region) => {
    return selectedProvider ? region.provider === selectedProvider : true;
  });

  const optimalRegion = selectOptimalRegion(filteredRegions, taskType);
  const activeSelection = manualSelection || optimalRegion;

  // --- SAVE PREFERENCES HANDLER ---
  const canSave = applicationUrl && selectedProvider && selectedZone.length > 0;

  const handleSavePreferences = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      await savePreferences({
        applicationUrl,
        taskType,
        provider: selectedProvider,
        selectedZones: selectedZone,
        serverMap,
      });
      setSaveStatus({ type: 'success', message: 'Preferences saved! Your app can now use the recommendation API.' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save preferences. Please try again.' });
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };
  const carbonSavings = calculateCarbonSavings(activeSelection, filteredRegions);

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white selection:bg-green-100">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Header */}
        <DashboardHeader />

        {/* Context Widgets (NEW) */}
        <ContextWidgets />

        {/* Impact Stats Section (NEW) */}
        <ImpactStats />

        {/* Input Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskTypeSelector
            value={taskType}
            onChange={(val) => {
              setTaskType(val);
              setManualSelection(null);
            }}
          />
          <CloudProviderSelector
            value={selectedProvider}
            onChange={(val) => {
              setSelectedProvider(val);
              setSelectedZone([]); // Clear zones when provider changes
              setManualSelection(null);
            }}
          />
          <AvailabilityZoneSelector
            value={selectedZone}
            onChange={(val) => {
              setSelectedZone(val);
              setManualSelection(null);
            }}
            provider={selectedProvider}
          />
          <ApplicationUrlInput
            value={applicationUrl}
            onChange={setApplicationUrl}
          />
        </div>

        {/* Server URL Mapping — for API routing */}
        {selectedZone.length > 0 && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              🔗 Map Your Servers <span className="text-sm font-normal text-gray-400">(Optional — for API routing)</span>
            </h3>
            <p className="text-sm text-gray-500">
              Enter the URL of your server deployed in each region. This enables the SDK to redirect users to the correct server.
            </p>
            <div className="grid gap-3">
              {selectedZone.map(zone => (
                <div key={zone} className="flex items-center gap-3">
                  <span className="text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 min-w-[160px] text-gray-700">
                    {zone}
                  </span>
                  <input
                    type="url"
                    placeholder={`https://your-${zone}-server.com`}
                    value={serverMap[zone] || ''}
                    onChange={(e) => setServerMap(prev => ({ ...prev, [zone]: e.target.value }))}
                    className="flex-1 h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Preferences Button */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleSavePreferences}
            disabled={!canSave || saving}
            className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${canSave && !saving
              ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {saving ? 'Saving...' : '💾 Save Preferences for API'}
          </button>

          {saveStatus && (
            <span className={`text-sm font-medium ${saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
              {saveStatus.type === 'success' ? '✅' : '❌'} {saveStatus.message}
            </span>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-2">
            <span>Measuring Carbon & Network Latency...</span>
          </div>
        ) : filteredRegions.length > 0 ? (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <RoutingDecisionCard
                  selectedRegion={activeSelection}
                  taskType={taskType}
                  carbonSavings={carbonSavings}
                />
              </div>

              <div className="lg:col-span-2">
                <GreenScoreChart
                  regions={filteredRegions}
                  selectedRegionId={activeSelection?.id}
                />
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-primary" />
                Region Comparison
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRegions
                  .sort((a, b) => a.greenScore - b.greenScore)
                  .map((region, index) => (
                    <RegionCard
                      key={region.id}
                      region={region}
                      isSelected={region.id === activeSelection?.id}
                      onSelect={setManualSelection}
                      animationDelay={index * 100}
                    />
                  ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-600">No Regions Selected</h3>
            <p className="text-gray-500">Select an Availability Zone to see live carbon data.</p>
          </div>
        )}

        <InfoPanel />

        {/* Pricing Section (NEW) */}
        {/*<Pricing />*/}

        <PhaseDisclaimer />
      </div>
    </div>
  );
}

export default Dashboard;