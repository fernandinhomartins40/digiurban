
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation, Contact } from "@/contexts/ChatContext";

interface ConversationHeaderProps {
  conversation: Conversation;
  contactInfo: Contact | null;
  onBack: () => void;
  onAddTag: () => void;
  onCloseConversation: (id: string) => Promise<void>;
}

export function ConversationHeader({
  conversation,
  contactInfo,
  onBack,
  onAddTag,
  onCloseConversation,
}: ConversationHeaderProps) {
  return (
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
            {conversation.participantName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">
            {conversation.participantName || "Usuário"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {contactInfo?.status === "online" ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        {conversation.protocolIds && conversation.protocolIds.length > 0 && (
          <Badge variant="outline" className="mr-2">
            Protocolo: {conversation.protocolIds[0]}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddTag}>
              Adicionar tag
            </DropdownMenuItem>
            {conversation.status !== "closed" && (
              <DropdownMenuItem
                onClick={() => onCloseConversation(conversation.id)}
              >
                Encerrar conversa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
