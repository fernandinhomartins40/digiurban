
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import PendingEnrollmentsTab from "./PendingEnrollmentsTab";
import ApprovedEnrollmentsTab from "./ApprovedEnrollmentsTab";
import EnrollmentStatusTab from "./EnrollmentStatusTab";

export default function MatriculasIndex() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Matrícula Escolar</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Matrículas</CardTitle>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pb-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <PendingEnrollmentsTab />
          </TabsContent>
          
          <TabsContent value="approved">
            <ApprovedEnrollmentsTab />
          </TabsContent>
          
          <TabsContent value="stats">
            <EnrollmentStatusTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
