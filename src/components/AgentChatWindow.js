import React, { useState, useEffect, useRef } from 'react';
import { AgentSocket } from '../services/agent_socket';
const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    return (
        <div style={{ height: '400px', overflowY: 'scroll', padding: '10px', background: '#f8f9fa', border: '1px solid #ddd' }}>
            {messages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.sender === 'agent' ? 'right' : 'left', marginBottom: '10px' }}>
                    <span style={{
                        display: 'inline-block', padding: '8px 12px', borderRadius: '15px',
                        background: msg.sender === 'agent' ? '#28a745' : '#ffffff', // Agent message green, User message white
                        color: msg.sender === 'agent' ? 'white' : 'black',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                    }}>
                        {msg.text}
                    </span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

const InputBox = ({ onSend, isConnected }) => {
    const [input, setInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && isConnected) {
            onSend(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? "Type your reply..." : "Disconnected. Cannot send."}
                disabled={!isConnected}
                style={{ flexGrow: 1, padding: '8px', border: '1px solid #ced4da', borderRadius: '4px 0 0 4px', outline: 'none' }}
            />
            <button type="submit" disabled={!isConnected} style={{ padding: '8px 15px', background: isConnected ? '#28a745' : '#ccc', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: isConnected ? 'pointer' : 'not-allowed' }}>
                Send
            </button>
        </form>
    );
};


const AgentChatWindow = ({ session, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const onMsgReceive = (data) => {
            const sender = (data.sender_role === 'user') ? 'user' : 'system';
            if (data.message) {
                setMessages(prev => [...prev, { text: data.message, sender }]);
            } else if (data.event === 'connection_success') {
                setMessages(prev => [...prev, { text: `System: Connected to user session.`, sender: 'system' }]);
            }
        };

        const onStatusChange = (status) => {
            setIsConnected(status);
        };

        socketRef.current = new AgentSocket(session.session_id, onMsgReceive, onStatusChange);
        socketRef.current.connect();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [session.session_id]);

    const handleSend = (messageText) => {
        setMessages(prev => [...prev, { text: messageText, sender: 'agent' }]);

        socketRef.current?.sendMessage(messageText);
    };

    return (
        <div style={{ width: '100%', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
            <div style={{ background: '#0056b3', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Chatting with: **{session.user_id ? session.user_id.split(':').pop() : 'N/A'}** ({session.client_id})</span>
                <span style={{ background: isConnected ? 'lightgreen' : 'red', color: isConnected ? 'black' : 'white', padding: '0 5px', borderRadius: '3px' }}>
                    {isConnected ? 'LIVE' : 'DISCONNECTED'}
                </span>
                <button onClick={onBack} style={{ marginLeft: '10px', padding: '5px 10px', background: '#dc3545', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
                    Close Chat
                </button>
            </div>

            <MessageList messages={messages} />

            <InputBox onSend={handleSend} isConnected={isConnected} />
        </div>
    );
};

export default AgentChatWindow;