
import { supabase } from "@/integrations/supabase/client";
import { PurchaseItem } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Fetch items for a purchase request
export async function fetchPurchaseItems(requestId: string): Promise<PurchaseItem[]> {
  try {
    const { data, error } = await supabase
      .from("purchase_items")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.id,
      requestId: item.request_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      description: item.description,
      estimatedPrice: item.estimated_price,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching purchase items:", error.message);
    toast({
      title: "Erro ao carregar itens",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Update a purchase item
export async function updatePurchaseItem(
  itemId: string,
  data: Partial<Omit<PurchaseItem, "id" | "requestId" | "createdAt" | "updatedAt">>
): Promise<PurchaseItem | null> {
  try {
    const updateData: Record<string, any> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.estimatedPrice !== undefined) updateData.estimated_price = data.estimatedPrice;

    const { data: updatedItem, error } = await supabase
      .from("purchase_items")
      .update(updateData)
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: updatedItem.id,
      requestId: updatedItem.request_id,
      name: updatedItem.name,
      quantity: updatedItem.quantity,
      unit: updatedItem.unit,
      description: updatedItem.description,
      estimatedPrice: updatedItem.estimated_price,
      createdAt: new Date(updatedItem.created_at),
      updatedAt: new Date(updatedItem.updated_at),
    };
  } catch (error: any) {
    console.error("Error updating purchase item:", error.message);
    toast({
      title: "Erro ao atualizar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
