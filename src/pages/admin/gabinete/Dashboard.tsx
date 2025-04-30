
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, BarChart3, CalendarCheck, FileText, Target } from "lucide-react";
import { getDashboardStats, getDirectRequests, getMayorAppointments } from "@/services/mayorOfficeService";
import { DashboardStatistic, DirectRequest, MayorAppointment } from "@/types/mayorOffice";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function MayorDashboard() {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState<"7d" | "30d" | "90d" | "year">("30d");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  // Update date range when time frame changes
  useEffect(() => {
    const end = new Date();
    let start;

    switch (timeFrame) {
      case "7d":
        start = subDays(end, 7);
        break;
      case "30d":
        start = subDays(end, 30);
        break;
      case "90d":
        start = subDays(end, 90);
        break;
      case "year":
        start = subDays(end, 365);
        break;
      default:
        start = subDays(end, 30);
    }

    setDateRange({ start, end });
  }, [timeFrame]);

  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["mayorDashboardStats", dateRange],
    queryFn: () => getDashboardStats(dateRange.start, dateRange.end),
  });

  // Fetch recent requests
  const { data: recentRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["mayorRecentRequests"],
    queryFn: () => getDirectRequests(),
  });

  // Fetch upcoming appointments
  const { data: upcomingAppointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["mayorUpcomingAppointments"],
    queryFn: () => getMayorAppointments("approved"),
  });

  // Transform data for charts
  const getRequestsByStatusData = () => {
    if (!recentRequests) return [];

    const statusCounts = {
      open: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    recentRequests.forEach((request: DirectRequest) => {
      if (statusCounts.hasOwnProperty(request.status)) {
        statusCounts[request.status as keyof typeof statusCounts]++;
      }
    });

    return Object.keys(statusCounts).map((status) => ({
      name: mapStatusName(status),
      value: statusCounts[status as keyof typeof statusCounts],
    }));
  };

  const getTimelineData = () => {
    if (!stats) return [];

    // Group stats by date and count
    const groupedByDate = stats.reduce<Record<string, { requests: number; appointments: number }>>((acc, stat) => {
      const dateStr = format(stat.statDate, "yyyy-MM-dd");
      
      if (!acc[dateStr]) {
        acc[dateStr] = { requests: 0, appointments: 0 };
      }
      
      if (stat.statType === "requests") {
        acc[dateStr].requests = stat.statValue;
      } else if (stat.statType === "appointments") {
        acc[dateStr].appointments = stat.statValue;
      }
      
      return acc;
    }, {});

    // Convert to array for chart
    return Object.keys(groupedByDate).map(date => ({
      date: format(new Date(date), "dd/MM"),
      requests: groupedByDate[date].requests,
      appointments: groupedByDate[date].appointments,
    }));
  };

  const mapStatusName = (status: string): string => {
    const statusMap: Record<string, string> = {
      open: "Aberta",
      in_progress: "Em Progresso",
      completed: "Concluída",
      cancelled: "Cancelada",
      pending: "Pendente",
      approved: "Aprovada",
      rejected: "Rejeitada",
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
      pending: "bg-purple-100 text-purple-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  // Calculate summary totals
  const getTotalRequests = () => {
    return recentRequests?.length || 0;
  };

  const getCompletedRequests = () => {
    return recentRequests?.filter(r => r.status === "completed").length || 0;
  };

  const getPendingAppointments = () => {
    return upcomingAppointments?.filter(a => a.status === "approved").length || 0;
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Gabinete do Prefeito</title>
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard do Prefeito</h1>
          <p className="text-sm text-muted-foreground">
            Painel geral de visualização de indicadores-chave da gestão.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="year">1 ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingRequests ? <Loader2 className="h-4 w-4 animate-spin" /> : getTotalRequests()}
            </div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Concluídas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingRequests ? <Loader2 className="h-4 w-4 animate-spin" /> : getCompletedRequests()}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingRequests ? "..." : `${Math.round((getCompletedRequests() / (getTotalRequests() || 1)) * 100)}% do total`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAppointments ? <Loader2 className="h-4 w-4 animate-spin" /> : getPendingAppointments()}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos aprovados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicadores</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : (stats?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Métricas monitoradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução no Período</CardTitle>
                <CardDescription>Solicitações e agendamentos ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingStats ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getTimelineData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Solicitações" />
                      <Line type="monotone" dataKey="appointments" stroke="#82ca9d" name="Agendamentos" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitações por Status</CardTitle>
                <CardDescription>Distribuição das solicitações por status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingRequests ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRequestsByStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getRequestsByStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Recentes</CardTitle>
              <CardDescription>Últimas solicitações registradas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : recentRequests && recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex flex-col border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{request.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {mapPriorityName(request.priority)}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {mapStatusName(request.status)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {request.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>Protocolo: {request.protocolNumber}</span>
                        <span>
                          {format(request.createdAt, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/gabinete/solicitacoes">
                  Ver todas as solicitações <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Próximos</CardTitle>
              <CardDescription>Audiências agendadas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex flex-col border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{appointment.subject}</h3>
                        <Badge className={getPriorityColor(appointment.priority)}>
                          {mapPriorityName(appointment.priority)}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
                        <span className="text-sm">{appointment.requesterName}</span>
                        <span className="text-sm font-medium">
                          {format(appointment.requestedDate, "dd/MM/yyyy")} às {appointment.requestedTime.slice(0, 5)}
                        </span>
                      </div>
                      {appointment.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {appointment.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/admin/gabinete/agendamentos">
                  Ver todos os agendamentos <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
