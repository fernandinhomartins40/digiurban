
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getSupplierById } from "@/services/administration/purchase/suppliers";

export default function FornecedorDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: supplier, isLoading } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="py-8 text-center">Carregando informações do fornecedor...</div>;
  }

  if (!supplier) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Fornecedor não encontrado</h2>
        <Button onClick={() => navigate("/admin/compras/fornecedores")}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={() => navigate("/admin/compras/fornecedores")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
          <p className="text-muted-foreground">
            Detalhes do fornecedor
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome/Razão Social</h3>
              <p className="text-md font-medium">{supplier.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CNPJ</h3>
              <p className="text-md font-medium">{supplier.cnpj}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-md font-medium">{supplier.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
              <p className="text-md font-medium">{supplier.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
              <p className="text-md font-medium">{supplier.address}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Cidade/UF</h3>
              <p className="text-md font-medium">{supplier.city}/{supplier.state}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-md font-medium">{supplier.isActive ? "Ativo" : "Inativo"}</p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/compras/fornecedores")}
            >
              Voltar para lista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
