
import { supabase } from "@/integrations/supabase/client";
import { PurchaseStatusHistory, PurchaseRequestStatus } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Add entry to purchase status history
export async function addPurchaseStatusHistory(
  requestId: string,
  status: PurchaseRequestStatus,
  comments: string | null,
  userId: string
): Promise<PurchaseStatusHistory | null> {
  try {
    const { data, error } = await supabase
      .from("purchase_status_history")
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
    console.error("Error adding purchase status history:", error.message);
    return null;
  }
}

// Fetch purchase request status history
export async function fetchPurchaseHistory(requestId: string): Promise<PurchaseStatusHistory[]> {
  try {
    const { data, error } = await supabase
      .from("purchase_status_history")
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
    console.error("Error fetching purchase history:", error.message);
    toast({
      title: "Erro ao carregar histórico",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
