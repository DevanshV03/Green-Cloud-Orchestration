import { useState } from "react";

import DashboardHeader from "../components/Dashboard/DashboardHeader";
import TaskTypeSelector from "../components/Dashboard/TaskTypeSelector";
import RegionCard from "../components/Dashboard/RegionCard";
import GreenScoreChart from "../components/Dashboard/GreenScoreChart";
import RoutingDecisionCard from "../components/Dashboard/RoutingDecisionCard";
import InfoPanel from "../components/Dashboard/InfoPanel";
import PhaseDisclaimer from "../components/Dashboard/PhaseDisclaimer";

import {
  cloudRegions,
  selectOptimalRegion,
  calculateCarbonSavings,
} from "../data/regionData";

function Dashboard() {
  const [taskType, setTaskType] = useState("green");

  const selectedRegion = selectOptimalRegion(cloudRegions, taskType);
  const carbonSavings = calculateCarbonSavings(selectedRegion, cloudRegions);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <DashboardHeader />

        {/* Task Selector */}
        <div className="max-w-md">
          <TaskTypeSelector value={taskType} onChange={setTaskType} />
        </div>

        {/* Main Decision + Chart */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <RoutingDecisionCard
              selectedRegion={selectedRegion}
              taskType={taskType}
              carbonSavings={carbonSavings}
            />
          </div>

          <div className="lg:col-span-2">
            <GreenScoreChart
              regions={cloudRegions}
              selectedRegionId={selectedRegion.id}
            />
          </div>
        </div>

        {/* Region Comparison */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-primary" />
            Region Comparison
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...cloudRegions]
              .sort((a, b) => a.greenScore - b.greenScore)
              .map((region, index) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isSelected={region.id === selectedRegion.id}
                  animationDelay={index * 100}
                />
              ))}
          </div>
        </section>

        {/* Info + Disclaimer */}
        <InfoPanel />
        <PhaseDisclaimer />
      </div>
    </div>
  );
}

export default Dashboard;
