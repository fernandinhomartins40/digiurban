
import { supabase } from "@/integrations/supabase/client";
import { DashboardStatistic } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Dashboard statistics with error handling
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
    toast({
      title: "Erro ao carregar estatísticas",
      description: error.message || "Ocorreu um erro ao buscar dados do painel",
      variant: "destructive",
    });
    
    // Return empty array instead of throwing to prevent crashes
    return [];
  }
}
