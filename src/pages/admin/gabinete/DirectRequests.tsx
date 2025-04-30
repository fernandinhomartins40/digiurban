
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getDirectRequests,
  createDirectRequest,
  updateDirectRequest,
} from "@/services/mayorOfficeService";
import {
  DirectRequest,
  PriorityLevel,
  RequestStatus,
} from "@/types/mayorOffice";
import { isAdminUser } from "@/types/auth";

// Form schemas
const requestFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  targetDepartment: z.string().min(1, "O setor responsável é obrigatório"),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  dueDate: z.string().optional(),
});

export default function DirectRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">("all");
  
  const departments = [
    "Gabinete do Prefeito",
    "Administração",
    "Finanças",
    "Obras",
    "Saúde",
    "Educação",
    "Assistência Social",
    "Meio Ambiente",
    "Serviços Urbanos",
  ];

  // Form for new requests
  const requestForm = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      targetDepartment: "",
      priority: "normal",
      dueDate: "",
    },
  });

  // Fetch direct requests with filters
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["mayorDirectRequests", selectedStatus, selectedDepartment],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      const department = selectedDepartment !== "all" ? selectedDepartment : undefined;
      return getDirectRequests(status, department);
    },
  });

  // Filter requests by search query
  const filteredRequests = requests?.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query) ||
      request.protocolNumber.toLowerCase().includes(query) ||
      request.targetDepartment.toLowerCase().includes(query)
    );
  });

  // Handle form submission for new request
  const onSubmitNewRequest = async (data: z.infer<typeof requestFormSchema>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      title: data.title,
      description: data.description,
      targetDepartment: data.targetDepartment,
      priority: data.priority as PriorityLevel,
      status: "open" as RequestStatus,
      requesterId: user.id,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    const result = await createDirectRequest(requestData);
    if (result) {
      setIsNewRequestDialogOpen(false);
      requestForm.reset();
      refetch();
    }
  };

  // Update request status
  const handleStatusChange = async (requestId: string, status: RequestStatus) => {
    const result = await updateDirectRequest(requestId, { status });
    if (result) {
      refetch();
    }
  };

  // Mappers for display
  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      open: "Aberta",
      in_progress: "Em Progresso",
      completed: "Concluída",
      cancelled: "Cancelada",
    };
    return statusMap[status] || status;
  };

  const mapPriorityName = (priority: string): string => {
    const priorityMap: Record<string, string> = {
      low: "Baixa",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
    };
    return priorityMap[priority] || priority;
  };

  const getPriorityColor = (priority: string): string => {
    const colorMap: Record<string, string> = {
      low: "bg-blue-100 text-blue-800",
      normal: "bg-green-100 text-green-800",
      high: "bg-amber-100 text-amber-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colorMap[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-amber-100 text-amber-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Solicitações Diretas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Solicitações Diretas
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramenta para envio de demandas formais aos setores da prefeitura.
          </p>
        </div>

        <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
              <DialogDescription>
                Crie uma nova solicitação para um departamento da prefeitura.
                Preencha todos os campos necessários.
              </DialogDescription>
            </DialogHeader>

            <Form {...requestForm}>
              <form
                onSubmit={requestForm.handleSubmit(onSubmitNewRequest)}
                className="space-y-4"
              >
                <FormField
                  control={requestForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título da solicitação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={requestForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente a solicitação"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={requestForm.control}
                    name="targetDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento Responsável</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={requestForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={requestForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Limite (opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Data limite para conclusão da solicitação
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewRequestDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={requestForm.formState.isSubmitting}>
                    {requestForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Criar Solicitação"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Solicitações</CardTitle>
              <CardDescription>
                Gerencie as solicitações diretas do gabinete
              </CardDescription>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  placeholder="Buscar solicitação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs 
            defaultValue="all" 
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as RequestStatus | "all")}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="open">Abertas</TabsTrigger>
              <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Protocolo</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-xs md:text-sm">
                          {request.protocolNumber}
                        </TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.targetDepartment}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(request.priority)}>
                            {mapPriorityName(request.priority)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {mapStatusName(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(request.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {request.status === "open" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(request.id, "in_progress")}
                                >
                                  Iniciar processamento
                                </DropdownMenuItem>
                              )}
                              {request.status === "in_progress" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(request.id, "completed")}
                                >
                                  Marcar como concluída
                                </DropdownMenuItem>
                              )}
                              {(request.status === "open" || request.status === "in_progress") && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(request.id, "cancelled")}
                                >
                                  Cancelar solicitação
                                </DropdownMenuItem>
                              )}
                              {request.status === "completed" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(request.id, "in_progress")}
                                >
                                  Reabrir solicitação
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl font-medium">Nenhuma solicitação encontrada</p>
                <p className="text-muted-foreground mt-2">
                  {searchQuery
                    ? "Tente ajustar os critérios de busca"
                    : "Crie uma nova solicitação para começar"}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {filteredRequests?.length || 0} solicitações
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
