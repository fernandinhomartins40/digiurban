
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { getContractById } from "@/services/administration/purchase/contracts";
import { addContractItem, deleteContractItem } from "@/services/administration/purchase/contractItems";
import { ContractItem } from "@/types/administration";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

type ContractItemFormData = Omit<ContractItem, "id" | "contractId" | "createdAt" | "updatedAt">;

export default function ContratoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContractItemFormData>({
    defaultValues: {
      quantityUsed: 0
    }
  });

  const { data: contract, isLoading } = useQuery({
    queryKey: ["contract", id],
    queryFn: () => getContractById(id!),
    enabled: !!id,
  });
  
  const addItemMutation = useMutation({
    mutationFn: (data: ContractItemFormData) => 
      addContractItem({ ...data, contractId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contract", id],
      });
      setOpen(false);
      reset();
    }
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => 
      deleteContractItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contract", id],
      });
    }
  });
  
  const onSubmit = (data: ContractItemFormData) => {
    addItemMutation.mutate(data);
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Tem certeza que deseja remover este item?")) {
      deleteItemMutation.mutate(itemId);
    }
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Carregando informações do contrato...</div>;
  }

  if (!contract) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Contrato não encontrado</h2>
        <Button onClick={() => navigate("/admin/compras/contratos")}>
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
          onClick={() => navigate("/admin/compras/contratos")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contrato {contract.contractNumber}</h1>
          <p className="text-muted-foreground">
            Detalhes do contrato e itens
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Número do Contrato</h3>
              <p className="text-md font-medium">{contract.contractNumber}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fornecedor</h3>
              <p className="text-md font-medium">{contract.supplierName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Vigência</h3>
              <p className="text-md font-medium">
                {format(contract.startDate, 'dd/MM/yyyy')} até {format(contract.endDate, 'dd/MM/yyyy')}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor Total</h3>
              <p className="text-md font-medium">{formatCurrency(contract.totalValue)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="text-md font-medium">{
                contract.status === "active" ? "Ativo" :
                contract.status === "ended" ? "Finalizado" : "Cancelado"
              }</p>
            </div>
            
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Descrição/Objeto</h3>
              <p className="text-md">{contract.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Itens do Contrato</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Contrato</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input
                  id="name"
                  placeholder="Nome do item"
                  {...register("name", { required: "Nome é obrigatório" })}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantidade</label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    {...register("quantity", { 
                      required: "Quantidade é obrigatória",
                      valueAsNumber: true,
                      min: { value: 1, message: "Quantidade deve ser maior que 0" }
                    })}
                  />
                  {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="unit" className="text-sm font-medium">Unidade</label>
                  <Input
                    id="unit"
                    placeholder="UN"
                    {...register("unit", { required: "Unidade é obrigatória" })}
                  />
                  {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="unitPrice" className="text-sm font-medium">Preço Unit.</label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...register("unitPrice", { 
                      required: "Preço é obrigatório",
                      valueAsNumber: true,
                      min: { value: 0, message: "Preço deve ser maior ou igual a 0" }
                    })}
                  />
                  {errors.unitPrice && <p className="text-sm text-red-500">{errors.unitPrice.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="description"
                  placeholder="Descrição do item"
                  {...register("description")}
                />
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!contract.items || contract.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum item cadastrado para este contrato
                    </TableCell>
                  </TableRow>
                ) : (
                  contract.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        )}
                      </TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                      <TableCell>{item.quantity - item.quantityUsed} {item.unit}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
