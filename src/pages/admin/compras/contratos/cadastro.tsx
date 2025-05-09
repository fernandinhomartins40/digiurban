
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { createContract } from "@/services/administration/purchase/contracts";
import { fetchSuppliers } from "@/services/administration/purchase/suppliers";
import { Contract } from "@/types/administration";

type ContractFormData = Omit<Contract, "id" | "createdAt" | "updatedAt" | "items">;

export default function ContratoCadastroPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ContractFormData>({
    defaultValues: {
      status: "active",
      totalValue: 0
    }
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers", true],
    queryFn: () => fetchSuppliers(true), // Fetch only active suppliers
  });
  
  const onSubmit = async (data: ContractFormData) => {
    // Convert string dates to Date objects
    const formattedData = {
      ...data,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
    
    const result = await createContract(formattedData);
    if (result) {
      navigate("/admin/compras/contratos");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={() => navigate("/admin/compras/contratos")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Contrato</h1>
          <p className="text-muted-foreground">
            Adicione um novo contrato ao sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contractNumber" className="text-sm font-medium">Número do Contrato</label>
                <Input
                  id="contractNumber"
                  placeholder="Número ou identificação do contrato"
                  {...register("contractNumber", { required: "Número do contrato é obrigatório" })}
                />
                {errors.contractNumber && <p className="text-sm text-red-500">{errors.contractNumber.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="supplierId" className="text-sm font-medium">Fornecedor</label>
                <Controller
                  name="supplierId"
                  control={control}
                  rules={{ required: "Fornecedor é obrigatório" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.supplierId && <p className="text-sm text-red-500">{errors.supplierId.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Data de Início</label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">Data de Término</label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="totalValue" className="text-sm font-medium">Valor Total</label>
                <Input
                  id="totalValue"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register("totalValue", { 
                    required: "Valor total é obrigatório",
                    valueAsNumber: true 
                  })}
                />
                {errors.totalValue && <p className="text-sm text-red-500">{errors.totalValue.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status do contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="ended">Finalizado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição/Objeto</label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objeto do contrato"
                  {...register("description", { required: "Descrição é obrigatória" })}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/compras/contratos")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Contrato
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
