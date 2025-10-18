import React, { useState, useEffect } from 'react';
import { fetchActiveSessions } from '../services/agent_api';
import AgentChatWindow from './AgentChatWindow';

const SessionListItem = ({ session, onSelect, isSelected }) => (
    <div
        onClick={() => onSelect(session)}
        style={{
            padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer',
            background: isSelected ? '#e9ecef' : '#fff',
            borderLeft: isSelected ? '4px solid #007bff' : 'none'
        }}
    >
        <strong>User: {session.user_id ? session.user_id.split(':').pop() : 'N/A'}</strong><br />
        <small>Client: {session.client_id}</small><br />
        <small style={{ color: '#6c757d' }}>Last Msg: {session.last_message || 'Handoff initiated'}</small>
    </div>
);

const AgentDashboard = () => {
    const [activeSessions, setActiveSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadSessions = async () => {
        setIsLoading(true);
        const sessions = await fetchActiveSessions();
        setActiveSessions(sessions);
        if (selectedSession && !sessions.find(s => s.session_id === selectedSession.session_id)) {
            setSelectedSession(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadSessions();
        const interval = setInterval(loadSessions, 5000);
        return () => clearInterval(interval);
    }, [selectedSession]);
    const handleSelectSession = (session) => {
        setSelectedSession(session);
    };

    const handleCloseChat = () => {
        setSelectedSession(null);
        loadSessions();
    };

    return (
        <div style={{ display: 'flex', height: '90vh', maxWidth: '1200px', margin: '20px auto', border: '1px solid #ccc' }}>

            {/* Left Panel: Session List */}
            <div style={{ width: '300px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
                    <h3>Active Handoffs ({activeSessions.length})
                        <button onClick={loadSessions} disabled={isLoading} style={{ float: 'right' }}>
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </button>
                    </h3>
                </div>
                {activeSessions.map(session => (
                    <SessionListItem
                        key={session.session_id}
                        session={session}
                        onSelect={handleSelectSession}
                        isSelected={selectedSession && selectedSession.session_id === session.session_id}
                    />
                ))}
            </div>

            {/* Right Panel: Chat Window */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedSession ? (
                    <AgentChatWindow session={selectedSession} onBack={handleCloseChat} />
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                        Please select a session from the left panel to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;