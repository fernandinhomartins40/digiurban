
import { supabase } from "@/integrations/supabase/client";
import { HRRequestStatus, HRStatusHistory } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Add entry to status history
export async function addStatusHistory(
  requestId: string,
  status: HRRequestStatus,
  comments: string | null,
  userId: string
): Promise<HRStatusHistory | null> {
  try {
    const { data, error } = await supabase
      .from("hr_request_status_history")
      .insert({
        request_id: requestId,
        status,
        comments,
        changed_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      requestId: data.request_id,
      status: data.status,
      comments: data.comments,
      changedBy: data.changed_by,
      createdAt: new Date(data.created_at),
    };
  } catch (error: any) {
    console.error("Error adding status history:", error.message);
    return null;
  }
}

// Fetch request status history
export async function fetchRequestHistory(requestId: string): Promise<HRStatusHistory[]> {
  try {
    const { data, error } = await supabase
      .from("hr_request_status_history")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((history) => ({
      id: history.id,
      requestId: history.request_id,
      status: history.status,
      comments: history.comments,
      changedBy: history.changed_by,
      createdAt: new Date(history.created_at),
    }));
  } catch (error: any) {
    console.error("Error fetching request history:", error.message);
    toast({
      title: "Erro ao carregar histórico",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
