
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserManagementHeaderProps {
  onAddUser: () => void;
  onRefresh: () => void;
}

export function UserManagementHeader({ onAddUser, onRefresh }: UserManagementHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários administrativos do sistema, suas funções e permissões.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
        <Button onClick={onAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          {isMobile ? "Adicionar" : "Adicionar Usuário"}
        </Button>
      </div>
    </div>
  );
}
