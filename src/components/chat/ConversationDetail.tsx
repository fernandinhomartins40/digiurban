
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { ConversationHeader } from "./ConversationHeader";
import { TagsList } from "./TagsList";
import { MessageList } from "./MessageList";
import { MessageInputArea } from "./MessageInputArea";
import { ConversationTagDialog } from "./ConversationTagDialog";

interface ConversationDetailProps {
  onBack: () => void;
}

export function ConversationDetail({ onBack }: ConversationDetailProps) {
  const {
    activeConversationId,
    messages,
    activeConversation,
    contacts,
    sendMessage,
    closeConversation,
    loadMoreMessages,
    addTagToConversation,
  } = useChat();

  const [showTagPopover, setShowTagPopover] = useState(false);

  if (!activeConversation || !activeConversationId) return null;

  const conversationMessages = messages[activeConversationId] || [];

  const getContactInfo = () => {
    if (!activeConversation) return null;
    return contacts.find((c) => c.id === activeConversation.participantId);
  };

  const contactInfo = getContactInfo();

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    sendMessage(activeConversationId, text);
  };

  const handleLoadMoreMessages = () => {
    loadMoreMessages(activeConversationId);
  };

  const handleAddTag = (tag: string) => {
    if (tag && activeConversationId) {
      addTagToConversation(activeConversationId, tag);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <ConversationHeader
        conversation={activeConversation}
        contactInfo={contactInfo}
        onBack={onBack}
        onAddTag={() => setShowTagPopover(true)}
        onCloseConversation={closeConversation}
      />

      {/* Tags */}
      <TagsList tags={activeConversation.tags} />

      {/* Messages */}
      <MessageList 
        messages={conversationMessages} 
        onLoadMoreMessages={handleLoadMoreMessages} 
      />

      {/* Input area */}
      <MessageInputArea
        conversationStatus={activeConversation.status || "active"}
        onSendMessage={handleSendMessage}
      />

      {/* Tag dialog */}
      <ConversationTagDialog
        open={showTagPopover}
        onOpenChange={setShowTagPopover}
        onAddTag={handleAddTag}
      />
    </div>
  );
}
