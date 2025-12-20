import { Cloud, Leaf } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-2xl bg-brand-600 shadow-lg shadow-brand-200">
          <div className="flex items-center gap-1">
            <Leaf className="w-6 h-6 text-white" />
            <Cloud className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Green Cloud Orchestrator
          </h1>
          <p className="text-muted-foreground">
            Carbon-Aware Cloud Region Selection
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl mt-4">
        Select a task type to see how cloud regions are ranked based on carbon
        footprint and performance. Make informed decisions for sustainable cloud
        computing.
      </p>
    </header>
  );
}

export default DashboardHeader;
