
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsTab from "./StudentsTab";
import TeachersTab from "./TeachersTab";

export default function AlunosProfessoresIndex() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Alunos e Professores</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie cadastros de alunos e professores da rede municipal
        </p>
      </div>

      <Tabs
        defaultValue="students"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <StudentsTab />
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-4">
          <TeachersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
