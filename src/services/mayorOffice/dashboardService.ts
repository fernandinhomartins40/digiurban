
import { supabase } from "@/integrations/supabase/client";
import { DashboardStatistic } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches dashboard statistics with error handling and filtering options
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 * @param sector Optional sector ID for filtering
 * @returns Promise with dashboard statistics
 */
export async function getDashboardStats(
  startDate?: Date,
  endDate?: Date,
  sector?: string
): Promise<DashboardStatistic[]> {
  try {
    // Check if Supabase client exists and has correct properties
    if (!supabase || typeof supabase.from !== 'function') {
      throw new Error("Supabase client is not properly initialized");
    }
    
    let query = supabase
      .from("mayor_dashboard_stats")
      .select("*")
      .order("stat_date", { ascending: false });

    // Apply filters if provided
    if (startDate) {
      query = query.gte("stat_date", startDate.toISOString().split("T")[0]);
    }
    
    if (endDate) {
      query = query.lte("stat_date", endDate.toISOString().split("T")[0]);
    }
    
    if (sector) {
      query = query.eq("sector_id", sector);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Map the raw data to our type definition
    return (data || []).map((stat) => ({
      id: stat.id,
      statDate: new Date(stat.stat_date),
      statType: stat.stat_type,
      statValue: stat.stat_value,
      statTarget: stat.stat_target,
      sectorId: stat.sector_id,
      createdAt: new Date(stat.created_at),
      updatedAt: new Date(stat.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error.message);
    
    // Use toast to display error to user
    toast({
      title: "Erro ao carregar estatísticas",
      description: error.message || "Ocorreu um erro ao buscar dados do painel",
      variant: "destructive",
    });
    
    // Return empty array instead of throwing to prevent crashes
    return [];
  }
}

/**
 * Fetches performance metrics for the dashboard
 */
export async function getPerformanceMetrics(
  startDate?: Date,
  endDate?: Date,
  sector?: string
): Promise<any[]> {
  try {
    // In a real application, this would fetch from an API
    // For now, we're returning mock data
    return [
      { month: "Jan", solicitacoes: 65, processos: 28, atendimentos: 33 },
      { month: "Fev", solicitacoes: 59, processos: 48, atendimentos: 31 },
      { month: "Mar", solicitacoes: 80, processos: 40, atendimentos: 38 },
      { month: "Abr", solicitacoes: 81, processos: 47, atendimentos: 45 },
      { month: "Mai", solicitacoes: 56, processos: 65, atendimentos: 51 },
      { month: "Jun", solicitacoes: 55, processos: 58, atendimentos: 42 },
      { month: "Jul", solicitacoes: 40, processos: 44, atendimentos: 26 },
    ];
  } catch (error: any) {
    console.error("Error fetching performance metrics:", error.message);
    toast({
      title: "Erro ao carregar métricas",
      description: error.message || "Ocorreu um erro ao buscar métricas de desempenho",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Fetches department request data for the dashboard
 */
export async function getDepartmentRequests(
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  try {
    // In a real application, this would fetch from an API
    // For now, we're returning mock data
    return [
      { name: "Saúde", valor: 400 },
      { name: "Educação", valor: 300 },
      { name: "Urbanismo", valor: 300 },
      { name: "Obras", valor: 200 },
      { name: "Assistência", valor: 150 },
    ];
  } catch (error: any) {
    console.error("Error fetching department requests:", error.message);
    toast({
      title: "Erro ao carregar dados departamentais",
      description: error.message || "Ocorreu um erro ao buscar dados por departamento",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Fetches request status data for the dashboard
 */
export async function getRequestStatusData(
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  try {
    // In a real application, this would fetch from an API
    // For now, we're returning mock data
    return [
      { name: "Em Andamento", value: 32 },
      { name: "Pendente", value: 26 },
      { name: "Concluído", value: 42 },
      { name: "Cancelado", value: 6 },
    ];
  } catch (error: any) {
    console.error("Error fetching request status data:", error.message);
    toast({
      title: "Erro ao carregar dados de status",
      description: error.message || "Ocorreu um erro ao buscar dados de status das solicitações",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Fetches recent activity data for the dashboard
 */
export async function getRecentActivities(
  limit: number = 5
): Promise<any[]> {
  try {
    // In a real application, this would fetch from an API
    // For now, we're returning mock data
    return [
      {
        id: 1,
        title: "Nova solicitação urgente recebida",
        type: "urgent",
        time: "5 minutos",
      },
      {
        id: 2,
        title: "Reunião agendada com Secretário de Obras",
        type: "warning",
        time: "2 horas",
      },
      {
        id: 3,
        title: "Política pública de educação atualizada",
        type: "success",
        time: "5 horas",
      },
      {
        id: 4,
        title: "Solicitação #2340 foi finalizada",
        type: "success",
        time: "1 dia",
      },
    ].slice(0, limit);
  } catch (error: any) {
    console.error("Error fetching recent activities:", error.message);
    toast({
      title: "Erro ao carregar atividades recentes",
      description: error.message || "Ocorreu um erro ao buscar atividades recentes",
      variant: "destructive",
    });
    return [];
  }
}
