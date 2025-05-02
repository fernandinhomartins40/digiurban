
import React from "react";
import { ParentMessage } from "@/services/education/communication";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, ArrowLeft, Calendar, Mail, Paperclip, School, Users } from "lucide-react";

interface MessageDetailProps {
  message: ParentMessage | null;
  onBack: () => void;
  onReply?: (message: ParentMessage) => void;
}

export function MessageDetail({ message, onBack, onReply }: MessageDetailProps) {
  if (!message) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Selecione uma mensagem para visualizar</p>
        </CardContent>
      </Card>
    );
  }

  const getMessageTypeLabel = (type: ParentMessage['message_type']) => {
    switch (type) {
      case 'announcement': return "Comunicado";
      case 'notice': return "Aviso";
      case 'reminder': return "Lembrete";
      case 'meeting': return "Reunião";
      case 'report': return "Relatório";
      default: return "Mensagem";
    }
  };

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Badge className="mr-2">
            {getMessageTypeLabel(message.message_type)}
          </Badge>
          {message.is_important && (
            <Badge variant="destructive">Importante</Badge>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{message.title}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              {getMessageTypeIcon(message.message_type)}
              <span className="ml-1">De: {message.sender_name}</span>
            </div>
            <span className="mt-1 sm:mt-0">
              {format(new Date(message.created_at), "PPpp", { locale: ptBR })}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        <div className="prose max-w-none">
          <p>{message.content}</p>
        </div>
        
        {message.attachment_urls && message.attachment_urls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Paperclip className="h-4 w-4 mr-1" />
              Anexos
            </h3>
            <div className="space-y-2">
              {message.attachment_urls.map((url, index) => (
                <div key={index} className="flex items-center p-2 border rounded-md">
                  <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Arquivo {index + 1}</span>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <a href={url} target="_blank" rel="noreferrer">
                      Visualizar
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        {onReply && (
          <Button onClick={() => onReply(message)} className="ml-auto">
            Responder
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
