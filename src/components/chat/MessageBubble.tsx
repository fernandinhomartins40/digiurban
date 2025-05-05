
import { cn } from "@/lib/utils";
import { Message } from "@/contexts/ChatContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  // Format timestamp
  const timestamp = new Date(message.timestamp);
  const formattedTime = format(timestamp, "HH:mm", { locale: ptBR });

  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-full rounded-lg px-4 py-3",
          isCurrentUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-muted text-foreground rounded-tl-none"
        )}
      >
        {!isCurrentUser && (
          <div className="text-xs font-medium mb-1">{message.senderName}</div>
        )}
        <p className="text-sm break-words whitespace-pre-wrap">{message.text || message.content}</p>
        
        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className={cn(
                  "text-xs p-2 rounded flex items-center",
                  isCurrentUser ? "bg-primary-foreground/20" : "bg-background"
                )}
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
        
        <span
          className={cn(
            "text-xs opacity-70 block text-right mt-1",
            !message.read && !isCurrentUser && "font-medium"
          )}
        >
          {formattedTime}
          {isCurrentUser && (
            <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
          )}
        </span>
      </div>
    </div>
  );
}
