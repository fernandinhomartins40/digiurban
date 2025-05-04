
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Receipt, AlertCircle } from "lucide-react";

export default function ConsultarDebitos() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for debts
  const mockDebitos = [
    {
      id: "D-2023-001234",
      descricao: "IPTU 2023 - Lote 123",
      valor: 1250.75,
      vencimento: "31/03/2023",
      status: "Vencido",
      juros: 75.04,
      multa: 125.08,
      valorAtualizado: 1450.87
    },
    {
      id: "D-2023-001235",
      descricao: "Taxa de Coleta de Lixo 2023",
      valor: 350.00,
      vencimento: "30/04/2023",
      status: "Vencido",
      juros: 10.50,
      multa: 35.00,
      valorAtualizado: 395.50
    },
    {
      id: "D-2023-001236",
      descricao: "ISS - Referência 04/2023",
      valor: 780.45,
      vencimento: "15/05/2023",
      status: "A vencer",
      juros: 0,
      multa: 0,
      valorAtualizado: 780.45
    }
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSearch = () => {
    if (!cpfCnpj) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchPerformed(true);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate total
  const totalDebito = mockDebitos.reduce((acc, debito) => acc + debito.valorAtualizado, 0);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Consultar Débitos</h1>
        <p className="text-muted-foreground">
          Consulte a situação dos débitos por contribuinte
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Buscar Contribuinte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="cpfCnpj">CPF/CNPJ do Contribuinte</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="cpfCnpj"
                  placeholder="Digite o CPF ou CNPJ" 
                  className="pl-9"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={!cpfCnpj || loading}
                className="w-full md:w-auto"
              >
                {loading ? "Buscando..." : "Consultar Débitos"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchPerformed && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Resultado da Consulta</h2>
              <p className="text-muted-foreground">
                Contribuinte: <span className="font-medium">João Silva</span> | CPF: <span className="font-medium">{cpfCnpj}</span>
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm">Total de débitos:</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebito)}</p>
            </div>
          </div>

          {mockDebitos.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor Original</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Multa</TableHead>
                      <TableHead>Valor Atualizado</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDebitos.map((debito) => (
                      <TableRow key={debito.id}>
                        <TableCell>{debito.descricao}</TableCell>
                        <TableCell>{formatCurrency(debito.valor)}</TableCell>
                        <TableCell>{debito.vencimento}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            debito.status === "Vencido" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {debito.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(debito.juros)}</TableCell>
                        <TableCell>{formatCurrency(debito.multa)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(debito.valorAtualizado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="h-8 flex items-center gap-1">
                            <Receipt className="h-4 w-4" />
                            <span>Emitir Guia</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Nenhum débito encontrado</h3>
                <p className="text-muted-foreground">
                  Este contribuinte não possui débitos pendentes no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
