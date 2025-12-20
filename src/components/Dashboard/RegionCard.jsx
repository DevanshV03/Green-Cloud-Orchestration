import { Cloud, Leaf, Zap, Percent } from "lucide-react";

const providerColors = {
  AWS: "bg-amber-100 text-amber-700 border-amber-200",
  GCP: "bg-blue-100 text-blue-700 border-blue-200",
  Azure: "bg-sky-100 text-sky-700 border-sky-200",
};

function RegionCard({ region, isSelected, animationDelay = 0 }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-green-600 shadow-lg bg-green-50"
          : "shadow-sm hover:shadow-md bg-white"
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-gray-500" />
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${
                providerColors[region.provider]
              }`}
            >
              {region.provider}
            </span>
          </div>

          {isSelected && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
              Recommended
            </span>
          )}
        </div>

        {/* Region Name */}
        <h3 className="font-semibold text-lg mb-4">{region.regionName}</h3>

        {/* Metrics */}
        <div className="space-y-3">
          {/* Green Score */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              isSelected ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Leaf
                className={`w-4 h-4 ${
                  isSelected ? "text-green-700" : "text-green-600"
                }`}
              />
              <span className="text-sm font-medium">Green Score</span>
            </div>
            <span
              className={`text-lg font-bold ${
                isSelected ? "text-green-700" : "text-green-600"
              }`}
            >
              {region.greenScore.toFixed(1)}
            </span>
          </div>

          {/* Other Metrics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="block text-xs text-gray-500">
                Carbon Intensity
              </span>
              <span className="font-medium">
                {region.carbonIntensity} gCO₂/kWh
              </span>
            </div>

            <div>
              <span className="block text-xs text-gray-500">PUE</span>
              <span className="font-medium">{region.pue}</span>
            </div>

            <div>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Percent className="w-3 h-3" />
                Renewable
              </span>
              <span className="font-medium">{region.renewablePercentage}%</span>
            </div>

            <div>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Zap className="w-3 h-3" />
                Latency
              </span>
              <span className="font-medium">{region.estimatedLatency} ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegionCard;
