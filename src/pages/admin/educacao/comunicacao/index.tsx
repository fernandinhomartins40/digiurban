
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "@/components/education/communication/MessageList";
import { MessageDetail } from "@/components/education/communication/MessageDetail";
import { MessageForm } from "@/components/education/communication/MessageForm";
import { MessageFilters } from "@/components/education/communication/MessageFilters";
import { ParentMessage, fetchMessages, sendMessage } from "@/services/education/communication";
import { useToast } from "@/components/ui/use-toast";

export default function ComunicacaoPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [filters, setFilters] = useState({
    search: "",
    messageType: "all",
    recipientType: "all",
  });

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as mensagens",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [toast]);

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    // Text search filter
    if (
      filters.search &&
      !message.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !message.content.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    
    // Message type filter
    if (filters.messageType !== "all" && message.message_type !== filters.messageType) {
      return false;
    }
    
    // Recipient type filter
    if (filters.recipientType !== "all" && message.recipient_type !== filters.recipientType) {
      return false;
    }
    
    return true;
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewMessage = (message: ParentMessage) => {
    setSelectedMessage(message);
  };

  const handleNewMessage = () => {
    setActiveTab("compose");
    setSelectedMessage(null);
  };

  const handleSendMessage = async (messageData: Omit<ParentMessage, 'id' | 'created_at' | 'updated_at' | 'read_by'>) => {
    try {
      const newMessage = await sendMessage(messageData);
      setMessages((prev) => [newMessage, ...prev]);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      });
      
      setActiveTab("inbox");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Portal de Comunicação</h2>
        <p className="text-muted-foreground">
          Comunicação entre escola, professores e pais.
        </p>
      </div>

      <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="inbox">Caixa de Entrada</TabsTrigger>
            <TabsTrigger value="sent">Enviados</TabsTrigger>
            <TabsTrigger value="compose">Compor Mensagem</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inbox" className="space-y-4">
          <MessageFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onNewMessage={handleNewMessage}
            filters={{
              messageType: filters.messageType,
              recipientType: filters.recipientType,
            }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <MessageList
                  messages={filteredMessages}
                  onViewMessage={handleViewMessage}
                />
              )}
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-[600px]">
                <CardContent className="p-0">
                  <MessageDetail
                    message={selectedMessage}
                    onBack={() => setSelectedMessage(null)}
                    onReply={(message) => {
                      setActiveTab("compose");
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <MessageFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onNewMessage={handleNewMessage}
            filters={{
              messageType: filters.messageType,
              recipientType: filters.recipientType,
            }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <MessageList
                  messages={filteredMessages.filter(m => m.sender_id === "current-user-id")}
                  onViewMessage={handleViewMessage}
                />
              )}
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-[600px]">
                <CardContent className="p-0">
                  <MessageDetail
                    message={selectedMessage}
                    onBack={() => setSelectedMessage(null)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compose">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Nova Mensagem</h3>
              <MessageForm
                onSubmit={handleSendMessage}
                onCancel={() => setActiveTab("inbox")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
