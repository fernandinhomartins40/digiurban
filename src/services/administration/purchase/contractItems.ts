
import { supabase } from "@/integrations/supabase/client";
import { ContractItem } from "@/types/administration";
import { toast } from "@/hooks/use-toast";
import { mapContractItemFromDb } from "./utils";

// Fetch items for a contract
export async function fetchContractItems(contractId: string): Promise<ContractItem[]> {
  try {
    const { data, error } = await supabase
      .from("contract_items")
      .select("*")
      .eq("contract_id", contractId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map(mapContractItemFromDb);
  } catch (error: any) {
    console.error("Error fetching contract items:", error.message);
    toast({
      title: "Erro ao carregar itens do contrato",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Add item to contract
export async function addContractItem(item: Omit<ContractItem, "id" | "createdAt" | "updatedAt">): Promise<ContractItem | null> {
  try {
    const { data, error } = await supabase
      .from("contract_items")
      .insert({
        contract_id: item.contractId,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        quantity_used: item.quantityUsed,
        unit: item.unit,
        unit_price: item.unitPrice
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Item adicionado",
      description: `O item ${item.name} foi adicionado ao contrato.`,
    });

    return mapContractItemFromDb(data);
  } catch (error: any) {
    console.error("Error adding contract item:", error.message);
    toast({
      title: "Erro ao adicionar item ao contrato",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Update contract item
export async function updateContractItem(itemId: string, item: Partial<Omit<ContractItem, "id" | "contractId" | "createdAt" | "updatedAt">>): Promise<ContractItem | null> {
  try {
    const updateData: Record<string, any> = {};
    
    if (item.name !== undefined) updateData.name = item.name;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.quantity !== undefined) updateData.quantity = item.quantity;
    if (item.quantityUsed !== undefined) updateData.quantity_used = item.quantityUsed;
    if (item.unit !== undefined) updateData.unit = item.unit;
    if (item.unitPrice !== undefined) updateData.unit_price = item.unitPrice;

    const { data, error } = await supabase
      .from("contract_items")
      .update(updateData)
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Item atualizado",
      description: `O item foi atualizado com sucesso.`,
    });

    return mapContractItemFromDb(data);
  } catch (error: any) {
    console.error("Error updating contract item:", error.message);
    toast({
      title: "Erro ao atualizar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Delete contract item
export async function deleteContractItem(itemId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contract_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    toast({
      title: "Item removido",
      description: `O item foi removido do contrato.`,
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting contract item:", error.message);
    toast({
      title: "Erro ao remover item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}

// Update contract item usage
export async function updateItemUsage(itemId: string, quantityUsed: number): Promise<ContractItem | null> {
  try {
    const { data, error } = await supabase
      .from("contract_items")
      .update({ quantity_used: quantityUsed })
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Uso atualizado",
      description: `O uso do item foi atualizado com sucesso.`,
    });

    return mapContractItemFromDb(data);
  } catch (error: any) {
    console.error("Error updating item usage:", error.message);
    toast({
      title: "Erro ao atualizar uso",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
