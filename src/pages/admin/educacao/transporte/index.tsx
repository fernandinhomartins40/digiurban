
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehiclesTab from "./VehiclesTab";
import RoutesTab from "./RoutesTab";
import RequestsTab from "./RequestsTab";
import StudentTransportTab from "./StudentTransportTab";

export default function TransporteIndex() {
  const [activeTab, setActiveTab] = useState("vehicles");
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>Transporte Escolar</title>
      </Helmet>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transporte Escolar</h1>
        <p className="text-muted-foreground mt-1">
          Gestão de veículos, rotas e solicitações de transporte escolar
        </p>
      </div>
      
      <Tabs defaultValue="vehicles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="routes">Rotas</TabsTrigger>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles" className="space-y-4">
          <VehiclesTab />
        </TabsContent>
        
        <TabsContent value="routes" className="space-y-4">
          <RoutesTab />
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <StudentTransportTab />
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <RequestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
