import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Code2,
    Rocket,
    Copy,
    Check,
    ArrowLeft,
    Globe,
    Zap,
    Leaf,
    Shield,
    ChevronRight,
    Terminal,
    Layout,
    Server,
} from "lucide-react";

const API_BASE = "https://green-cloud-orchestration.onrender.com";

// ─── Reusable Code Block with Copy ─────────────────────────────
function CodeBlock({ code, language = "html", title }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {title && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {title}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-600">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-5 overflow-x-auto text-sm leading-relaxed font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
}

// ─── Step Card ──────────────────────────────────────────────────
function StepCard({ number, icon: Icon, title, description, children }) {
    return (
        <div className="relative bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -left-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold shadow-md">
                    {number}
                </span>
            </div>
            <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="p-2 rounded-lg bg-green-50">
                    <Icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
            {children}
        </div>
    );
}

// ─── Feature Pill ───────────────────────────────────────────────
function Feature({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="p-2.5 rounded-xl bg-green-50 h-fit">
                <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function SDKDocs() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white">
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

                {/* Back Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Hero */}
                <header className="text-center space-y-5">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 shadow-sm">
                        <Code2 className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                            Developer Guide
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Green Cloud{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                            SDK
                        </span>
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        A lightweight JavaScript SDK that automatically routes your users
                        to the greenest, fastest, or most balanced server —{" "}
                        <span className="text-gray-800 font-medium">
                            with just one script tag.
                        </span>
                    </p>
                </header>

                {/* Features Grid */}
                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Feature
                        icon={Leaf}
                        title="Carbon-Aware Routing"
                        desc="Routes traffic to regions with the lowest carbon intensity using live Electricity Maps data."
                    />
                    <Feature
                        icon={Zap}
                        title="Latency-Optimized"
                        desc="Measures real-time RTT from each user's browser to all configured regions."
                    />
                    <Feature
                        icon={Globe}
                        title="Multi-Region"
                        desc="Supports AWS and GCP regions worldwide with automatic zone detection."
                    />
                    <Feature
                        icon={Shield}
                        title="Zero Config"
                        desc="No build step needed — just add a script tag and call one function."
                    />
                    <Feature
                        icon={Server}
                        title="Server Map"
                        desc="Define where each region resolves to — EC2 IPs, custom domains, or load balancers."
                    />
                    <Feature
                        icon={Layout}
                        title="Dashboard UI"
                        desc="Configure your preferences visually — or manage everything via the API."
                    />
                </section>

                {/* How It Works — Flow */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-green-500 to-teal-500" />
                        How It Works
                    </h2>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: "1",
                                    title: "Save Preferences",
                                    desc: "In the Dashboard, select your cloud provider, regions, task type, and map your server URLs.",
                                    color: "bg-blue-50 text-blue-600",
                                },
                                {
                                    step: "2",
                                    title: "Embed the SDK",
                                    desc: "Add a single <script> tag to your website's landing page. No npm install needed.",
                                    color: "bg-purple-50 text-purple-600",
                                },
                                {
                                    step: "3",
                                    title: "SDK Measures & Decides",
                                    desc: "On page load, the SDK pings all regions, fetches live carbon data, and picks the best server.",
                                    color: "bg-amber-50 text-amber-600",
                                },
                                {
                                    step: "4",
                                    title: "Auto Redirect",
                                    desc: "The user's browser is seamlessly redirected to the optimal server based on your preferences.",
                                    color: "bg-green-50 text-green-600",
                                },
                            ].map((item) => (
                                <div key={item.step} className="text-center space-y-3">
                                    <div
                                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${item.color}`}
                                    >
                                        {item.step}
                                    </div>
                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Integration Steps */}
                <section className="space-y-12">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-green-500 to-teal-500" />
                        Integration Guide
                    </h2>

                    {/* Step 1 */}
                    <StepCard
                        number="1"
                        icon={Layout}
                        title="Configure via the Dashboard"
                        description="Visit the Green Cloud Orchestrator dashboard and set up your application's preferences. All configuration is stored in our database — your SDK reads it automatically."
                    >
                        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <ChevronRight className="w-4 h-4 text-green-500" />
                                <span>
                                    <strong>Application URL</strong> — your website domain (e.g.{" "}
                                    <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                                        https://renovae.in
                                    </code>
                                    )
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <ChevronRight className="w-4 h-4 text-green-500" />
                                <span>
                                    <strong>Task Type</strong> — Green Optimized, Performance, or
                                    Balanced
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <ChevronRight className="w-4 h-4 text-green-500" />
                                <span>
                                    <strong>Cloud Provider & Zones</strong> — AWS or GCP +
                                    selected regions
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <ChevronRight className="w-4 h-4 text-green-500" />
                                <span>
                                    <strong>Server Map</strong> — map each region to your deployed
                                    server URL
                                </span>
                            </div>
                        </div>
                    </StepCard>

                    {/* Step 2 */}
                    <StepCard
                        number="2"
                        icon={Code2}
                        title="Add the SDK Script Tag"
                        description="Embed the Green Cloud SDK in your website's HTML. It's a single script tag — no build tools or npm packages required."
                    >
                        <CodeBlock
                            title="Your website's index.html"
                            code={`<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your page content -->

    <!-- Green Cloud SDK -->
    <script src="${API_BASE}/sdk/green-cloud.js"></script>
</body>
</html>`}
                        />
                    </StepCard>

                    {/* Step 3 – Option A */}
                    <StepCard
                        number="3a"
                        icon={Rocket}
                        title="Auto-Route (Easiest)"
                        description="Call GreenCloud.route() and the SDK handles everything — latency measurement, API call, and redirection — automatically."
                    >
                        <CodeBlock
                            title="Automatic routing — one line"
                            code={`<script src="${API_BASE}/sdk/green-cloud.js"></script>
<script>
  // Automatically redirect to the best server
  GreenCloud.route("https://your-app-url.com");
</script>`}
                        />
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                            <strong>💡 Tip:</strong> The app URL must match what you entered
                            in the Dashboard. The SDK uses it to look up your saved
                            preferences.
                        </div>
                    </StepCard>

                    {/* Step 3 – Option B */}
                    <StepCard
                        number="3b"
                        icon={Terminal}
                        title="Manual Route (More Control)"
                        description="If you need to show a loading screen, log analytics, or customize the experience, call recommend() manually and handle the redirect yourself."
                    >
                        <CodeBlock
                            title="Manual control with custom UI"
                            code={`<script src="${API_BASE}/sdk/green-cloud.js"></script>
<script>
  async function init() {
    // Show loading spinner...
    document.getElementById("status").textContent = "Finding best server...";

    // Get recommendation (measures latency + fetches carbon data)
    const result = await GreenCloud.recommend("https://your-app-url.com");

    // result contains:
    // {
    //   recommendedDataCenter: { id, regionName, greenScore, carbonIntensity, ... },
    //   targetServerUrl: "https://ca.your-app.com",
    //   allRegions: [...],
    //   carbonSavings: 42.5
    // }

    console.log("Best region:", result.recommendedDataCenter.regionName);
    console.log("Target URL:", result.targetServerUrl);
    console.log("Carbon savings:", result.carbonSavings + "%");

    // Redirect after showing results
    setTimeout(() => {
      window.location.href = result.targetServerUrl;
    }, 3000);
  }

  init();
</script>`}
                        />
                    </StepCard>

                    {/* Step 3 – Option C */}
                    <StepCard
                        number="3c"
                        icon={Server}
                        title="With Local Server Map (Override)"
                        description="You can pass a server map directly in JavaScript instead of (or in addition to) saving it in the Dashboard. Useful for dynamic environments."
                    >
                        <CodeBlock
                            title="Local server map override"
                            code={`<script src="${API_BASE}/sdk/green-cloud.js"></script>
<script>
  GreenCloud.route("https://your-app-url.com", {
    // Override or supplement the Dashboard server map
    serverMap: {
      "ca-central-1":   "https://ca.your-app.com",
      "ap-south-1":     "https://in.your-app.com",
      "ap-southeast-1": "https://sg.your-app.com",
    },
    // Fallback if no region matches
    fallbackUrl: "https://your-app.com",
  });
</script>`}
                        />
                    </StepCard>
                </section>

                {/* API Reference */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-green-500 to-teal-500" />
                        API Reference
                    </h2>

                    <div className="space-y-4">
                        {/* Method 1 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <code className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-mono font-bold">
                                    GreenCloud.route(appUrl, options?)
                                </code>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                                    async
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                All-in-one method. Measures latency, calls the recommendation
                                API, and automatically redirects the user to the best server.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                                                Param
                                            </th>
                                            <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                                                Type
                                            </th>
                                            <th className="text-left py-2 text-gray-500 font-medium">
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 pr-4">
                                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                                    appUrl
                                                </code>
                                            </td>
                                            <td className="py-2 pr-4 text-gray-500">string</td>
                                            <td className="py-2">
                                                The application URL registered in the Dashboard
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-2 pr-4">
                                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                                    options.serverMap
                                                </code>
                                            </td>
                                            <td className="py-2 pr-4 text-gray-500">object?</td>
                                            <td className="py-2">
                                                Local override:{" "}
                                                <code className="text-xs bg-gray-100 px-1 rounded">
                                                    {"{ regionCode: url }"}
                                                </code>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4">
                                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                                    options.fallbackUrl
                                                </code>
                                            </td>
                                            <td className="py-2 pr-4 text-gray-500">string?</td>
                                            <td className="py-2">
                                                URL to redirect to if routing fails
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Method 2 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <code className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-mono font-bold">
                                    GreenCloud.recommend(appUrl)
                                </code>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                                    async
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Returns the recommendation result without redirecting. Use this
                                when you want full control over what happens after the
                                recommendation.
                            </p>
                            <CodeBlock
                                title="Response shape"
                                language="json"
                                code={`{
  "recommendedDataCenter": {
    "id": "ca-central-1",
    "regionName": "Canada Central",
    "greenScore": 12.4,
    "carbonIntensity": 28,
    "estimatedLatency": 145,
    "provider": "AWS"
  },
  "targetServerUrl": "https://ca.your-app.com",
  "allRegions": [ ... ],
  "carbonSavings": 42.5,
  "timestamp": "2026-03-04T..."
}`}
                            />
                        </div>

                        {/* Method 3 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <code className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-mono font-bold">
                                    GreenCloud.setApiBase(url)
                                </code>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Override the auto-detected API base URL. Useful if you
                                self-host the Green Cloud backend. By default, the SDK
                                auto-detects the API base from its own script
                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded ml-1">
                                    src
                                </code>{" "}
                                attribute.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Architecture Diagram */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-green-500 to-teal-500" />
                        Architecture
                    </h2>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm font-mono text-sm leading-loose text-gray-700">
                        <pre className="overflow-x-auto whitespace-pre">{`┌──────────────────┐        ┌──────────────────────────────────┐
│   Developer      │        │  Green Cloud Orchestrator         │
│                  │  ───►  │                                  │
│ • Saves prefs    │  (1)   │  Dashboard (Netlify)             │
│   in Dashboard   │        │  └─► Saves to MongoDB            │
└──────────────────┘        └──────────────────────────────────┘

┌──────────────────┐        ┌──────────────────────────────────┐
│   End User       │        │  Green Cloud API (Render)        │
│                  │  ───►  │                                  │
│ • Visits the     │  (2)   │  GET /api/recommend/regions      │
│   developer's    │ ◄────  │  → Returns regions to ping       │
│   website        │  (3)   │                                  │
│                  │  ───►  │  POST /api/recommend/decide      │
│ • SDK loads      │  (4)   │  → Latency + Carbon → Best pick │
│   automatically  │ ◄────  │  → Returns targetServerUrl       │
│                  │  (5)   │                                  │
│ • Browser        │        └──────────────────────────────────┘
│   redirects to   │
│   best server ──►│──── https://ca.developer-app.com ──────►
└──────────────────┘`}</pre>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-8 border-t border-gray-200">
                    <p className="text-sm text-gray-400">
                        Green Cloud Orchestrator — Sustainable Cloud Routing
                    </p>
                </footer>
            </div>
        </div>
    );
}
