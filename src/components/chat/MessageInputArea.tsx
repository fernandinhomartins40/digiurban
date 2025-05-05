
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, Send, X } from "lucide-react";

interface MessageInputAreaProps {
  conversationStatus: string;
  onSendMessage: (text: string, attachments?: File[]) => void;
}

export function MessageInputArea({ 
  conversationStatus, 
  onSendMessage 
}: MessageInputAreaProps) {
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;

    onSendMessage(messageText);
    setMessageText("");
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  if (conversationStatus === "closed") {
    return (
      <div className="p-4 text-center border-t text-muted-foreground">
        <p>Esta conversa foi encerrada.</p>
      </div>
    );
  }

  return (
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
                className="h-6 w-6 ml-1"
                onClick={() => removeAttachment(index)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Message input */}
      <div className="p-3 border-t flex items-center gap-2">
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
          className="flex-shrink-0"
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
          className="flex-shrink-0"
          onClick={handleSendMessage}
          disabled={!messageText.trim() && attachments.length === 0}
        >
          <Send size={18} />
        </Button>
      </div>
    </>
  );
}
