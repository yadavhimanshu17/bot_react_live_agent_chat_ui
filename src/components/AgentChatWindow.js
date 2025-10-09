import React, { useEffect, useRef, useState } from "react";
import { connectLiveAgentSocket, sendAgentMessage } from "../services/socket";
import { endLiveAgentSession } from "../services/api";

export default function AgentChatWindow({ session, clientId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [ending, setEnding] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        setMessages([]);
        if (!session) return;

        const ws = connectLiveAgentSocket(
            session.session_id,
            (msg) => {
                if (msg.event === "session_ended") {
                    setMessages(prev => [
                        ...prev,
                        { text: "Session ended by system", sender: "system", timestamp: Date.now() }
                    ]);
                    try { wsRef.current && wsRef.current.close(); } catch (e) { }
                    return;
                }
                if (msg.event === "peer_disconnected") {
                    setMessages(prev => [
                        ...prev,
                        { text: `Peer disconnected (${msg.which})`, sender: "system", timestamp: Date.now() }
                    ]);
                    return;
                }

                const sender = msg.from_agent ? "agent" : "user";
                const text = msg.message || msg.text || "";
                setMessages(prev => [...prev, { text, sender, timestamp: Date.now() }]);
            },
            () => console.log("agent ws open")
        );

        wsRef.current = ws;

        return () => {
            try { ws && ws.close(); } catch (e) { }
            wsRef.current = null;
        };
    }, [session]);

    const handleSend = async () => {
        if (!input || !session) return;
        setMessages(prev => [...prev, { text: input, sender: "agent", timestamp: Date.now() }]);
        const meta = { client_id: clientId, user_id: session.user_id };
        const ok = sendAgentMessage(wsRef.current, input, meta);

        if (!ok) {
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

    const handleEndSession = async () => {
        if (!session || ending) return;
        setEnding(true);
        try {
            await endLiveAgentSession(session.session_id);
            setMessages(prev => [...prev, { text: "You ended the session.", sender: "system", timestamp: Date.now() }]);
            try { wsRef.current && wsRef.current.close(); } catch (e) { }

        } catch (e) {
            console.error("Failed to end session:", e);
            setMessages(prev => [...prev, { text: "Failed to end session (try again).", sender: "system", timestamp: Date.now() }]);
        } finally {
            setEnding(false);
        }
    };

    const formatTime = (ts) => {
        const date = new Date(ts);
        return isNaN(date) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (!session) return <div className="text-gray-500">Select a session</div>;

    return (
        <div className="border rounded p-3 h-[520px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Session: {session.user_id}</div>
                <button
                    onClick={handleEndSession}
                    disabled={ending}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    {ending ? "Ending..." : "End Session"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-3">
                {messages.map((m, i) => {
                    const isAgent = m.sender === "agent";
                    const isUser = m.sender === "user";
                    const isSystem = m.sender === "system";

                    const alignment = isAgent ? "justify-end" : isUser ? "justify-start" : "justify-center";
                    const bubbleClass = isAgent
                        ? "bg-green-200 text-black"
                        : isUser
                            ? "bg-blue-200 text-black"
                            : "bg-gray-200 italic text-gray-700";
                    const senderLabel = isAgent ? "You" : isUser ? "User" : "";

                    return (
                        <div key={i} className={`flex my-2 ${alignment}`}>
                            <div className="max-w-[70%]">
                                <div className={`p-2 rounded ${bubbleClass}`}>{m.text}</div>
                                {!isSystem && (
                                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                                        <span>{senderLabel}</span>
                                        <span>{formatTime(m.timestamp)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    className="flex-1 border px-2 py-1 rounded"
                />
                <button onClick={handleSend} className="bg-green-600 text-white px-4 py-1 rounded">Send</button>
            </div>
        </div>
    );
}
