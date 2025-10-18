const WS_BASE_URL = 'wss://852a4e61c008.ngrok-free.app';

export class AgentSocket {
    constructor(sessionId, onMessageReceived, onConnectionStatusChange) {
        this.sessionId = sessionId;
        this.onMessageReceived = onMessageReceived;
        this.onConnectionStatusChange = onConnectionStatusChange;
        this.ws = null;
        this.url = `${WS_BASE_URL}/ws/live_agent/${sessionId}`;
    }

    connect = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

        this.ws = new WebSocket(this.url);
        this.onConnectionStatusChange(false);

        this.ws.onopen = () => {
            this.onConnectionStatusChange(true);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessageReceived(data);
            } catch (e) {
                console.error("Agent WS: Error parsing message:", e);
            }
        };

        this.ws.onclose = () => {
            this.onConnectionStatusChange(false);
            console.log(`Agent WS for ${this.sessionId} closed.`);
        };

        this.ws.onerror = (error) => {
            console.error('Agent WS Error:', error);
            this.ws.close();
        };
    };

    sendMessage = (messageText) => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const payload = {
                message: messageText,
                sender_role: "agent",
                metadata: {}
            };
            this.ws.send(JSON.stringify(payload));
            return true;
        }
        return false;
    };

    disconnect = () => {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    };
}