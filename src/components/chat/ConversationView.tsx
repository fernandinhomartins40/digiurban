
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageBubble } from "./MessageBubble";

export function ConversationView() {
  const { user } = useAuth();
  const { 
    activeConversationId, 
    messages, 
    sendMessage
  } = useChat();
  
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get active messages
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  if (!activeConversationId) return null;

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {activeMessages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              message={msg}
              isCurrentUser={user?.id === msg.senderId}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
