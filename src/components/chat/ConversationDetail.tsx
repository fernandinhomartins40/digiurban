
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  ArrowLeft,
  MoreVertical,
  Reply,
  Smile,
  Tag,
  LinkIcon,
  FileText,
  X,
  PlusCircle
} from "lucide-react";
import { useChat, ChatMessage } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageItem } from "./MessageItem";
import { AttachmentPreview } from "./AttachmentPreview";
import { MessageReactions } from "./MessageReactions";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { LinkProtocolDialog } from "./LinkProtocolDialog";

interface ConversationDetailProps {
  onBack?: () => void;
}

export function ConversationDetail({ onBack }: ConversationDetailProps) {
  const { user } = useAuth();
  const { 
    activeConversationId, 
    messages, 
    conversations,
    contacts,
    sendMessage,
    closeConversation,
    loadMoreMessages,
    addTagToConversation,
  } = useChat();
  
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showLinkProtocolDialog, setShowLinkProtocolDialog] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Find active conversation
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  
  // Find contact for this conversation
  const conversationContact = activeConversation ? 
    contacts.find(contact => contact.id === activeConversation.contactId) : null;
  
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  
  // Find reply message if replying
  const replyMessage = replyingTo ? 
    activeMessages.find(msg => msg.id === replyingTo) : null;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);
  
  // Simulate "typing" indicator when the other person is typing
  useEffect(() => {
    if (activeConversationId && conversationContact?.status === "online") {
      // 30% chance of showing typing indicator after sending a message
      const randomChance = Math.random() < 0.3;
      
      if (randomChance) {
        const delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
        
        const typingTimeout = setTimeout(() => {
          setIsTyping(true);
          
          // Remove typing indicator after 1-4 seconds
          const typingDuration = Math.floor(Math.random() * 3000) + 1000;
          const typingEndTimeout = setTimeout(() => {
            setIsTyping(false);
          }, typingDuration);
          
          return () => clearTimeout(typingEndTimeout);
        }, delay);
        
        return () => clearTimeout(typingTimeout);
      }
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeMessages.length, activeConversationId, conversationContact?.status]);

  if (!activeConversationId || !activeConversation) return null;

  const handleSendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || !activeConversationId) return;
    sendMessage(activeConversationId, message, attachments, replyingTo || undefined);
    setMessage("");
    setAttachments([]);
    setReplyingTo(null);
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
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddTag = () => {
    if (newTagName.trim() && activeConversationId) {
      addTagToConversation(activeConversationId, newTagName.trim());
      setNewTagName("");
      toast({
        description: `Tag "${newTagName}" adicionada com sucesso.`,
      });
    }
  };

  const canSendMessage = activeConversation.status === "active";

  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="p-4 border-b flex items-center">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="font-medium">{activeConversation.title || conversationContact?.name}</h4>
            {conversationContact?.status === "online" && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">online</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {activeConversation.protocolIds && activeConversation.protocolIds.length > 0 && (
              <>
                <span>Protocolo: {activeConversation.protocolIds[0]}</span>
                {activeConversation.protocolIds.length > 1 && (
                  <span>+{activeConversation.protocolIds.length - 1}</span>
                )}
              </>
            )}
            <Badge variant={activeConversation.status === "active" ? "default" : "outline"} className="text-xs">
              {activeConversation.status === "active" ? "Ativo" : "Encerrado"}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowLinkProtocolDialog(true)}>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Vincular protocolo</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Ver histórico</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {canSendMessage ? (
              <DropdownMenuItem onClick={() => activeConversationId && closeConversation(activeConversationId)}>
                <span className="text-red-600">Encerrar conversa</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => toast({ description: "Esta conversa já foi encerrada." })}>
                <span>Reabrir conversa</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Tags */}
      {activeConversation.tags && activeConversation.tags.length > 0 && (
        <div className="p-2 border-b flex items-center gap-2 flex-wrap">
          {activeConversation.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-muted/50">
              {tag}
            </Badge>
          ))}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Tag</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2">
              <div className="flex gap-2">
                <Input 
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nova tag..."
                  className="text-sm"
                />
                <Button size="sm" onClick={handleAddTag}>
                  Adicionar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
        <div className="space-y-4">
          {/* Load more button */}
          <div className="flex justify-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => activeConversationId && loadMoreMessages(activeConversationId)}
            >
              Carregar mensagens anteriores
            </Button>
          </div>

          {activeMessages.map((msg) => (
            <MessageItem 
              key={msg.id}
              message={msg}
              isCurrentUser={user?.id === msg.senderId}
              onReply={() => setReplyingTo(msg.id)}
              conversationId={activeConversationId}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] flex items-center">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">digitando...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply preview */}
      {replyingTo && replyMessage && (
        <div className="p-2 border-t border-b bg-muted/30 flex items-start">
          <div className="flex-1 px-3 py-1 border-l-2 border-primary ml-2">
            <div className="flex justify-between">
              <span className="text-xs font-medium text-primary">
                Respondendo para {replyMessage.senderName}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0" 
                onClick={() => setReplyingTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {replyMessage.content}
            </p>
          </div>
        </div>
      )}

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
      <div className="p-4 border-t">
        {canSendMessage ? (
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAttachFile}
                title="Anexar arquivo"
              >
                <Paperclip size={18} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Inserir emoji"
                  >
                    <Smile size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-8 gap-2">
                    {["😀", "😂", "😍", "🤔", "😎", "👍", "👎", "❤️", 
                      "🙏", "👏", "🎉", "🔥", "⭐", "💯", "🤝", "👋"].map(emoji => (
                      <button 
                        key={emoji}
                        className="text-xl p-1 hover:bg-muted rounded"
                        onClick={() => setMessage(prev => prev + emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[40px] max-h-[120px] overflow-auto"
                style={{ height: message.split('\n').length > 1 ? 'auto' : '40px' }}
                rows={Math.min(message.split('\n').length, 5)}
              />
            </div>
            <Button onClick={handleSendMessage}>
              <Send size={16} />
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 py-2">
            Esta conversa foi encerrada e não permite mais mensagens.
          </div>
        )}
      </div>
      
      {/* Link Protocol Dialog */}
      <LinkProtocolDialog
        open={showLinkProtocolDialog}
        onOpenChange={setShowLinkProtocolDialog}
        conversationId={activeConversationId}
      />
    </div>
  );
}
