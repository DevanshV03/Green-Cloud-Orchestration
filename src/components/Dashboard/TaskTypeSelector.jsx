import { Leaf, Scale, Zap } from "lucide-react";

const taskTypeOptions = [
  {
    value: "green",
    label: "Green Optimized",
    description: "Prioritize lowest carbon footprint",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Balance sustainability and performance",
  },
  {
    value: "performance",
    label: "Performance Optimized",
    description: "Prioritize lowest latency",
  },
];

const icons = {
  green: Leaf,
  balanced: Scale,
  performance: Zap,
};

function TaskTypeSelector({ value, onChange }) {
  const SelectedIcon = icons[value] || Leaf;

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Select Task Type
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-xl border border-brand-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-700 font-medium"
        >
          {taskTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SelectedIcon className="w-5 h-5 text-brand-600" />
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {taskTypeOptions.find((opt) => opt.value === value)?.description}
      </p>
    </div>
  );
}

export default TaskTypeSelector;
