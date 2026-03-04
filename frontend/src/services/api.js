const API_BASE = import.meta.env.VITE_API_BASE;
import axios from 'axios';

export async function fetchCarbonIntensity(selectedZones, provider = 'AWS') {
  try {
    const regions = Array.isArray(selectedZones) ? selectedZones : [selectedZones];

    const apiCalls = regions.map(async (regionValue) => {
      console.log("Fetching for:", regionValue, "Provider:", provider);

      const response = await axios.post(`${API_BASE}/api/carbon-footprint`, {
        regionValue: regionValue,
        provider: provider
      });

      return response.data;
    });

    const results = await Promise.all(apiCalls);

    console.log("All fetched data:", results);
    return results;

  } catch (error) {
    console.error("API Error:", error.message);
    return [];
  }
}
export async function getRouteDecision(taskType) {
  const res = await fetch(`${API_BASE}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskType }),
  });
  return res.json();
}

/**
 * Saves user preferences (task type, provider, zones, app URL) to MongoDB.
 * Used by the Dashboard "Save Preferences" button.
 */
export async function savePreferences({ applicationUrl, taskType, provider, selectedZones, serverMap }) {
  const response = await axios.post(`${API_BASE}/api/preferences`, {
    applicationUrl,
    taskType,
    provider,
    selectedZones,
    serverMap,
  });
  return response.data;
}

/**
 * ML-powered emission prediction.
 * Calls the backend Random Forest model to predict CO₂ emissions.
 */
export async function predictEmissionML({
  carbonIntensity,
  renewablePercentage,
  pue,
  workload = 1,
}) {
  try {
    const response = await axios.post(`${API_BASE}/api/ml/predict-emission`, {
      carbon_intensity: carbonIntensity,
      renewable_percentage: renewablePercentage,
      pue,
      workload,
    });

    return response.data.predictedEmission;
  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    return null;
  }
}
