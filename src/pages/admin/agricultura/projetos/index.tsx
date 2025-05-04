
import React from "react";
import { AgriculturaLayout } from "../components/AgriculturaLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { useProjetos } from "./hooks/useProjetos";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProjetosRuraisPage() {
  const { projetos } = useProjetos();

  function getStatusColor(status: string) {
    switch (status) {
      case "Em Andamento": return "default";
      case "Concluído": return "success";
      case "Planejamento": return "secondary";
      case "Suspenso": return "destructive";
      default: return "secondary";
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  return (
    <AgriculturaLayout 
      title="Projetos Rurais" 
      description="Gerenciamento de projetos de desenvolvimento rural"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projetos Ativos</h2>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projetos.map((projeto) => (
          <Card key={projeto.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant={getStatusColor(projeto.status) as any}>
                  {projeto.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(projeto.dataInicio)} - {projeto.dataFim ? formatDate(projeto.dataFim) : "Em aberto"}
                </span>
              </div>
              <CardTitle className="text-xl mt-2">{projeto.nome}</CardTitle>
              <CardDescription>{projeto.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso</span>
                    <span className="font-medium">{projeto.progresso}%</span>
                  </div>
                  <Progress value={projeto.progresso} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coordenador:</span>
                  <span className="font-medium">{projeto.coordenador}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Beneficiários:</span>
                  <span className="font-medium">{projeto.beneficiarios}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orçamento:</span>
                  <span className="font-medium">R$ {projeto.orcamento.toLocaleString('pt-BR')}</span>
                </div>
                
                <Button variant="outline" className="w-full mt-2">
                  Ver Detalhes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projetos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">Nenhum projeto rural cadastrado</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
          </CardContent>
        </Card>
      )}
    </AgriculturaLayout>
  );
}
