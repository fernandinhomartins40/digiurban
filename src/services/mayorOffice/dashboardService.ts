
import { supabase } from "@/integrations/supabase/client";
import { DashboardStatistic } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Dashboard statistics
export async function getDashboardStats(
  startDate?: Date,
  endDate?: Date,
  sector?: string
): Promise<DashboardStatistic[]> {
  try {
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
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
