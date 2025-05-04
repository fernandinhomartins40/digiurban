
import React, { useState } from "react";
import { ChatMessage } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { 
  Reply, 
  Smile, 
  MoreVertical, 
  Copy, 
  Trash, 
  Forward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageReactions } from "./MessageReactions";
import { MessageAttachments } from "./MessageAttachments";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";

interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  onReply: () => void;
  conversationId: string;
}

export function MessageItem({ message, isCurrentUser, onReply, conversationId }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);
  const { addReaction, messages } = useChat();
  
  // Format timestamp
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get replied message text if this is a reply
  const repliedMessage = message.replyToMessageId && message.replyToContent 
    ? message.replyToContent 
    : message.replyToMessageId 
      ? messages[conversationId]?.find(msg => msg.id === message.replyToMessageId)?.content 
      : null;

  // Handle message copy
  const copyMessage = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      description: "Mensagem copiada para a área de transferência",
    });
  };
  
  // Handle adding reaction
  const handleAddReaction = (emoji: string) => {
    addReaction(conversationId, message.id, emoji);
  };
  
  // Special styles for system messages
  if (message.senderType === "system") {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-muted/50 rounded-md px-4 py-2 text-xs text-center max-w-[80%]">
          {message.content}
          {message.protocolId && (
            <Badge variant="outline" className="ml-2">
              {message.protocolId}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn(
        "max-w-[85%] space-y-1",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        {/* Reply reference */}
        {repliedMessage && (
          <div className={cn(
            "px-4 py-1 text-xs rounded-lg mb-1 max-w-[90%] opacity-80",
            isCurrentUser 
              ? "mr-2 bg-primary/10 text-primary" 
              : "ml-2 bg-muted text-muted-foreground"
          )}>
            <div className="flex items-center gap-1">
              <Reply className="h-3 w-3" />
              <span className="font-medium truncate">{message.replyToContent ? "Em resposta a" : "Mensagem citada"}</span>
            </div>
            <p className="truncate">{repliedMessage}</p>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          "group relative rounded-lg p-3",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}>
          {!isCurrentUser && (
            <span className="text-xs font-medium block mb-1">{message.senderName}</span>
          )}
          
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              <MessageAttachments attachments={message.attachments} />
            </div>
          )}
          
          {/* Message info */}
          <div className={cn(
            "flex items-center gap-2 mt-1",
            isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className={cn(
              "text-xs",
              isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {formatTime(message.timestamp)}
            </span>
            
            {isCurrentUser && message.read && (
              <span className={cn(
                "text-xs",
                "text-primary-foreground/70"
              )}>
                ✓ Lido
              </span>
            )}
          </div>
          
          {/* Message actions */}
          {showActions && (
            <div className={cn(
              "absolute -top-3 flex items-center gap-1 shadow-sm p-1 rounded-full bg-background border",
              isCurrentUser ? "left-0" : "right-0"
            )}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
                onClick={onReply}
                title="Responder"
              >
                <Reply className="h-3 w-3" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    title="Reagir"
                  >
                    <Smile className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="grid grid-cols-6 gap-2">
                    {["👍", "❤️", "😂", "😮", "😢", "🎉"].map(emoji => (
                      <button 
                        key={emoji}
                        className="text-lg p-1 hover:bg-muted rounded"
                        onClick={() => handleAddReaction(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    title="Mais opções"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCurrentUser ? "start" : "end"}>
                  <DropdownMenuItem onClick={copyMessage}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copiar texto</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onReply}>
                    <Reply className="mr-2 h-4 w-4" />
                    <span>Responder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ description: "Funcionalidade em desenvolvimento" })}>
                    <Forward className="mr-2 h-4 w-4" />
                    <span>Encaminhar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isCurrentUser && (
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => toast({ description: "Funcionalidade em desenvolvimento" })}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn(
            "flex",
            isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <MessageReactions reactions={message.reactions} />
          </div>
        )}
      </div>
    </div>
  );
}
