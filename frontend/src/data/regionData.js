// 1. STATIC METADATA: The details that never change
const REGION_METADATA = {
  "us-east-1": { provider: "AWS", regionName: "US East (Virginia)", zone: "North America", pue: 1.15 },
  "us-east-2": { provider: "AWS", regionName: "US East (Ohio)", zone: "North America", pue: 1.15 },
  "us-west-1": { provider: "AWS", regionName: "US West (N. California)", zone: "North America", pue: 1.15 },
  "us-west-2": { provider: "AWS", regionName: "Oregon", zone: "Western United States", pue: 1.15 },
  "ca-central-1": { provider: "AWS", regionName: "Canada Central", zone: "Canada", pue: 1.15 },
  "ca-west-1": { provider: "AWS", regionName: "Canada West", zone: "Canada", pue: 1.15 },
  "eu-west-1": { provider: "AWS", regionName: "Ireland", zone: "Europe", pue: 1.15 },
  "eu-west-2": { provider: "AWS", regionName: "London", zone: "Europe", pue: 1.15 },
  "eu-west-3": { provider: "AWS", regionName: "Paris", zone: "Europe", pue: 1.15 },
  "af-south-1": { provider: "AWS", regionName: "Cape Town", zone: "South Africa", pue: 1.15 },
};

// 2. THE GENERATOR: Converts Backend Data -> UI Objects
export function generateCloudRegions(apiData) {
  if (!apiData || !Array.isArray(apiData)) return [];

  return apiData.map((dataItem) => {
    const meta = REGION_METADATA[dataItem.regionCode] || {
      provider: "Unknown",
      regionName: dataItem.regionCode,
      zone: "Unknown",
      pue: 1.2,
    };

    const intensity = dataItem.carbonIntensity;
    const greenScore = intensity * meta.pue;
    const estimatedRenewable = dataItem.renewablepercent || 0; 

    return {
      id: dataItem.regionCode,
      provider: meta.provider,
      regionName: meta.regionName,
      zone: meta.zone,
      carbonIntensity: intensity,
      pue: meta.pue,
      greenScore: parseFloat(greenScore.toFixed(1)),
      renewablePercentage: Math.round(estimatedRenewable),
      // If latency is 0/null, we pass it as 0. The sorter below handles the "0 = bad" logic.
      estimatedLatency: dataItem.estimatedLatency || 0, 
    };
  });
}

export const taskTypeOptions = [
  { value: "green", label: "Green Optimized", description: "Prioritize low carbon footprint", icon: "🌱" },
  { value: "balanced", label: "Balanced", description: "Balance sustainability and performance", icon: "⚖️" },
  { value: "performance", label: "Performance Optimized", description: "Prioritize low latency", icon: "🚀" },
];

// ------------------------------------------------------------------
// 3. THE FIX: Smart Sorting that handles "0" Latency
// ------------------------------------------------------------------
export function selectOptimalRegion(regions, taskType) {
  if (!regions || regions.length === 0) return null;

  // Helper: Returns latency, or a Huge Number if latency is 0/missing
  const getSortableLatency = (latency) => {
    // If latency is 0, we treat it as 999,999ms so it sorts to the bottom
    return (!latency || latency <= 0) ? 999999 : latency;
  };

  const sortedRegions = [...regions].sort((a, b) => {
    switch (taskType) {
      // CASE 1: Green Mode (Lowest Score wins)
      case "green":
        return a.greenScore - b.greenScore;

      // CASE 2: Performance Mode (Lowest Latency wins)
      case "performance": {
        const latA = getSortableLatency(a.estimatedLatency);
        const latB = getSortableLatency(b.estimatedLatency);
        return latA - latB;
      }

      // CASE 3: Balanced Mode (Weighted Average)
      case "balanced": {
        // 1. Get Max values for normalization
        // We filter out 0 latencies so they don't skew the max calculation
        const validLatencies = regions
           .map(r => r.estimatedLatency)
           .filter(l => l > 0);
        
        const maxGreen = Math.max(...regions.map((r) => r.greenScore)) || 1;
        const maxLatency = Math.max(...validLatencies, 1); 

        // 2. Score Function (Lower is Better)
        const getScore = (region) => {
            const lat = getSortableLatency(region.estimatedLatency);
            
            // If latency is "Infinity" (failed), return a huge penalty score
            if (lat >= 999999) return 1000; 

            // 50% Green Score + 50% Latency Score
            return ((region.greenScore / maxGreen) * 0.5) + 
                   ((lat / maxLatency) * 0.5);
        };

        return getScore(a) - getScore(b);
      }

      default:
        return a.greenScore - b.greenScore;
    }
  });

  return sortedRegions[0];
}

export function calculateCarbonSavings(selectedRegion, regions) {
  if (!selectedRegion || !regions || regions.length === 0) return 0;
  
  const maxGreenScore = Math.max(...regions.map((r) => r.greenScore));
  if (maxGreenScore === 0) return 0;

  const savings = ((maxGreenScore - selectedRegion.greenScore) / maxGreenScore) * 100;
  return Math.round(savings);
}