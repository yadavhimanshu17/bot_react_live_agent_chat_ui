import React, { useEffect, useRef, useState } from "react";
import { connectLiveAgentSocket, sendAgentMessage } from "../services/socket";

export default function AgentChatWindow({ session, clientId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const wsRef = useRef(null);

    useEffect(() => {
        setMessages([]);
        if (!session) return;

        const ws = connectLiveAgentSocket(session.session_id, (msg) => {
            const text = msg.message || msg.text || "";
            setMessages(prev => [...prev, { text, sender: "user", ts: Date.now() }]);
        }, () => console.log('agent ws open'));
        wsRef.current = ws;

        return () => { try { if (ws) ws.close(); } catch (e) { } wsRef.current = null; };
    }, [session]);

    const handleSend = async () => {
        if (!input || !session) return;
        setMessages(prev => [...prev, { text: input, sender: "agent", ts: Date.now() }]);
        const meta = { client_id: clientId, user_id: session.user_id };
        const ok = sendAgentMessage(wsRef.current, input, meta);
        if (!ok) {
            // REST fallback
            try {
                await fetch(`${process.env.REACT_APP_BACKEND_HTTP}/live_agent_sessions/forward`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_id: session.session_id, message: input, metadata: meta })
                });
            } catch (e) { console.error(e); }
        }
        setInput("");
    };

    if (!session) return <div className="text-gray-500">Select a session</div>;

    return (
        <div className="border rounded p-3 h-[520px] flex flex-col">
            <div className="font-semibold mb-2">Session: {session.user_id}</div>
            <div className="flex-1 overflow-y-auto mb-3">
                {messages.map((m, i) => (<div key={i} className={`my-2 ${m.sender === 'agent' ? 'text-right' : ''}`}>{m.text}</div>))}
            </div>

            <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 border px-2 py-1 rounded" />
                <button onClick={handleSend} className="bg-green-600 text-white px-4 py-1 rounded">Send</button>
            </div>
        </div>
    );
}
