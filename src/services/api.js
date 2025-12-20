const API_BASE = "http://localhost:3000";

export async function fetchRegions() {
  const res = await fetch(`${API_BASE}/regions`);
  return res.json();
}

export async function getRouteDecision(taskType) {
  const res = await fetch(`${API_BASE}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskType }),
  });
  return res.json();
}
