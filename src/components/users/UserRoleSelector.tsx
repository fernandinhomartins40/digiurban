
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface UserRoleSelectorProps {
  role: string;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  onRoleChange: (value: string) => void;
}

export function UserRoleSelector({ 
  role, 
  showConfirmation, 
  setShowConfirmation, 
  onRoleChange 
}: UserRoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Função no Sistema</Label>
        <Select 
          value={role} 
          onValueChange={onRoleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="prefeito">Prefeito</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showConfirmation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            Você está prestes a conceder privilégios de Prefeito a este usuário.
            Esta ação dará acesso completo a todas as funcionalidades do sistema.
            Tem certeza que deseja continuar?
          </AlertDescription>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onRoleChange("admin");
                setShowConfirmation(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmation(false)}
            >
              Confirmar
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
}
