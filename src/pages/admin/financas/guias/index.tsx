
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Search, Download } from "lucide-react";

export default function SolicitacaoGuias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoGuia, setTipoGuia] = useState("todos");
  const [status, setStatus] = useState("todos");
  
  // Mock data for guides
  const guias = [
    { 
      id: "G-2023-000123", 
      contribuinte: "João Silva",
      cpfCnpj: "123.456.789-00",
      tipo: "IPTU", 
      valor: 1250.75, 
      vencimento: "31/05/2023", 
      status: "Emitida" 
    },
    { 
      id: "G-2023-000124", 
      contribuinte: "Maria Santos",
      cpfCnpj: "987.654.321-00",
      tipo: "ISS", 
      valor: 458.90, 
      vencimento: "15/06/2023", 
      status: "Pendente" 
    },
    { 
      id: "G-2023-000125", 
      contribuinte: "Empresa ABC Ltda",
      cpfCnpj: "12.345.678/0001-90",
      tipo: "Taxa de Licença", 
      valor: 750.00, 
      vencimento: "10/06/2023", 
      status: "Paga" 
    },
    { 
      id: "G-2023-000126", 
      contribuinte: "Pedro Almeida",
      cpfCnpj: "234.567.890-12",
      tipo: "ITBI", 
      valor: 3450.25, 
      vencimento: "05/06/2023", 
      status: "Vencida" 
    },
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Filter guias based on search term and filters
  const filteredGuias = guias.filter(guia => {
    const matchesSearch = searchTerm === "" || 
      guia.contribuinte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.cpfCnpj.includes(searchTerm) ||
      guia.id.includes(searchTerm);
    
    const matchesTipo = tipoGuia === "todos" || guia.tipo === tipoGuia;
    const matchesStatus = status === "todos" || guia.status === status;
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Emitida": return "bg-blue-100 text-blue-800";
      case "Paga": return "bg-green-100 text-green-800";
      case "Vencida": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Solicitação de Guias</h1>
        <p className="text-muted-foreground">
          Emita guias de pagamento e acompanhe o status
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nova Solicitação de Guia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
              <Select defaultValue="iptu">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iptu">IPTU</SelectItem>
                  <SelectItem value="iss">ISS</SelectItem>
                  <SelectItem value="taxaLicenca">Taxa de Licença</SelectItem>
                  <SelectItem value="itbi">ITBI</SelectItem>
                  <SelectItem value="outro">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF/CNPJ do Contribuinte</Label>
              <Input id="cpfCnpj" placeholder="Digite o CPF ou CNPJ" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribuinte">Nome do Contribuinte</Label>
              <Input id="contribuinte" placeholder="Digite o nome" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vencimento">Data de Vencimento</Label>
              <Input id="vencimento" type="date" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Emitir Guia</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center relative flex-1">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por contribuinte, CPF/CNPJ ou protocolo"
            className="pl-9 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={tipoGuia} onValueChange={setTipoGuia}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de guia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="IPTU">IPTU</SelectItem>
            <SelectItem value="ISS">ISS</SelectItem>
            <SelectItem value="Taxa de Licença">Taxa de Licença</SelectItem>
            <SelectItem value="ITBI">ITBI</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Emitida">Emitida</SelectItem>
            <SelectItem value="Paga">Paga</SelectItem>
            <SelectItem value="Vencida">Vencida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guias table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Contribuinte</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuias.length > 0 ? (
                filteredGuias.map((guia) => (
                  <TableRow key={guia.id}>
                    <TableCell className="font-medium">{guia.id}</TableCell>
                    <TableCell>{guia.contribuinte}</TableCell>
                    <TableCell>{guia.cpfCnpj}</TableCell>
                    <TableCell>{guia.tipo}</TableCell>
                    <TableCell>{formatCurrency(guia.valor)}</TableCell>
                    <TableCell>{guia.vencimento}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(guia.status)}`}>
                        {guia.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    Nenhuma guia encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
