import React, { useState, Suspense } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/mayorOffice/dashboardService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Dados de exemplo para os gráficos
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const performanceData = [
  { month: "Jan", solicitacoes: 65, processos: 28, atendimentos: 33 },
  { month: "Fev", solicitacoes: 59, processos: 48, atendimentos: 31 },
  { month: "Mar", solicitacoes: 80, processos: 40, atendimentos: 38 },
  { month: "Abr", solicitacoes: 81, processos: 47, atendimentos: 45 },
  { month: "Mai", solicitacoes: 56, processos: 65, atendimentos: 51 },
  { month: "Jun", solicitacoes: 55, processos: 58, atendimentos: 42 },
  { month: "Jul", solicitacoes: 40, processos: 44, atendimentos: 26 },
];

const departmentRequests = [
  { name: "Saúde", valor: 400 },
  { name: "Educação", valor: 300 },
  { name: "Urbanismo", valor: 300 },
  { name: "Obras", valor: 200 },
  { name: "Assistência", valor: 150 },
];

const statusData = [
  { name: "Em Andamento", value: 32 },
  { name: "Pendente", value: 26 },
  { name: "Concluído", value: 42 },
  { name: "Cancelado", value: 6 },
];

// Loading state component
const DashboardLoading = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Carregando dados do dashboard...</p>
  </div>
);

// Error state component
const DashboardError = ({ error }: { error: Error }) => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Erro ao carregar dados: {error.message}
    </AlertDescription>
  </Alert>
);

// Dashboard content component that handles the actual dashboard rendering
const DashboardContent = ({ 
  startDate, 
  endDate, 
  selectedSector 
}: { 
  startDate?: Date, 
  endDate?: Date, 
  selectedSector?: string 
}) => {
  // Use React Query but handle the loading/error states manually
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ["mayorDashboardStats", startDate, endDate, selectedSector],
    queryFn: () => getDashboardStats(startDate, endDate, selectedSector)
  });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error as Error} />;
  }

  return (
    <>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitações
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">231</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
              <div className="text-sm font-medium text-green-600">↑ 12%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio de Resposta
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 dias</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                -0.5 dias em relação ao mês anterior
              </p>
              <div className="text-sm font-medium text-green-600">↓ 19%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Resolução
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                +3% em relação ao mês anterior
              </p>
              <div className="text-sm font-medium text-green-600">↑ 3%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfação
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                +0.2 em relação ao mês anterior
              </p>
              <div className="text-sm font-medium text-green-600">↑ 4%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Desempenho Mensal</CardTitle>
            <CardDescription>
              Visão geral do volume de atividades ao longo dos meses
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="solicitacoes"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="processos" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="atendimentos" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Solicitações por Departamento</CardTitle>
            <CardDescription>
              Distribuição das solicitações por departamento
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentRequests}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status and Activities */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status das Solicitações</CardTitle>
            <CardDescription>
              Visão geral do status atual das solicitações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades registradas no gabinete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={cn(
                    "mr-2 h-2 w-2 rounded-full",
                    i === 0 ? "bg-red-500" : i === 1 ? "bg-yellow-500" : "bg-green-500"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {i === 0 && "Nova solicitação urgente recebida"}
                      {i === 1 && "Reunião agendada com Secretário de Obras"}
                      {i === 2 && "Política pública de educação atualizada"}
                      {i === 3 && "Solicitação #2340 foi finalizada"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      há {i === 0 ? "5 minutos" : i === 1 ? "2 horas" : i === 2 ? "5 horas" : "1 dia"}
                    </p>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver todas as atividades
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default function MayorDashboard() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedSector, setSelectedSector] = useState<string | undefined>(undefined);

  // Manipuladores para alterações de filtro
  const handleDateRangeChange = (range: "7d" | "30d" | "90d" | "custom") => {
    setDateRange(range);
    if (range === "7d") {
      setStartDate(subDays(new Date(), 7));
      setEndDate(new Date());
    } else if (range === "30d") {
      setStartDate(subDays(new Date(), 30));
      setEndDate(new Date());
    } else if (range === "90d") {
      setStartDate(subDays(new Date(), 90));
      setEndDate(new Date());
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard do Gabinete</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos indicadores e desempenho do gabinete do prefeito
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedSector}
            onValueChange={setSelectedSector}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Todos os setores</SelectItem>
              <SelectItem value="gabinete">Gabinete</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="obras">Obras</SelectItem>
              <SelectItem value="urbanismo">Urbanismo</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Tabs
              value={dateRange}
              onValueChange={(value) => handleDateRangeChange(value as "7d" | "30d" | "90d" | "custom")}
              className="w-fit"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="90d">90D</TabsTrigger>
                <TabsTrigger value="custom">
                  <CalendarIcon className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {dateRange === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-auto justify-start text-left font-normal">
                    {startDate && endDate ? (
                      <>
                        {format(startDate, "P", { locale: ptBR })} -{" "}
                        {format(endDate, "P", { locale: ptBR })}
                      </>
                    ) : (
                      <span>Escolha um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from);
                      setEndDate(range?.to);
                    }}
                    defaultMonth={startDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Render the dashboard content with proper fallback UI */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent 
          startDate={startDate} 
          endDate={endDate} 
          selectedSector={selectedSector} 
        />
      </Suspense>
    </div>
  );
}
