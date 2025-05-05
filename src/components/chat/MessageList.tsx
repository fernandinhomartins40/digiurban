
import React, { useRef, useEffect } from "react";
import { Message } from "@/contexts/ChatContext";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  onLoadMoreMessages: () => void;
}

export function MessageList({ messages, onLoadMoreMessages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4"
      ref={messageContainerRef}
      onScroll={(e) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0) {
          onLoadMoreMessages();
        }
      }}
    >
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>Não há mensagens nesta conversa ainda.</p>
          <p>Envie uma mensagem para iniciar a conversa.</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.sender === "admin"}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
