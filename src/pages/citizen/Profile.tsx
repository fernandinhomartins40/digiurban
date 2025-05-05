
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function CitizenProfile() {
  const { user } = useAuth();

  // Safely access metadata - Account for different user types
  // First check if it's a CitizenUser type with user_metadata, otherwise fall back to regular user_metadata field
  const userMetadata = user?.user_metadata || {};

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Meu Perfil</title>
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie suas informações pessoais
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p>{user?.name || userMetadata.name || "Nome não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-mail</p>
              <p>{user?.email || "E-mail não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p>{userMetadata.cpf || "CPF não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p>{userMetadata.phone || "Telefone não disponível"}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline">Editar Perfil</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">CEP</p>
              <p>{userMetadata.zipcode || "CEP não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Logradouro</p>
              <p>{userMetadata.street || "Endereço não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número</p>
              <p>{userMetadata.number || "Número não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bairro</p>
              <p>{userMetadata.neighborhood || "Bairro não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cidade</p>
              <p>{userMetadata.city || "Cidade não disponível"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <p>{userMetadata.state || "Estado não disponível"}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline">Atualizar Endereço</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
