
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface UserTabsProps {
  activeTab: string;
  children: React.ReactNode;
}

export function UserTabs({ activeTab, children }: UserTabsProps) {
  const navigate = useNavigate();

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate(`/admin/users?tab=${value}`, { replace: true });
  };

  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="roles">Funções</TabsTrigger>
        <TabsTrigger value="analytics">Análises</TabsTrigger>
        <TabsTrigger value="logs">Registros</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
}
