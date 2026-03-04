import { useEffect, useState, useMemo } from "react";
import { Leaf, Info } from "lucide-react";
import { AWS_REGIONS, GCP_REGIONS } from "../../constants/regions";
import { fetchCarbonIntensity } from "../services/api";

export default function RenewableImpactSimulator() {
  const [provider, setProvider] = useState("AWS");

  const sortedRegions = useMemo(() => {
    const regions = provider === "GCP" ? GCP_REGIONS : AWS_REGIONS;
    return [...regions].sort((a, b) => a.name.localeCompare(b.name));
  }, [provider]);

  const [selectedDC, setSelectedDC] = useState(null);

  const [carbonIntensity, setCarbonIntensity] = useState(null);
  const [renewablePercentage, setRenewablePercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [mlEmission, setMlEmission] = useState(null);

  // Reset selected DC when provider changes
  useEffect(() => {
    if (sortedRegions.length > 0) {
      setSelectedDC(sortedRegions[0]);
    }
  }, [provider, sortedRegions]);

  /* ===============================
     FETCH REAL-TIME CARBON DATA
     =============================== */
  useEffect(() => {
    async function fetchCarbonData() {
      if (!selectedDC) return;

      try {
        setLoading(true);
        const results = await fetchCarbonIntensity([selectedDC.id], provider);

        if (results && results.length > 0) {
          const data = results[0];
          setCarbonIntensity(data.carbonIntensity);
          setRenewablePercentage(data.renewablepercent || 0);
        }
      } catch (e) {
        console.error("Carbon API error", e);
      } finally {
        setLoading(false);
      }
    }

    fetchCarbonData();
  }, [selectedDC, provider]);

  /* ===============================
     ML PREDICTION (THIS WAS FIXED)
     =============================== */
  useEffect(() => {
    async function fetchMLPrediction() {
      if (carbonIntensity === null || !selectedDC) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/predict-emission`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              carbonIntensity: carbonIntensity,
              renewablePercentage: renewablePercentage,
              pue: selectedDC.pue,
            }),
          },
        );

        const data = await res.json();
        setMlEmission(data.predictedEmission);
      } catch (err) {
        console.error("ML API error", err);
      }
    }

    fetchMLPrediction();
  }, [carbonIntensity, renewablePercentage, selectedDC]);

  /* ===============================
     DERIVED VALUES
     =============================== */

  const originalEmission =
    carbonIntensity !== null && selectedDC
      ? carbonIntensity * selectedDC.pue
      : 0;

  const adjustedEmission = mlEmission ?? 0;

  const reduction =
    originalEmission > 0
      ? ((originalEmission - adjustedEmission) / originalEmission) * 100
      : 0;

  /* ===============================
     UI HELPERS
     =============================== */
  const getColorScheme = (pct) => {
    if (pct <= 20) return "red";
    if (pct <= 60) return "yellow";
    return "green";
  };

  const currentScheme = getColorScheme(renewablePercentage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* HEADER */}
        <header className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl">
              <Leaf className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-green-700">
              Renewable Impact Simulator (ML-Based)
            </h1>
          </div>
          <p className="text-gray-600">
            ML-powered estimation of carbon reduction based on renewable energy
            usage
          </p>
        </header>

        {/* CONFIGURATION */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-6">
          {/* CSP */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Cloud Service Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="AWS">AWS</option>
              <option value="GCP">Google Cloud Platform</option>
            </select>
          </div>

          {/* DATA CENTER */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Data Center Region
            </label>
            <select
              value={selectedDC?.id || ""}
              onChange={(e) =>
                setSelectedDC(
                  sortedRegions.find((dc) => dc.id === e.target.value),
                )
              }
              className="w-full p-3 border rounded-lg"
            >
              {sortedRegions.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name} (PUE {dc.pue})
                </option>
              ))}
            </select>
          </div>

          {/* SLIDER */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Renewable Energy Percentage
              </span>
              <span className="font-bold text-green-600">
                {renewablePercentage}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={renewablePercentage}
              onChange={(e) => setRenewablePercentage(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* RESULTS */}
        <div className="grid md:grid-cols-3 gap-6">
          <Result title="Original Emission" value={originalEmission} />
          <Result title="ML Adjusted Emission" value={adjustedEmission} />
          <Result title="Reduction" value={`${reduction.toFixed(1)}%`} />
        </div>

        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Fetching live data...
          </p>
        )}

        {/* EXPLANATION */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3">
          <Info className="text-blue-600 w-5 h-5 mt-1" />
          <p className="text-sm text-blue-800">
            Emissions are predicted using a Random Forest ML model trained on
            real-time Electricity Maps data. Slider input directly affects the
            model’s prediction.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   RESULT CARD
   =============================== */

function Result({ title, value }) {
  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {typeof value === "number" ? value.toFixed(2) : value}
      </p>
    </div>
  );
}
