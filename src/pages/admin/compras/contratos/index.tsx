
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  FileEdit,
  Archive,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchContracts, updateContractStatus } from "@/services/administration/purchase/contracts";
import { Contract, ContractStatus } from "@/types/administration";
import { format } from "date-fns";

export default function ContratosPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  
  const { data: contracts = [], isLoading, refetch } = useQuery({
    queryKey: ["contracts", statusFilter],
    queryFn: () => statusFilter === "all" ? fetchContracts() : fetchContracts(statusFilter as ContractStatus),
  });

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEndContract = async (contractId: string) => {
    const confirmed = window.confirm("Tem certeza que deseja encerrar este contrato?");
    if (confirmed) {
      await updateContractStatus(contractId, "ended");
      refetch();
    }
  };

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Ativo
          </Badge>
        );
      case "ended":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
            <Archive className="mr-1 h-3 w-3" />
            Finalizado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Em andamento
          </Badge>
        );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerencie contratos e licitações para vincular a pedidos de compra
          </p>
        </div>
        <Button onClick={() => navigate("cadastro")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Contratos Cadastrados</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="ended">Finalizados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar contratos..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando contratos...
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm || statusFilter !== "all" 
                        ? "Nenhum contrato encontrado com os filtros atuais" 
                        : "Nenhum contrato cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="font-medium">{contract.contractNumber}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                          {contract.description}
                        </div>
                      </TableCell>
                      <TableCell>{contract.supplierName}</TableCell>
                      <TableCell>
                        {format(contract.startDate, 'dd/MM/yyyy')} até {format(contract.endDate, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{formatCurrency(contract.totalValue)}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`${contract.id}`)}
                          >
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          {contract.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEndContract(contract.id)}
                            >
                              <Archive className="h-4 w-4" />
                              <span className="sr-only">Encerrar</span>
                            </Button>
                          )}
                        </div>
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
