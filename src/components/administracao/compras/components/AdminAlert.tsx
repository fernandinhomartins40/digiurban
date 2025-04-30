
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AdminAlertProps {
  isAdmin: boolean;
}

export function AdminAlert({ isAdmin }: AdminAlertProps) {
  if (!isAdmin) return null;

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Modo Administrador</AlertTitle>
      <AlertDescription>
        Você está com acesso de administrador do setor de Compras.
        Pode visualizar e gerenciar solicitações de todos os setores.
      </AlertDescription>
    </Alert>
  );
}
