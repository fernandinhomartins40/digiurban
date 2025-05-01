
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import MenusTab from "./MenusTab";
import DietsTab from "./DietsTab";
import FeedbackTab from "./FeedbackTab";

export default function MerendaIndex() {
  const [activeTab, setActiveTab] = useState("menus");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Merenda Escolar</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento da Merenda Escolar</CardTitle>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pb-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="menus">Cardápios</TabsTrigger>
            <TabsTrigger value="diets">Dietas Especiais</TabsTrigger>
            <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menus">
            <MenusTab />
          </TabsContent>
          
          <TabsContent value="diets">
            <DietsTab />
          </TabsContent>
          
          <TabsContent value="feedback">
            <FeedbackTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
