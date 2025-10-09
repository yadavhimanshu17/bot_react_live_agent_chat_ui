import axios from "axios";
import { connectLiveAgentSocket, sendAgentMessage } from "./socket";

const BACKEND = process.env.REACT_APP_BACKEND_HTTP || "http://localhost:8000";


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


export const startLiveAgent = async (clientId, userId, onMessage, onOpen) => {
    try {
        console.log("[React] Starting live agent for:", clientId, userId);

        const r = await axios.post(`${BACKEND}/live_agent_sessions/start`, {
            client_id: clientId,
            user_id: userId,
            channel: "web",
            message: "User requested live agent"
        }, { timeout: 10000 });

        const sessionId = r.data.session_id;
        console.log("[React] LiveAgent sessionId from backend:", sessionId);

        const ws = connectLiveAgentSocket(sessionId, onMessage, onOpen);
        return ws;

    } catch (e) {
        console.error("[React] Failed to start live agent:", e);
        return null;
    }
};

export const sendMessageToAgent = (ws, text, metadata = {}) => {
    if (!ws) {
        console.error("[React] WebSocket not initialized");
        return false;
    }
    return sendAgentMessage(ws, text, metadata);
};


export const endLiveAgentSession = async (sessionId) => {
    try {
        const r = await axios.post(`${BACKEND}/live_agent_sessions/end/${sessionId}`);
        return r.data;
    } catch (e) {
        console.error("[React] endLiveAgentSession error:", e);
        throw e;
    }
};  