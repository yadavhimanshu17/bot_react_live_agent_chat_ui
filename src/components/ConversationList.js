import React from "react";

export default function ConversationList({ conversations, onSelect, selectedConversationId }) {
    return (
        <div className="w-80 border p-2 h-[520px] overflow-y-auto">
            <h3 className="font-semibold mb-2">Active Conversations</h3>
            {conversations.length === 0 && <div className="text-gray-500">No active conversations</div>}
            {conversations.map(conv => (
                <div key={conv.session_id} onClick={() => onSelect(conv)} className={`p-2 rounded mb-2 cursor-pointer ${selectedConversationId === conv.session_id ? 'bg-blue-100' : 'bg-white'}`}>
                    <div className="font-medium">{conv.user_id}</div>
                    <div className="text-sm text-gray-600">{conv.message || "No messages yet"}</div>
                    <div className="text-xs text-gray-400">{conv.started_at}</div>
                </div>
            ))}
        </div>
    );
}
