import dotenv from "dotenv";
const API_BASE = process.env.API_BASE;
import axios from 'axios';

export async function fetchCarbonIntensity(selectedZones) {
  try {
    const regions = Array.isArray(selectedZones) ? selectedZones : [selectedZones];
    
    const apiCalls = regions.map(async (regionValue) => {
      console.log("Fetching for:", regionValue);
      
      const response = await axios.post(`${API_BASE}/api/carbon-footprint`, {
        regionValue: regionValue
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
