import axios from "axios";
import { connectLiveAgentSocket, sendAgentMessage } from "./socket";

const BACKEND = process.env.REACT_APP_BACKEND_HTTP || "http://localhost:8000";

// -------------------------
// Fetch Active Conversations
// -------------------------
export const fetchActiveConversations = async (clientId) => {
    try {
        const r = await axios.get(`${BACKEND}/live_agent_sessions/conversations/${clientId}`);
        console.log("[React] fetchActiveConversations:", r.data);
        return r.data || [];
    } catch (e) {
        console.error("[React] fetchActiveConversations error:", e);
        return [];
    }
};

// -------------------------
// Start Live Agent Session
// -------------------------
export const startLiveAgent = async (clientId, userId, onMessage, onOpen) => {
    try {
        console.log("[React] Starting live agent for:", clientId, userId);

        const r = await axios.post(`${BACKEND}/live_agent_sessions/start`, {
            client_id: clientId,
            user_id: userId,
            channel: "web",
            message: "User requested live agent"
        }, { timeout: 10000 }); // 🔹 timeout increased

        const sessionId = r.data.session_id;
        console.log("[React] LiveAgent sessionId from backend:", sessionId);

        // Connect WebSocket
        const ws = connectLiveAgentSocket(sessionId, onMessage, onOpen);
        return ws;

    } catch (e) {
        console.error("[React] Failed to start live agent:", e);
        return null;
    }
};

// -------------------------
// Send message to agent
// -------------------------
export const sendMessageToAgent = (ws, text, metadata = {}) => {
    if (!ws) {
        console.error("[React] WebSocket not initialized");
        return false;
    }
    return sendAgentMessage(ws, text, metadata);
};
