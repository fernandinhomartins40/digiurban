
import React, { useTransition } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/types/auth";
import { UniversalRequestsDashboard } from "@/components/requests/UniversalRequestsDashboard";
import { toast } from "@/hooks/use-toast";

export default function UniversalRequestsPage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você precisa estar autenticado para acessar esta página.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdminUser(user)) {
    toast({
      title: "Acesso Restrito",
      description: "Apenas usuários administrativos podem acessar esta página.",
      variant: "destructive",
    });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você não tem permissão para acessar esta página.</p>
        </CardContent>
      </Card>
    );
  }

  const userDepartment = isAdminUser(user) ? user.department : undefined;
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Solicitações | Painel Universal</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Painel Universal de Solicitações
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie todas as solicitações do departamento {userDepartment || ""}
        </p>
      </div>

      <UniversalRequestsDashboard 
        departmentFilter={userDepartment}
        useTransition={startTransition}
        isPending={isPending}
      />
    </div>
  );
}
