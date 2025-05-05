
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
    <div className="flex flex-wrap items-center gap-1">
      {reactionTypes.map(type => (
        <div 
          key={type}
          className="flex items-center bg-background border rounded-full py-0.5 px-2 text-xs shadow-sm hover:bg-accent transition-colors"
          title={reactions
            .filter(r => r.type === type)
            .map(r => r.userName)
            .join(", ")
          }
        >
          <span className="mr-0.5">{type}</span>
          {reactionCounts[type] > 1 && (
            <span className="font-medium">{reactionCounts[type]}</span>
          )}
        </div>
      ))}
    </div>
  );
}
