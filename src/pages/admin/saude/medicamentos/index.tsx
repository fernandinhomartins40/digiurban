
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, AlertTriangle } from "lucide-react";

export default function MedicamentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medicamentos</h1>
          <p className="text-muted-foreground">
            Controle de estoque e dispensação de medicamentos aos cidadãos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Entrada de Estoque
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Dispensar Medicamento
          </Button>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-amber-800">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between bg-white p-2 rounded-md border border-amber-100">
              <div>
                <div className="font-medium">Amoxicilina 500mg</div>
                <div className="text-sm text-muted-foreground">Estoque: 10 caixas (abaixo do mínimo)</div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
            <div className="flex justify-between bg-white p-2 rounded-md border border-amber-100">
              <div>
                <div className="font-medium">Losartana 50mg</div>
                <div className="text-sm text-muted-foreground">Estoque: 5 caixas (abaixo do mínimo)</div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
            <div className="flex justify-between bg-white p-2 rounded-md border border-amber-100">
              <div>
                <div className="font-medium">Insulina NPH</div>
                <div className="text-sm text-muted-foreground">Estoque: 2 frascos (abaixo do mínimo)</div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="dispensing">Dispensações</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar medicamento"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todas as locações</option>
                <option value="farmacia-central">Farmácia Central</option>
                <option value="ubs-norte">UBS Norte</option>
                <option value="ubs-sul">UBS Sul</option>
              </select>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left p-3 text-sm font-medium">Medicamento</th>
                  <th className="text-left p-3 text-sm font-medium">Princípio Ativo</th>
                  <th className="text-left p-3 text-sm font-medium">Dosagem</th>
                  <th className="text-center p-3 text-sm font-medium">Estoque</th>
                  <th className="text-center p-3 text-sm font-medium">Mínimo</th>
                  <th className="text-center p-3 text-sm font-medium">Local</th>
                  <th className="text-center p-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {["Amoxicilina", "Dipirona", "Losartana", "Omeprazol", "Paracetamol"].map((name, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-3">{name}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {["Amoxicilina", "Dipirona", "Losartana", "Omeprazol", "Paracetamol"][i]}
                    </td>
                    <td className="p-3 text-sm">
                      {["500mg", "1g", "50mg", "20mg", "500mg"][i]}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {[10, 50, 5, 30, 45][i]} {i % 2 === 0 ? "caixas" : "comprimidos"}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {[20, 30, 20, 20, 30][i]}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {["Farmácia Central", "UBS Norte", "Farmácia Central", "UBS Sul", "UBS Norte"][i]}
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
        
        <TabsContent value="dispensing" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar por paciente"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
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
                  <th className="text-left p-3 text-sm font-medium">Paciente</th>
                  <th className="text-left p-3 text-sm font-medium">Medicamento</th>
                  <th className="text-center p-3 text-sm font-medium">Quantidade</th>
                  <th className="text-left p-3 text-sm font-medium">Responsável</th>
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
                      {["Maria Silva", "João Santos", "Ana Oliveira", "Carlos Lima", "Beatriz Souza"][i - 1]}
                    </td>
                    <td className="p-3">
                      {["Amoxicilina 500mg", "Losartana 50mg", "Omeprazol 20mg", "Paracetamol 500mg", "Dipirona 1g"][i - 1]}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {[1, 2, 1, 2, 1][i - 1]} {i % 2 === 0 ? "caixa(s)" : "frasco(s)"}
                    </td>
                    <td className="p-3 text-sm">
                      Dr. {["Roberto Alves", "Juliana Martins", "Roberto Alves", "Carla Santos", "Juliana Martins"][i - 1]}
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
      </Tabs>
    </div>
  );
}
