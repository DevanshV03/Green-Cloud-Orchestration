import { Info, Calculator, Leaf, Activity, Percent } from "lucide-react";

function InfoPanel() {
  return (
    <div
      className="rounded-xl border bg-white shadow-card animate-slide-up"
      style={{ animationDelay: "300ms" }}
    >
      <details className="group">
        {/* Accordion Trigger */}
        <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
          <div className="p-2 rounded-lg bg-green-100">
            <Info className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-semibold text-gray-900">
            How is the Green Score calculated?
          </span>
        </summary>

        {/* Accordion Content */}
        <div className="px-6 pb-6">
          <div className="space-y-6 mt-4">
            {/* Formula */}
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Formula</span>
              </div>
              <code className="block p-3 rounded-lg bg-white text-sm font-mono">
                Green Score = Carbon Intensity × PUE
              </code>
            </div>

            {/* Explanation items */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 p-3 rounded-lg bg-gray-100">
                <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Carbon Intensity</p>
                  <p className="text-xs text-gray-600">
                    gCO₂ emitted per kWh of electricity in the region's grid
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-lg bg-gray-100">
                <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    PUE (Power Usage Effectiveness)
                  </p>
                  <p className="text-xs text-gray-600">
                    Ratio of total facility energy to IT equipment energy
                    (lower is better)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-lg bg-gray-100">
                <Percent className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Renewable Percentage</p>
                  <p className="text-xs text-gray-600">
                    Shown for context only; not included in Green Score
                    calculation
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-lg bg-gray-100">
                <Calculator className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Workload Normalization</p>
                  <p className="text-xs text-gray-600">
                    All calculations normalized to 1 unit of workload
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 border-l-2 border-green-500 pl-4">
              <strong>Note:</strong> Routing is simulated in Phase-1. Lower Green
              Score indicates a more sustainable cloud region choice.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}

export default InfoPanel;
