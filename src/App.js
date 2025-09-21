import React, { useState } from "react";
import AgentPage from "./components/AgentPage";

export default function App() {
  const [clientId, setClientId] = useState("CFSD001");
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Live Agent UI</h2>
      <div className="mb-4">
        Client ID: <input className="border px-2 py-1 ml-2" value={clientId} onChange={(e) => setClientId(e.target.value)} />
      </div>

      <AgentPage clientId={clientId} />
    </div>
  );
}
