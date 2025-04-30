import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationView } from "./ConversationView";
import { ConversationList } from "./ConversationList";
import { EmptyState } from "./EmptyState";
import { CreateConversationDialog } from "./CreateConversationDialog";

export function AdminChatView() {
  const { 
    conversations,
    activeConversationId,
    messages,
    setActiveConversation
  } = useChat();
  
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);

  // Filter conversations by type
  const citizenConversations = conversations.filter(
    (conv) => conv.type === "citizen"
  );
  
  const internalConversations = conversations.filter(
    (conv) => conv.type === "internal"
  );

  const renderChatContent = () => {
    // If an active conversation is selected, show its messages
    if (activeConversationId && messages[activeConversationId]) {
      return <ConversationView />;
    } 
    
    // Otherwise, show the current tab's content
    return (
      <Tabs defaultValue="citizens" className="flex-1 flex flex-col">
        <div className="p-2 border-b flex items-center justify-between">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="citizens">Cidadãos</TabsTrigger>
            <TabsTrigger value="internal">Interno</TabsTrigger>
          </TabsList>
          
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setShowNewConversationDialog(true)}
            title="Nova conversa interna"
          >
            <Plus size={16} />
          </Button>
        </div>

        <TabsContent value="citizens" className="flex-1 m-0">
          {citizenConversations.length === 0 ? (
            <EmptyState
              title="Nenhuma conversa com cidadãos"
              description="Não existem conversas ativas com cidadãos relacionadas ao seu departamento."
            />
          ) : (
            <ScrollArea className="flex-1 p-3">
              <ConversationList
                conversations={citizenConversations}
                onSelect={setActiveConversation}
              />
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="internal" className="flex-1 m-0">
          <div className="flex flex-col h-full">
            {internalConversations.length === 0 ? (
              <EmptyState
                title="Nenhuma conversa interna"
                description="Não existem conversas internas ativas. Clique no + para iniciar uma nova conversa."
              />
            ) : (
              <ScrollArea className="flex-1 p-3">
                <ConversationList
                  conversations={internalConversations}
                  onSelect={setActiveConversation}
                />
              </ScrollArea>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Chat administrativo</h3>
        {activeConversationId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveConversation(null)}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderChatContent()}
      </div>

      {/* Create conversation dialog */}
      <CreateConversationDialog
        open={showNewConversationDialog}
        onOpenChange={setShowNewConversationDialog}
      />
    </div>
  );
}
