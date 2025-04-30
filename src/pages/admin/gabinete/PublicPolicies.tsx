
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
import { Loader2, Plus, Search, Target, Calendar, ArrowRight } from "lucide-react";
import { getPublicPolicies } from "@/services/mayorOfficeService";
import { PublicPolicy, PolicyStatus } from "@/types/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicPolicies() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<PolicyStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch public policies
  const { data: policies, isLoading } = useQuery({
    queryKey: ["publicPolicies", selectedStatus],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      return getPublicPolicies(status);
    },
  });

  // Filter policies by search query
  const filteredPolicies = policies?.filter((policy) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      policy.title.toLowerCase().includes(query) ||
      policy.description.toLowerCase().includes(query) ||
      policy.department.toLowerCase().includes(query)
    );
  });

  // Calculate policy progress
  const calculatePolicyProgress = (policy: PublicPolicy): number => {
    if (!policy.goals || policy.goals.length === 0) return 0;
    
    const completedGoals = policy.goals.filter(goal => goal.status === "completed").length;
    return Math.round((completedGoals / policy.goals.length) * 100);
  };

  // Map status to display name
  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      draft: "Rascunho",
      active: "Ativa",
      completed: "Concluída",
      cancelled: "Cancelada",
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      draft: "bg-amber-100 text-amber-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Políticas Públicas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Políticas Públicas</h1>
          <p className="text-sm text-muted-foreground">
            Ferramenta para criação e acompanhamento de metas de políticas públicas.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Política
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Política Pública</DialogTitle>
              <DialogDescription>
                Crie uma nova política pública com objetivos e metas mensuráveis.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Policy creation form would go here */}
              <p className="text-center py-6">Funcionalidade em implementação...</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Criar Política</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Políticas Públicas</CardTitle>
              <CardDescription>
                Gerencie e acompanhe as políticas públicas municipais
              </CardDescription>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-full md:w-[250px]"
                  placeholder="Buscar política..."
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
            onValueChange={(value) => setSelectedStatus(value as PolicyStatus | "all")}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPolicies && filteredPolicies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPolicies.map((policy) => (
                    <Card key={policy.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className={getStatusColor(policy.status)}>
                            {mapStatusName(policy.status)}
                          </Badge>
                          <Badge variant="outline" className="font-normal">
                            {policy.department}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-1">{policy.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {policy.description}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(policy.startDate, "dd/MM/yyyy", { locale: ptBR })}
                              {policy.endDate && ` até ${format(policy.endDate, "dd/MM/yyyy", { locale: ptBR })}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {policy.goals?.length || 0} metas definidas
                            </span>
                          </div>
                          
                          {policy.goals && policy.goals.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progresso</span>
                                <span>{calculatePolicyProgress(policy)}%</span>
                              </div>
                              <Progress value={calculatePolicyProgress(policy)} className="h-2" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={`#policy-details-${policy.id}`}>
                            Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl font-medium">Nenhuma política encontrada</p>
                  <p className="text-muted-foreground mt-2">
                    {searchQuery
                      ? "Tente ajustar os critérios de busca"
                      : "Crie uma nova política para começar"}
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {filteredPolicies?.length || 0} políticas públicas
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
