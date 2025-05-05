
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, CheckCircle, Download, Clock } from "lucide-react";

export default function Certidoes() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [code, setCode] = useState("");
  const [selectedTab, setSelectedTab] = useState("solicitar");

  // Mock data for certidões
  const mockCertidoes = [
    {
      id: "CERT-2023-001234",
      tipo: "Certidão Negativa de Débitos",
      contribuinte: "João Silva",
      cpfCnpj: "123.456.789-00",
      emissao: "15/05/2023",
      validade: "15/08/2023",
      status: "Emitida"
    },
    {
      id: "CERT-2023-001235",
      tipo: "Certidão de Uso do Solo",
      contribuinte: "Empresa ABC Ltda",
      cpfCnpj: "12.345.678/0001-90",
      emissao: "10/05/2023",
      validade: "10/11/2023",
      status: "Emitida"
    },
    {
      id: "CERT-2023-001236",
      tipo: "Certidão de Valor Venal",
      contribuinte: "Maria Santos",
      cpfCnpj: "987.654.321-00",
      emissao: "08/05/2023",
      validade: "08/08/2023",
      status: "Em processamento"
    }
  ];

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const handleSolicitarCertidao = () => {
    // Here you would submit the request for a new certificate
    alert("Certidão solicitada com sucesso!");
  };

  const handleVerificarAutenticidade = () => {
    // Here you would validate the certificate code
    alert(code ? "Verificando autenticidade do código: " + code : "Por favor, informe o código de autenticação");
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Certidões</h1>
        <p className="text-muted-foreground">
          Solicite, consulte e verifique certidões municipais
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solicitar">Solicitar Certidões</TabsTrigger>
          <TabsTrigger value="consultar">Minhas Certidões</TabsTrigger>
          <TabsTrigger value="verificar">Verificar Autenticidade</TabsTrigger>
        </TabsList>

        <TabsContent value="solicitar">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Nova Certidão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoCertidao">Tipo de Certidão</Label>
                  <Select defaultValue="negativa">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de certidão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negativa">Certidão Negativa de Débitos</SelectItem>
                      <SelectItem value="valorVenal">Certidão de Valor Venal</SelectItem>
                      <SelectItem value="usoSolo">Certidão de Uso do Solo</SelectItem>
                      <SelectItem value="numeracao">Certidão de Numeração Predial</SelectItem>
                      <SelectItem value="regularidade">Certidão de Regularidade Fiscal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpjCert">CPF/CNPJ do Contribuinte</Label>
                  <Input 
                    id="cpfCnpjCert" 
                    placeholder="Digite o CPF ou CNPJ" 
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomeContribuinte">Nome do Contribuinte</Label>
                  <Input id="nomeContribuinte" placeholder="Nome completo ou razão social" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email para recebimento</Label>
                  <Input id="email" type="email" placeholder="Digite seu email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Input id="observacoes" placeholder="Informações adicionais sobre a solicitação" />
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleSolicitarCertidao} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Solicitar Certidão</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultar">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Minhas Certidões</CardTitle>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por número ou tipo" className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contribuinte</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCertidoes.map((certidao) => (
                    <TableRow key={certidao.id}>
                      <TableCell className="font-medium">{certidao.id}</TableCell>
                      <TableCell>{certidao.tipo}</TableCell>
                      <TableCell>{certidao.contribuinte}</TableCell>
                      <TableCell>{certidao.cpfCnpj}</TableCell>
                      <TableCell>{certidao.emissao}</TableCell>
                      <TableCell>{certidao.validade}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          certidao.status === "Emitida" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {certidao.status === "Emitida" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Emitida
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Processando
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {certidao.status === "Emitida" && (
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verificar">
          <Card>
            <CardHeader>
              <CardTitle>Verificar Autenticidade de Certidão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="codigoAutenticidade">Código de Autenticidade</Label>
                  <Input 
                    id="codigoAutenticidade" 
                    placeholder="Digite o código de autenticidade da certidão" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleVerificarAutenticidade}
                    className="w-full md:w-auto"
                  >
                    Verificar Autenticidade
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                O código de autenticidade está impresso na certidão e permite verificar se o documento é genuíno.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
