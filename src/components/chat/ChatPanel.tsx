
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaperPlane, Paperclip, User, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  isUserMessage: boolean;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
};

type Contact = {
  id: string;
  name: string;
  department?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
  status?: "online" | "offline" | "away";
};

export function ChatPanel() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const isAdmin = user?.role === "prefeito" || user?.role === "admin";

  // Demo data - would come from API
  const citizenContacts: Contact[] = [
    {
      id: "dept-1",
      name: "Secretaria de Saúde",
      lastMessage: "Sua solicitação foi recebida",
      lastMessageTime: "10:30",
      unread: 2,
    },
    {
      id: "dept-2",
      name: "Ouvidoria Municipal",
      lastMessage: "Protocolo #12345 aberto",
      lastMessageTime: "Ontem",
      unread: 0,
    },
  ];

  const adminContacts: Contact[] = [
    {
      id: "user-1",
      name: "João da Silva",
      department: "Cidadão",
      lastMessage: "Preciso de informações sobre...",
      lastMessageTime: "11:45",
      unread: 1,
      status: "online",
    },
    {
      id: "admin-1",
      name: "Maria Oliveira",
      department: "Finanças",
      lastMessage: "Por favor revise o documento",
      lastMessageTime: "09:30",
      unread: 0,
      status: "offline",
    },
  ];

  // Demo messages - would come from API
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "dept-1": [
      {
        id: "m1",
        sender: "Secretaria de Saúde",
        senderId: "dept-1",
        content: "Olá! Como posso ajudar?",
        timestamp: "2023-10-15T10:30:00",
        isUserMessage: false,
      },
      {
        id: "m2",
        sender: user?.name || "Você",
        senderId: user?.id || "user",
        content: "Gostaria de informações sobre agendamento de consultas",
        timestamp: "2023-10-15T10:32:00",
        isUserMessage: true,
      },
      {
        id: "m3",
        sender: "Secretaria de Saúde",
        senderId: "dept-1",
        content: "Claro! Para agendar uma consulta, você precisa...",
        timestamp: "2023-10-15T10:35:00",
        isUserMessage: false,
      },
    ],
    "user-1": [
      {
        id: "m1",
        sender: "João da Silva",
        senderId: "user-1",
        content: "Preciso de informações sobre como solicitar uma certidão negativa de débitos",
        timestamp: "2023-10-15T11:45:00",
        isUserMessage: false,
      },
      {
        id: "m2",
        sender: user?.name || "Você",
        senderId: user?.id || "admin",
        content: "Olá João! Você pode solicitar através do portal do cidadão, na seção Finanças > Certidões.",
        timestamp: "2023-10-15T11:47:00",
        isUserMessage: true,
      },
    ],
  });

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: user?.name || "Você",
      senderId: user?.id || "user",
      content: message,
      timestamp: new Date().toISOString(),
      isUserMessage: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const ContactItem = ({ contact }: { contact: Contact }) => (
    <div
      className={cn(
        "flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-100",
        activeChat === contact.id && "bg-primary/10"
      )}
      onClick={() => setActiveChat(contact.id)}
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
        {contact.department === "Cidadão" ? (
          <User size={20} />
        ) : (
          <Users size={20} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <span className="font-medium truncate">{contact.name}</span>
          {contact.lastMessageTime && (
            <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
          )}
        </div>
        {contact.department && (
          <span className="text-xs text-gray-500 block">{contact.department}</span>
        )}
        {contact.lastMessage && (
          <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
        )}
      </div>
      {contact.unread && contact.unread > 0 ? (
        <span className="h-5 w-5 bg-primary rounded-full text-white text-xs flex items-center justify-center ml-2">
          {contact.unread}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="rounded-full h-12 w-12 shadow-lg"
        variant={isPanelOpen ? "outline" : "default"}
      >
        {isPanelOpen ? <X /> : <PaperPlane />}
      </Button>

      {/* Chat Panel */}
      {isPanelOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[600px] bg-white rounded-lg shadow-xl border flex flex-col">
          {/* Panel Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat digiUrbis</h3>
          </div>

          {/* Panel Content */}
          <Tabs defaultValue={isAdmin ? "citizens" : "departments"} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 m-2">
              {isAdmin ? (
                <>
                  <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
                  <TabsTrigger value="departments">Departamentos</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="departments">Departamentos</TabsTrigger>
                  <TabsTrigger value="support">Suporte</TabsTrigger>
                </>
              )}
            </TabsList>

            {isAdmin ? (
              <>
                <TabsContent value="citizens" className="flex-1 flex flex-col m-0">
                  {activeChat && messages[activeChat] ? (
                    <div className="flex flex-col flex-1">
                      {/* Chat Header */}
                      <div className="p-3 border-b flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveChat(null)}
                          className="mr-2"
                        >
                          <X size={16} />
                        </Button>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {adminContacts.find((c) => c.id === activeChat)?.name || "Chat"}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {adminContacts.find((c) => c.id === activeChat)?.department || ""}
                          </p>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                          {messages[activeChat].map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex",
                                msg.isUserMessage ? "justify-end" : "justify-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[80%] rounded-lg p-3",
                                  msg.isUserMessage
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-800"
                                )}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 block text-right mt-1">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Paperclip size={18} />
                          </Button>
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite sua mensagem..."
                            className="flex-1"
                          />
                          <Button size="sm" onClick={sendMessage}>
                            <PaperPlane size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-2">
                        {adminContacts
                          .filter((c) => c.department === "Cidadão")
                          .map((contact) => (
                            <ContactItem key={contact.id} contact={contact} />
                          ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="departments" className="flex-1 flex flex-col m-0">
                  {/* Similar structure for departments tab */}
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-2">
                      {adminContacts
                        .filter((c) => c.department !== "Cidadão")
                        .map((contact) => (
                          <ContactItem key={contact.id} contact={contact} />
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsContent value="departments" className="flex-1 flex flex-col m-0">
                  {activeChat && messages[activeChat] ? (
                    <div className="flex flex-col flex-1">
                      {/* Chat Header */}
                      <div className="p-3 border-b flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveChat(null)}
                          className="mr-2"
                        >
                          <X size={16} />
                        </Button>
                        <h4 className="font-medium flex-1">
                          {citizenContacts.find((c) => c.id === activeChat)?.name || "Chat"}
                        </h4>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                          {messages[activeChat].map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex",
                                msg.isUserMessage ? "justify-end" : "justify-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[80%] rounded-lg p-3",
                                  msg.isUserMessage
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-800"
                                )}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 block text-right mt-1">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Paperclip size={18} />
                          </Button>
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite sua mensagem..."
                            className="flex-1"
                          />
                          <Button size="sm" onClick={sendMessage}>
                            <PaperPlane size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-2">
                        {citizenContacts.map((contact) => (
                          <ContactItem key={contact.id} contact={contact} />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="support" className="flex-1 flex flex-col m-0 p-3">
                  <div className="flex items-center justify-center h-full flex-col space-y-3 text-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Suporte digiUrbis</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Precisa de ajuda? Nossa equipe de suporte está disponível de segunda a
                      sexta, das 8h às 18h.
                    </p>
                    <Button>Iniciar Conversa</Button>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
}
