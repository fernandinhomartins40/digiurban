
import React from "react";
import { ParentMessage } from "@/services/education/communication";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, AlertCircle, Calendar, Users, School } from "lucide-react";

interface MessageListProps {
  messages: ParentMessage[];
  onViewMessage: (message: ParentMessage) => void;
}

export function MessageList({ messages, onViewMessage }: MessageListProps) {
  const getMessageTypeIcon = (type: ParentMessage['message_type']) => {
    switch (type) {
      case 'announcement':
        return <School className="h-4 w-4" />;
      case 'notice':
        return <AlertCircle className="h-4 w-4" />;
      case 'reminder':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'report':
        return <Users className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getMessageTypeBadge = (type: ParentMessage['message_type']) => {
    let variant: "default" | "secondary" | "outline" = "outline";
    let label = "";

    switch (type) {
      case 'announcement':
        label = "Comunicado";
        variant = "default";
        break;
      case 'notice':
        label = "Aviso";
        variant = "secondary";
        break;
      case 'reminder':
        label = "Lembrete";
        variant = "outline";
        break;
      case 'meeting':
        label = "Reunião";
        variant = "default";
        break;
      case 'report':
        label = "Relatório";
        variant = "outline";
        break;
      default:
        label = "Mensagem";
    }

    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        messages.map(message => (
          <Card key={message.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">
                  {message.is_important && (
                    <AlertCircle className="h-4 w-4 text-red-500 inline mr-1" />
                  )}
                  {message.title}
                </h3>
                {getMessageTypeBadge(message.message_type)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {message.content}
              </p>
              <div className="flex items-center text-xs text-muted-foreground justify-between">
                <div className="flex items-center">
                  {getMessageTypeIcon(message.message_type)}
                  <span className="ml-1">De: {message.sender_name}</span>
                </div>
                <span>
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewMessage(message)}
              >
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
