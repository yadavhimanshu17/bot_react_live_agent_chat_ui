const API_BASE_URL = 'http://localhost:8000';

export const fetchActiveSessions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/handoff/active_sessions`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Agent API Error: Failed to fetch active sessions:", error);
        return [];
    }
};