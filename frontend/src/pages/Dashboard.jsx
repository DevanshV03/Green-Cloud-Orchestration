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

// Services & Data Logic
import { fetchCarbonIntensity } from "../services/api"; 
import { measureLatency } from "../services/latencyService"; // <--- 1. NEW IMPORT
import { getPingUrl } from "../utils/urlGenerator";          // <--- 2. CORRECTED IMPORT NAME

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

      setLoading(true);
      try {
        // --- STEP 2: PREPARE TASKS ---
        
        // Task A: Ask Backend for Carbon Data
        const carbonPromise = fetchCarbonIntensity(selectedZone);

        // Task B: Ask Browser to Ping AWS Regions (Client-Side)
        const latencyPromises = selectedZone.map(async (zoneCode) => {
           // We generate the URL dynamically using your renamed Utility
           const url = getPingUrl(zoneCode); // <--- 3. CORRECTED FUNCTION CALL
           
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
            provider: "AWS" 
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
  }, [selectedZone]); 

  // --- DERIVED STATE (Filtering) ---
  const filteredRegions = regionData.filter((region) => {
    return selectedProvider ? region.provider === selectedProvider : true;
  });

  const optimalRegion = selectOptimalRegion(filteredRegions, taskType);
  const activeSelection = manualSelection || optimalRegion;
  const carbonSavings = calculateCarbonSavings(activeSelection, filteredRegions);

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* Header */}
        <DashboardHeader />

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
              setManualSelection(null);
            }}
          />
          <AvailabilityZoneSelector
            value={selectedZone}
            onChange={(val) => {
              setSelectedZone(val);
              setManualSelection(null);
            }}
          />
          <ApplicationUrlInput
            value={applicationUrl}
            onChange={setApplicationUrl}
          />
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
        <PhaseDisclaimer />
      </div>
    </div>
  );
}

export default Dashboard;