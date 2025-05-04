
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, X } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MessageBubble } from "./MessageBubble";
import { AttachmentPreview } from "./AttachmentPreview";

export function ConversationView() {
  const { user } = useAuth();
  const { 
    activeConversationId, 
    messages, 
    conversations,
    sendMessage,
    closeConversation,
    loadMoreMessages
  } = useChat();
  
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find active conversation
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  if (!activeConversationId || !activeConversation) return null;

  const handleSendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || !activeConversationId) return;
    sendMessage(activeConversationId, message, attachments);
    setMessage("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAttachments = Array.from(files);
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const canSendMessage = activeConversation.status === "active";

  return (
    <>
      {/* Conversation Header */}
      <div className="p-3 border-b flex items-center">
        <div className="flex-1">
          <h4 className="font-medium">{activeConversation.title}</h4>
          {activeConversation.protocolIds && activeConversation.protocolIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Protocolo: {activeConversation.protocolIds[0]}
              </span>
              <Badge variant="outline" className="text-xs">
                {activeConversation.status === "active" ? "Ativo" : "Arquivado"}
              </Badge>
            </div>
          )}
        </div>
        
        {canSendMessage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => closeConversation(activeConversationId)}
          >
            Encerrar
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {/* Load more button */}
          <div className="flex justify-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => loadMoreMessages(activeConversationId)}
            >
              Carregar mensagens anteriores
            </Button>
          </div>

          {activeMessages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              message={msg}
              isCurrentUser={user?.id === msg.senderId}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="p-2 border-t flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={index}
              file={file}
              onRemove={() => removeAttachment(index)}
            />
          ))}
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 border-t">
        {canSendMessage ? (
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAttachFile}
              title="Anexar arquivo"
            >
              <Paperclip size={18} />
            </Button>
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
        ) : (
          <div className="text-center text-sm text-gray-500 py-2">
            Esta conversa foi encerrada e não permite mais mensagens.
          </div>
        )}
      </div>
    </>
  );
}
