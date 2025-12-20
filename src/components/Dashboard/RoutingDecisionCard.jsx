import { CheckCircle2, Leaf, Zap, TrendingDown } from "lucide-react";

const taskTypeOptions = [
  {
    value: "green",
    label: "Green Optimized",
    icon: "🌱",
  },
  {
    value: "balanced",
    label: "Balanced",
    icon: "⚖️",
  },
  {
    value: "performance",
    label: "Performance Optimized",
    icon: "⚡",
  },
];

function RoutingDecisionCard({ selectedRegion, taskType, carbonSavings }) {
  const taskOption = taskTypeOptions.find((opt) => opt.value === taskType);

  if (!selectedRegion) return null;

  return (
    <div className="overflow-hidden rounded-xl border shadow-lg animate-scale-in bg-white">
      {/* Top accent */}
      <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-400" />

      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <CheckCircle2 className="w-6 h-6 text-brand-600" />
          Routing Decision
        </h2>
      </div>

      {/* Content */}
      <div className="px-5 pb-6 space-y-6">
        {/* Selected Region */}
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
          <p className="text-sm text-gray-500 mb-1">Selected Cloud Region</p>
          <p className="text-2xl font-bold text-gray-900">
            {selectedRegion.provider} – {selectedRegion.regionName}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-brand-100">
            <Leaf className="w-6 h-6 text-brand-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-700">
              {selectedRegion.greenScore.toFixed(1)}
            </p>
            <p className="text-xs text-brand-600/80">Green Score</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-blue-50">
            <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">
              {selectedRegion.estimatedLatency} ms
            </p>
            <p className="text-xs text-blue-600/80">Latency</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-gray-50">
            <TrendingDown className="w-6 h-6 text-brand-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-brand-700">
              {carbonSavings}%
            </p>
            <p className="text-xs text-gray-500">Carbon Savings</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-medium">
              {taskOption?.icon} {taskOption?.label}:
            </span>{" "}
            This region was selected based on the chosen task profile and its
            optimized{" "}
            {taskType === "green"
              ? "Green Score for minimal carbon footprint"
              : taskType === "performance"
              ? "latency for maximum performance"
              : "balance between sustainability and performance"}
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoutingDecisionCard;
