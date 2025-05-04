
import React from "react";
import { cn } from "@/lib/utils";

interface Reaction {
  type: string;
  userId: string;
  userName: string;
}

interface MessageReactionsProps {
  reactions: Reaction[];
}

export function MessageReactions({ reactions }: MessageReactionsProps) {
  // Count reactions by type
  const reactionCounts = reactions.reduce<Record<string, number>>((counts, reaction) => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    return counts;
  }, {});
  
  // Get unique reaction types
  const reactionTypes = Object.keys(reactionCounts);
  
  return (
    <div className="flex items-center gap-1 mt-1">
      {reactionTypes.map(type => (
        <div 
          key={type}
          className="flex items-center bg-background border rounded-full py-0.5 px-1.5 text-xs shadow-sm"
          title={reactions
            .filter(r => r.type === type)
            .map(r => r.userName)
            .join(", ")
          }
        >
          <span>{type}</span>
          {reactionCounts[type] > 1 && (
            <span className="ml-1">{reactionCounts[type]}</span>
          )}
        </div>
      ))}
    </div>
  );
}
