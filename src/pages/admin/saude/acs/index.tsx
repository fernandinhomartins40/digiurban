
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, Home, Map, Calendar } from "lucide-react";

export default function ACSPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ACS</h1>
          <p className="text-muted-foreground">
            Agentes Comunitários de Saúde - Controle de visitas domiciliares e famílias.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Nova Família
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Visita
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="visits">Visitas</TabsTrigger>
          <TabsTrigger value="families">Famílias</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar agente"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todas as unidades</option>
                <option value="ubs-central">UBS Central</option>
                <option value="ubs-norte">UBS Norte</option>
                <option value="ubs-sul">UBS Sul</option>
              </select>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Novo Agente
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">
                      {["Ana Silva", "Carlos Santos", "Juliana Oliveira", "Roberto Lima", "Fernanda Costa", "Marcelo Souza"][i - 1]}
                    </CardTitle>
                    <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Ativo
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Registro: ACS-{String(100 + i).padStart(3, '0')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Unidade:</span>
                      <span>{["UBS Central", "UBS Norte", "UBS Sul", "UBS Central", "UBS Norte", "UBS Sul"][i - 1]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Território:</span>
                      <span>{["Centro", "Vila Nova", "Jardim das Flores", "Santa Maria", "Vila Verde", "Parque dos Lagos"][i - 1]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Famílias:</span>
                      <span>{(i * 10) + 50}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Visitas (mês):</span>
                      <span>{(i * 5) + 20}</span>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" variant="outline" className="w-full">Ver Detalhes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="visits" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar visita"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os agentes</option>
                <option value="1">Ana Silva</option>
                <option value="2">Carlos Santos</option>
                <option value="3">Juliana Oliveira</option>
              </select>
              <input
                type="date"
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left p-3 text-sm font-medium">Data</th>
                  <th className="text-left p-3 text-sm font-medium">Família</th>
                  <th className="text-left p-3 text-sm font-medium">Endereço</th>
                  <th className="text-left p-3 text-sm font-medium">Agente</th>
                  <th className="text-left p-3 text-sm font-medium">Motivo</th>
                  <th className="text-center p-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm">
                      {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      Família {["Silva", "Santos", "Oliveira", "Lima", "Costa"][i - 1]}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Rua das Flores, {i * 100}
                    </td>
                    <td className="p-3 text-sm">
                      {["Ana Silva", "Carlos Santos", "Juliana Oliveira", "Ana Silva", "Carlos Santos"][i - 1]}
                    </td>
                    <td className="p-3 text-sm">
                      {["Rotina", "Acompanhamento hipertenso", "Gestante", "Idoso acamado", "Criança com febre"][i - 1]}
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline">Detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="families" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar família"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os territórios</option>
                <option value="centro">Centro</option>
                <option value="vila-nova">Vila Nova</option>
                <option value="jardim-flores">Jardim das Flores</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os níveis de risco</option>
                <option value="high">Alto</option>
                <option value="medium">Médio</option>
                <option value="low">Baixo</option>
              </select>
            </div>
            <Button variant="outline">
              <Map className="mr-2 h-4 w-4" /> Ver Mapa
            </Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left p-3 text-sm font-medium">Família</th>
                  <th className="text-left p-3 text-sm font-medium">Endereço</th>
                  <th className="text-center p-3 text-sm font-medium">Pessoas</th>
                  <th className="text-left p-3 text-sm font-medium">Território</th>
                  <th className="text-center p-3 text-sm font-medium">Nível de Risco</th>
                  <th className="text-left p-3 text-sm font-medium">Última Visita</th>
                  <th className="text-center p-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      Família {["Silva", "Santos", "Oliveira", "Lima", "Costa"][i - 1]}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Rua das Flores, {i * 100}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {i + 2}
                    </td>
                    <td className="p-3 text-sm">
                      {["Centro", "Vila Nova", "Jardim das Flores", "Santa Maria", "Vila Verde"][i - 1]}
                    </td>
                    <td className="p-3 text-center">
                      <div className={`px-2 py-1 text-xs rounded-full inline-block ${
                        i === 1 ? "bg-red-100 text-red-800" :
                        i === 2 || i === 4 ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {i === 1 ? "Alto" : i === 2 || i === 4 ? "Médio" : "Baixo"}
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline">Detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione um relatório</option>
                <option value="monthly">Relatório mensal por agente</option>
                <option value="territory">Relatório por território</option>
                <option value="risk">Relatório de famílias de risco</option>
                <option value="coverage">Relatório de cobertura</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os meses</option>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <Button>
              <Calendar className="mr-2 h-4 w-4" /> Gerar Relatório
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10">
                <Home className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Gere um relatório</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Selecione o tipo de relatório, período e clique em "Gerar Relatório"
                  para visualizar dados e estatísticas de visitas dos Agentes Comunitários de Saúde.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
