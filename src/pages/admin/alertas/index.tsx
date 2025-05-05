
import React from "react";
import { AlertsConfig } from "@/components/dashboard/alerts/AlertsConfig";
import { AlertNotifications } from "@/components/dashboard/alerts/AlertNotifications";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <Heading 
        title="Sistema de Alertas" 
        description="Configure e gerencie alertas para métricas importantes dos dashboards" 
      />
      
      <Tabs defaultValue="config">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="config" className="flex-1">Configuração</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="mt-6">
          <AlertsConfig />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <AlertNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
