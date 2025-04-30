
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";

export default function AtendimentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Atendimentos</h1>
          <p className="text-muted-foreground">
            Registre e consulte atendimentos realizados nos serviços municipais de saúde.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Aguardando</TabsTrigger>
          <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar por nome ou CPF"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os tipos</option>
                <option value="clinico">Clínico</option>
                <option value="odontologico">Odontológico</option>
                <option value="enfermagem">Enfermagem</option>
                <option value="vacinacao">Vacinação</option>
              </select>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {["Consulta Clínica", "Odontológico", "Enfermagem"][i % 3]}
                  </CardTitle>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    i % 3 === 0 ? "bg-blue-100 text-blue-800" :
                    i % 3 === 1 ? "bg-green-100 text-green-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {["Agendado", "Concluído", "Em Andamento"][i % 3]}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-sm font-medium">Paciente: Maria Silva</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString()} - {["08:00", "09:30", "11:00"][i % 3]}
                  </div>
                  <div className="mt-1 text-xs">Dr. João Santos</div>
                  <div className="mt-1 text-xs text-muted-foreground">Unidade Central</div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Selecione esta aba para ver atendimentos aguardando.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Selecione esta aba para ver atendimentos em andamento.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Selecione esta aba para ver atendimentos concluídos.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
