// Mock cloud region data (Phase-1)
export const cloudRegions = [
  {
    id: "aws-eu-north-1",
    provider: "AWS",
    regionName: "EU North (Stockholm)",
    carbonIntensity: 8, // gCO₂/kWh
    pue: 1.1,
    greenScore: 8.8, // Carbon Intensity × PUE
    renewablePercentage: 98,
    estimatedLatency: 45, // ms
  },
  {
    id: "gcp-europe-north1",
    provider: "GCP",
    regionName: "Finland",
    carbonIntensity: 12,
    pue: 1.1,
    greenScore: 13.2,
    renewablePercentage: 95,
    estimatedLatency: 52,
  },
  {
    id: "azure-norwayeast",
    provider: "Azure",
    regionName: "Norway East",
    carbonIntensity: 15,
    pue: 1.15,
    greenScore: 17.25,
    renewablePercentage: 92,
    estimatedLatency: 48,
  },
  {
    id: "aws-us-west-2",
    provider: "AWS",
    regionName: "US West (Oregon)",
    carbonIntensity: 85,
    pue: 1.2,
    greenScore: 102,
    renewablePercentage: 65,
    estimatedLatency: 25,
  },
  {
    id: "gcp-us-central1",
    provider: "GCP",
    regionName: "Iowa",
    carbonIntensity: 120,
    pue: 1.12,
    greenScore: 134.4,
    renewablePercentage: 50,
    estimatedLatency: 18,
  },
  {
    id: "azure-eastus",
    provider: "Azure",
    regionName: "East US (Virginia)",
    carbonIntensity: 350,
    pue: 1.25,
    greenScore: 437.5,
    renewablePercentage: 30,
    estimatedLatency: 12,
  },
];

// Task types (used by UI & routing logic)
export const taskTypeOptions = [
  {
    value: "green",
    label: "Green Optimized",
    description: "Prioritize low carbon footprint",
    icon: "🌱",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Balance sustainability and performance",
    icon: "⚖️",
  },
  {
    value: "performance",
    label: "Performance Optimized",
    description: "Prioritize low latency",
    icon: "🚀",
  },
];

// Select optimal region based on task type
export function selectOptimalRegion(regions, taskType) {
  const sortedRegions = [...regions].sort((a, b) => {
    switch (taskType) {
      case "green":
        return a.greenScore - b.greenScore;

      case "performance":
        return a.estimatedLatency - b.estimatedLatency;

      case "balanced": {
        const maxGreen = Math.max(...regions.map((r) => r.greenScore));
        const maxLatency = Math.max(...regions.map((r) => r.estimatedLatency));

        const scoreA =
          (a.greenScore / maxGreen) * 0.5 +
          (a.estimatedLatency / maxLatency) * 0.5;

        const scoreB =
          (b.greenScore / maxGreen) * 0.5 +
          (b.estimatedLatency / maxLatency) * 0.5;

        return scoreA - scoreB;
      }

      default:
        return a.greenScore - b.greenScore;
    }
  });

  return sortedRegions[0];
}

// Calculate carbon savings percentage
export function calculateCarbonSavings(selectedRegion, regions) {
  const maxGreenScore = Math.max(...regions.map((r) => r.greenScore));
  const savings =
    ((maxGreenScore - selectedRegion.greenScore) / maxGreenScore) * 100;

  return Math.round(savings);
}
