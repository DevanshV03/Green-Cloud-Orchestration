import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RenewableImpactSimulator from "./pages/RenewableImpactSimulator";
import SDKDocs from "./pages/SDKDocs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/simulator" element={<RenewableImpactSimulator />} />
        <Route path="/docs" element={<SDKDocs />} />
      </Routes>
    </Router>
  );
}

export default App;
