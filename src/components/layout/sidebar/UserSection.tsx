
import React from "react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const UserSection = () => {
  const { logout, user } = useAuth();

  return (
    <div className="p-4 border-t">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
          <p className="text-xs text-gray-500">{user?.role === "prefeito" ? "Prefeito" : "Administrador"}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2" 
        onClick={() => logout()}
      >
        <LogOut size={16} />
        <span>Sair</span>
      </Button>
    </div>
  );
};
