
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { User, Users, Link } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  onSelect,
}: ConversationListProps) {
  // Format date to be more user friendly
  const formatLastMessageTime = (timeString: string | undefined) => {
    if (!timeString) return "";
    
    const date = new Date(timeString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return format(date, "HH:mm", { locale: ptBR });
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return format(date, "EEEE", { locale: ptBR });
    } else {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="flex items-center p-3 rounded-md cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={() => onSelect(conversation.id)}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
            {conversation.type === "citizen" ? <User size={20} /> : <Users size={20} />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className="font-medium truncate">{conversation.participantName}</span>
              {conversation.lastMessageTime && (
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatLastMessageTime(conversation.lastMessageTime)}
                </span>
              )}
            </div>
            
            {/* Show protocols if available */}
            {conversation.protocolIds && conversation.protocolIds.length > 0 && (
              <div className="flex gap-1 flex-wrap my-1">
                {conversation.protocolIds.slice(0, 2).map((protocol, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0 h-4">
                    <Link className="h-3 w-3 mr-1" /> {protocol}
                  </Badge>
                ))}
                {conversation.protocolIds.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0 h-4">
                    +{conversation.protocolIds.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            {conversation.lastMessage && (
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            )}
          </div>
          
          {conversation.unreadCount > 0 && (
            <Badge className="ml-2">{conversation.unreadCount}</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
