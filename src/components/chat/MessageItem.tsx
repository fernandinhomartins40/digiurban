
import React, { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message, Reaction } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmilePlus } from "lucide-react";
import { MessageReactions } from "./MessageReactions";

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
  
  return (
    <div className={`group flex gap-3 mb-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          <AvatarFallback>
            {message.senderName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`relative max-w-[75%] ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
        <MessageBubble message={message} isCurrentUser={isCurrentUser} />
        
        {/* Reaction button */}
        <button
          className={`absolute bottom-0 ${isCurrentUser ? 'left-0 -translate-x-full -translate-y-1/2' : 'right-0 translate-x-full -translate-y-1/2'} 
          opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-background border shadow-sm hover:bg-accent`}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          aria-label="Add reaction"
        >
          <SmilePlus size={16} />
        </button>
        
        {/* Reaction picker */}
        {showReactionPicker && (
          <div className={`absolute ${isCurrentUser ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'} 
          bottom-0 bg-background border rounded-lg shadow-md p-2 z-10`}>
            <div className="flex gap-1">
              {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                <button 
                  key={emoji}
                  className="p-1.5 hover:bg-accent rounded-md"
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
          <div className={`mt-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <MessageReactions reactions={reactions} />
          </div>
        )}
      </div>
    </div>
  );
}
