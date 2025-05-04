
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MoreHorizontal,
  Send,
  PaperclipIcon,
  X,
  Tag,
} from "lucide-react";
import { useChat, Message, Conversation, Contact } from "@/contexts/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageItem } from "./MessageItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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

  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [newTag, setNewTag] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const currentUser = { id: "current-user-id" }; // This should come from auth context

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeConversationId]);

  if (!activeConversation || !activeConversationId) return null;

  const conversationMessages = messages[activeConversationId] || [];

  const getContactInfo = () => {
    if (!activeConversation) return null;
    return contacts.find((c) => c.id === activeConversation.participantId);
  };

  const contactInfo = getContactInfo();

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;

    sendMessage(activeConversationId, messageText);
    setMessageText("");
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && activeConversationId) {
      addTagToConversation(activeConversationId, newTag.trim());
      setNewTag("");
      setShowTagPopover(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleLoadMoreMessages = () => {
    loadMoreMessages(activeConversationId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback>
              {activeConversation.participantName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">
              {activeConversation.participantName || "Usuário"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {contactInfo?.status === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {activeConversation.protocolIds && activeConversation.protocolIds.length > 0 && (
            <Badge variant="outline" className="mr-2">
              Protocolo: {activeConversation.protocolIds[0]}
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowTagPopover(true)}
              >
                Adicionar tag
              </DropdownMenuItem>
              {activeConversation.status !== "closed" && (
                <DropdownMenuItem
                  onClick={() => closeConversation(activeConversationId)}
                >
                  Encerrar conversa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tags */}
      {activeConversation.tags && activeConversation.tags.length > 0 && (
        <div className="p-2 flex flex-wrap gap-1 border-b">
          {activeConversation.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={messageContainerRef}
        onScroll={(e) => {
          const { scrollTop } = e.currentTarget;
          if (scrollTop === 0) {
            handleLoadMoreMessages();
          }
        }}
      >
        {conversationMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>Não há mensagens nesta conversa ainda.</p>
            <p>Envie uma mensagem para iniciar a conversa.</p>
          </div>
        ) : (
          <>
            {conversationMessages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender === "citizen"}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {activeConversation.status !== "closed" ? (
        <>
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 border-t flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="bg-muted rounded-md p-1 pl-2 flex items-center text-xs"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeAttachment(index)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Message input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <PaperclipIcon size={20} />
            </Button>
            <Input
              className="flex-1"
              placeholder="Digite sua mensagem..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageText.trim() && attachments.length === 0}
            >
              <Send size={18} />
            </Button>
          </div>
        </>
      ) : (
        <div className="p-4 text-center border-t text-muted-foreground">
          <p>Esta conversa foi encerrada.</p>
        </div>
      )}

      {/* Tag popover */}
      <Popover open={showTagPopover} onOpenChange={setShowTagPopover}>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Adicionar tag</h4>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nome da tag"
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddTag}>
                <Tag size={16} />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
