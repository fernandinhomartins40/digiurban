
import React, { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SendHorizontal, Loader2, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";

export default function CitizenChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the chat context
  const { conversations, activeConversation, sendMessage, selectConversation } = useChat();

  // Filter only citizen conversations
  const citizenConversations = conversations.filter(conv => conv.type === "citizen");
  
  // Find or create a default conversation for the user
  useEffect(() => {
    const userConversation = citizenConversations.find(
      conv => conv.participantId === user?.id
    );
    
    if (userConversation && !activeConversation) {
      selectConversation(userConversation.id);
    }
  }, [citizenConversations, activeConversation, user?.id, selectConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!activeConversation) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível identificar a conversa ativa.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await sendMessage(activeConversation, message, "citizen");
      setMessage("");
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Heading 
        title="Chat de Atendimento" 
        description="Converse com nossos atendentes para tirar dúvidas"
      />
      
      <Separator />

      <Card className="h-[calc(100vh-13rem)] flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="bg-muted/50 p-4 border-b flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/support-avatar.png" alt="Suporte" />
              <AvatarFallback className="bg-primary/10 text-primary">SP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Atendimento ao Cidadão</p>
              <p className="text-xs text-muted-foreground">Online - Resposta em até 24h</p>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {activeConversation ? (
              activeConversation.messages.length > 0 ? (
                <>
                  {activeConversation.messages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`flex ${msg.sender === "citizen" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "citizen" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "citizen" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex items-center justify-center flex-col">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <User size={32} className="text-primary" />
                  </div>
                  <p className="text-xl font-medium mb-2">Bem-vindo ao Atendimento</p>
                  <p className="text-center text-muted-foreground max-w-md">
                    Envie sua primeira mensagem para iniciar uma conversa com nossa equipe de atendimento.
                  </p>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={loading || !activeConversation}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || loading || !activeConversation}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
