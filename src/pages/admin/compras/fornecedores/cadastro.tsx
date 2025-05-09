
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { createSupplier } from "@/services/administration/purchase/suppliers";
import { Supplier } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

type SupplierFormData = Omit<Supplier, "id" | "createdAt" | "updatedAt">;

export default function FornecedorCadastroPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SupplierFormData>({
    defaultValues: {
      isActive: true
    }
  });
  
  const onSubmit = async (data: SupplierFormData) => {
    const result = await createSupplier(data);
    if (result) {
      navigate("/admin/compras/fornecedores");
    }
  };
  
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
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Fornecedor</h1>
          <p className="text-muted-foreground">
            Adicione um novo fornecedor ao sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome/Razão Social</label>
                <Input
                  id="name"
                  placeholder="Nome completo do fornecedor"
                  {...register("name", { required: "Nome é obrigatório" })}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  {...register("cnpj", { required: "CNPJ é obrigatório" })}
                />
                {errors.cnpj && <p className="text-sm text-red-500">{errors.cnpj.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@fornecedor.com"
                  {...register("email", { required: "Email é obrigatório" })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register("phone", { required: "Telefone é obrigatório" })}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Endereço</label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  {...register("address", { required: "Endereço é obrigatório" })}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    {...register("city", { required: "Cidade é obrigatória" })}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">Estado (UF)</label>
                  <Input
                    id="state"
                    placeholder="UF"
                    maxLength={2}
                    {...register("state", { required: "Estado é obrigatório" })}
                  />
                  {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/compras/fornecedores")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Fornecedor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
