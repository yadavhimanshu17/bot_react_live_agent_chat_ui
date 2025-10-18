
import React, { useState } from "react";
import AgentDashboard from "./components/AgentDashboard";

export default function App() {
  const [clientId, setClientId] = useState("");

  const effectiveClientId = clientId.trim() === '' ? 'ALL' : clientId.trim();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Live Agent UI</h2>

      <div className="mb-4" style={{ marginBottom: '20px' }}>
        Client ID Filter:
        <input
          className="border px-2 py-1 ml-2"
          placeholder="Type Client ID or leave blank for ALL"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ border: '1px solid #ccc', padding: '5px', marginLeft: '10px' }}
        />
        <small style={{ marginLeft: '15px', color: '#6c757d' }}>
          *Currently filtering sessions for: <strong>{effectiveClientId}</strong>
        </small>
      </div>

      {/* AgentDashboard ko effectiveClientId pass kiya */}
      <AgentDashboard clientId={effectiveClientId} />
    </div>
  );
}