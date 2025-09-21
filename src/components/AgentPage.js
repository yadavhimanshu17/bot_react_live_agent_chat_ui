import React, { useEffect, useState } from "react";
import ConversationList from "./ConversationList";
import AgentChatWindow from "./AgentChatWindow";
import { fetchActiveConversations } from "../services/api";

export default function AgentPage({ clientId }) {
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!clientId) return;

        const load = async () => {
            const convs = await fetchActiveConversations(clientId);
            setConversations(convs || []);
        };

        // Initial load
        load();

        // Poll every 4 seconds
        const poll = setInterval(load, 4000);

        return () => clearInterval(poll);
    }, [clientId]);

    return (
        <div className="flex gap-4">
            <ConversationList
                conversations={conversations}
                onSelect={(c) => setSelected(c)}
                selectedConversationId={selected?.session_id}
            />
            <div className="flex-1">
                <AgentChatWindow session={selected} clientId={clientId} />
            </div>
        </div>
    );
}
