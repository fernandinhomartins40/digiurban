
import React, { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message, Reaction } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmilePlus, ArrowRight } from "lucide-react";
import { MessageReactions } from "./MessageReactions";
import { format } from "date-fns";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  onReactionAdded?: (messageId: string, reaction: string) => void;
}

export function MessageItem({ 
  message, 
  isCurrentUser,
  onReactionAdded 
}: MessageItemProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const reactions: Reaction[] = message.reactions || [];
  
  const handleReaction = (emoji: string) => {
    setShowReactionPicker(false);
    if (onReactionAdded) {
      onReactionAdded(message.id, emoji);
    }
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, "HH:mm");
    } catch (error) {
      return "";
    }
  };

  // Check if the message is a reply to another message
  const isReply = !!message.replyToId;
  
  return (
    <div className={`group flex gap-2 items-end mb-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            {message.senderName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="relative max-w-[75%]">
        {/* Message content with timestamp and read receipts */}
        <div
          className={`rounded-lg p-3 ${
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {!isCurrentUser && (
            <div className="text-xs font-medium mb-1">{message.senderName}</div>
          )}
          
          {/* Reply reference if applicable */}
          {isReply && (
            <div className={`p-2 mb-1 rounded-md text-xs ${isCurrentUser ? "bg-primary-foreground/20" : "bg-background/80"}`}>
              <div className="flex items-center">
                <ArrowRight className="mr-1 h-3 w-3" />
                <span className="opacity-70">Respondendo a uma mensagem</span>
              </div>
            </div>
          )}
          
          {/* Message content */}
          <p className="text-sm break-words">{message.text || message.content}</p>
          
          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded flex items-center ${
                    isCurrentUser ? "bg-primary-foreground/20" : "bg-background"
                  }`}
                >
                  <span className="truncate flex-1">{attachment.name}</span>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 underline"
                  >
                    Abrir
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {/* Timestamp and read receipts */}
          <div className={`text-xs opacity-70 flex items-center justify-end gap-1 mt-1 ${!message.read && !isCurrentUser && "font-medium"}`}>
            <span>{formatTime(message.timestamp)}</span>
            {isCurrentUser && (
              <span>{message.read ? "✓✓" : "✓"}</span>
            )}
          </div>
        </div>
        
        {/* Reaction button */}
        <button
          className={`absolute bottom-0 ${isCurrentUser ? 'left-0 -translate-x-full -translate-y-1/2' : 'right-0 translate-x-full -translate-y-1/2'} 
          opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-background border shadow-sm hover:bg-accent`}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
        >
          <SmilePlus size={16} />
        </button>
        
        {/* Reaction picker */}
        {showReactionPicker && (
          <div className={`absolute z-10 ${isCurrentUser ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'} 
          bottom-0 bg-background border rounded-lg shadow-md p-2`}>
            <div className="flex gap-1">
              {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                <button 
                  key={emoji}
                  className="p-1 hover:bg-accent rounded-md"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Display reactions */}
        {reactions && reactions.length > 0 && (
          <div className={`mt-1 flex justify-${isCurrentUser ? 'end' : 'start'}`}>
            <MessageReactions reactions={reactions} />
          </div>
        )}
      </div>
    </div>
  );
}
