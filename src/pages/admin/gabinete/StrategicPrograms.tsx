
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Plus, Search, Calendar, Target, FileText } from "lucide-react";
import { getStrategicPrograms } from "@/services/mayorOffice";
import { ProgramStatus, StrategicProgram } from "@/types/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";

export default function StrategicPrograms() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ProgramStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch strategic programs
  const { data: programs, isLoading } = useQuery({
    queryKey: ["strategicPrograms", selectedStatus],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      return getStrategicPrograms(status);
    },
  });

  // Filter programs by search query
  const filteredPrograms = programs?.filter((program) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      program.title.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query)
    );
  });

  // Format currency
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Map status to display name
  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      planning: "Planejamento",
      in_progress: "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      planning: "bg-purple-100 text-purple-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      pending: "bg-amber-100 text-amber-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Programas Estratégicos | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Programas Estratégicos
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramenta para monitoramento contínuo de projetos prioritários da gestão.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Programa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Programa Estratégico</DialogTitle>
              <DialogDescription>
                Crie um novo programa estratégico com cronograma e metas.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Program creation form would go here */}
              <p className="text-center py-6">Funcionalidade em implementação...</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Criar Programa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Programas Estratégicos</CardTitle>
              <CardDescription>
                Gerencie e acompanhe os programas prioritários da gestão
              </CardDescription>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-full md:w-[250px]"
                  placeholder="Buscar programa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="all"
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as ProgramStatus | "all")}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="planning">Planejamento</TabsTrigger>
              <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPrograms && filteredPrograms.length > 0 ? (
                <div className="space-y-6">
                  {filteredPrograms.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(program.status)}>
                            {mapStatusName(program.status)}
                          </Badge>
                          <Badge variant="outline">
                            Progresso: {program.progressPercentage}%
                          </Badge>
                        </div>
                        <CardTitle className="mt-1">{program.title}</CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="border rounded-md p-4">
                            <p className="text-sm text-muted-foreground">Período</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <p>
                                {format(program.startDate, "dd/MM/yyyy", { locale: ptBR })}
                                {program.endDate && (
                                  <span> até {format(program.endDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="border rounded-md p-4">
                            <p className="text-sm text-muted-foreground">Orçamento</p>
                            <p className="text-xl font-medium mt-1">
                              {formatCurrency(program.budget)}
                            </p>
                            {program.spentAmount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Executado: {formatCurrency(program.spentAmount)}
                              </p>
                            )}
                          </div>
                          <div className="border rounded-md p-4">
                            <p className="text-sm text-muted-foreground">Marcos</p>
                            <div className="flex items-center mt-1">
                              <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                              <p>
                                {program.milestones?.length || 0} marcos definidos
                              </p>
                            </div>
                          </div>
                          <div className="border rounded-md p-4">
                            <p className="text-sm text-muted-foreground">Documentos</p>
                            <div className="flex items-center mt-1">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <p>
                                {program.documents?.length || 0} documentos anexados
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso Geral</span>
                            <span>{program.progressPercentage}%</span>
                          </div>
                          <Progress value={program.progressPercentage} className="h-2" />
                        </div>

                        {program.milestones && program.milestones.length > 0 && (
                          <Accordion type="single" collapsible className="mt-6">
                            <AccordionItem value="milestones">
                              <AccordionTrigger>Marcos e Etapas</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 mt-2">
                                  {program.milestones.map((milestone) => (
                                    <div key={milestone.id} className="border rounded-md p-4">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium">{milestone.title}</h4>
                                        <Badge className={getStatusColor(milestone.status)}>
                                          {mapStatusName(milestone.status)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {milestone.description}
                                      </p>
                                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>
                                          Prazo: {format(milestone.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </CardContent>

                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Ver detalhes completos
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl font-medium">Nenhum programa encontrado</p>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery
                      ? "Tente ajustar os critérios de busca"
                      : "Crie um novo programa para começar"}
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {filteredPrograms?.length || 0} programas estratégicos
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
