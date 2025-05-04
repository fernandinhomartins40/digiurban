
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CitizenChatView } from "@/components/chat/CitizenChatView";

export default function CitizenChatPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Heading 
        title="Chat de Atendimento" 
        description="Converse com nossos atendentes para tirar dúvidas"
      />
      
      <Separator />

      <Card className="h-[calc(100vh-13rem)]">
        <CitizenChatView />
      </Card>
    </div>
  );
}
