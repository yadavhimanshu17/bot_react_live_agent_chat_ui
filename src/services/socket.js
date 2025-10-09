const WS_BASE = process.env.REACT_APP_BACKEND_WS || "ws://localhost:8000";

export function connectLiveAgentSocket(sessionId, onMessage, onOpen) {
    if (!sessionId) {
        console.warn("[LiveAgent Socket] No sessionId provided");
        return null;
    }

    console.log("[LiveAgent Socket] Connecting with sessionId:", sessionId);

    const url = `${WS_BASE}/ws/live_agent/${encodeURIComponent(sessionId)}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log("[LiveAgent Socket] Opened:", url);
        onOpen && onOpen();
    };

    ws.onmessage = (ev) => {
        try {
            const data = JSON.parse(ev.data);
            console.log("[LiveAgent Socket] Received:", data);

            if (data.from_agent) {
                data.role = "agent";
            } else {
                data.role = "user";
            }

            onMessage(data);
        } catch (e) {
            console.error("[LiveAgent Socket] Message parse error:", e);
        }
    };

    ws.onclose = () => console.log("[LiveAgent Socket] Closed:", url);
    ws.onerror = (err) => console.error("[LiveAgent Socket] Error:", err);

    return ws;
}

export function sendAgentMessage(ws, text, metadata = {}) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error("[LiveAgent] Socket not connected, message not sent:", text);
        return false;
    }

    const payload = { message: text, metadata };
    console.log("[LiveAgent] Sending:", payload);

    ws.send(JSON.stringify(payload));
    return true;
}
