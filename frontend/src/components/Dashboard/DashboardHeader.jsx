import { Cloud, Leaf, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardHeader() {
  return (
    <header className="mb-12 animate-fade-in text-center flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 mb-6 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
          Live Carbon Tracking
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 drop-shadow-sm">
        Green Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Orchestrator</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-5">
        Optimize your cloud infrastructure for <span className="text-gray-900 font-medium">lowest carbon impact</span> and <span className="text-gray-900 font-medium">highest performance</span>.
      </p>

      <Link
        to="/docs"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
      >
        <Code2 className="w-4 h-4" />
        SDK Docs & Integration Guide
      </Link>
    </header>
  );
}

export default DashboardHeader;
