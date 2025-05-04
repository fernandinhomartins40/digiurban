
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function FinancasDashboard() {
  // Mock data - in a real app, this would come from an API
  const financialData = {
    receitas: 3458750.45,
    despesas: 2897432.18,
    orcamento: 5200000.00,
    saldo: 561318.27,
  };

  // Helper to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Helper to calculate percentage
  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1) + '%';
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">
          Acompanhe os indicadores financeiros do município
        </p>
      </div>

      {/* Financial metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.receitas)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="text-green-500 h-4 w-4" />
              <span>
                {calculatePercentage(financialData.receitas, financialData.orcamento)} do orçamento
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.despesas)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="text-red-500 h-4 w-4" />
              <span>
                {calculatePercentage(financialData.despesas, financialData.orcamento)} do orçamento
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.saldo)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {financialData.saldo > 0 ? (
                <TrendingUp className="text-green-500 h-4 w-4" />
              ) : (
                <TrendingDown className="text-red-500 h-4 w-4" />
              )}
              <span>
                {calculatePercentage(Math.abs(financialData.saldo), financialData.orcamento)} do orçamento
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <ChartBar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.orcamento)}</div>
            <div className="h-4 w-full bg-gray-100 rounded-full mt-2">
              <div
                className="h-4 rounded-full bg-primary"
                style={{ width: `${(financialData.despesas / financialData.orcamento) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculatePercentage(financialData.despesas, financialData.orcamento)} utilizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <h2 className="text-xl font-semibold mb-4">Transações Recentes</h2>
      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Descrição</th>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-right p-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-muted/50">
              <td className="p-3">Pagamento de Fornecedor XYZ</td>
              <td className="p-3">05/05/2023</td>
              <td className="p-3">
                <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs">Despesa</span>
              </td>
              <td className="p-3 text-right">R$ 45.320,00</td>
            </tr>
            <tr className="border-b hover:bg-muted/50">
              <td className="p-3">Arrecadação IPTU</td>
              <td className="p-3">03/05/2023</td>
              <td className="p-3">
                <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs">Receita</span>
              </td>
              <td className="p-3 text-right">R$ 158.745,32</td>
            </tr>
            <tr className="border-b hover:bg-muted/50">
              <td className="p-3">Transferência Federal</td>
              <td className="p-3">01/05/2023</td>
              <td className="p-3">
                <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs">Receita</span>
              </td>
              <td className="p-3 text-right">R$ 230.000,00</td>
            </tr>
            <tr className="hover:bg-muted/50">
              <td className="p-3">Pagamento Folha</td>
              <td className="p-3">30/04/2023</td>
              <td className="p-3">
                <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs">Despesa</span>
              </td>
              <td className="p-3 text-right">R$ 785.432,87</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
