
import { supabase } from "@/integrations/supabase/client";
import { Contract, ContractStatus } from "@/types/administration";
import { toast } from "@/hooks/use-toast";
import { mapContractFromDb } from "./utils";

// Fetch all contracts
export async function fetchContracts(
  status?: ContractStatus
): Promise<Contract[]> {
  try {
    let query = supabase
      .from("contracts")
      .select(`
        *,
        suppliers:suppliers(name)
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(contract => mapContractFromDb({
      ...contract,
      supplierName: contract.suppliers?.name
    }));
  } catch (error: any) {
    console.error("Error fetching contracts:", error.message);
    toast({
      title: "Erro ao carregar contratos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Get contract by ID
export async function getContractById(contractId: string): Promise<Contract | null> {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        *,
        suppliers:suppliers(name),
        items:contract_items(*)
      `)
      .eq("id", contractId)
      .single();

    if (error) throw error;

    return mapContractFromDb({
      ...data,
      supplierName: data.suppliers?.name,
      items: data.items
    });
  } catch (error: any) {
    console.error("Error fetching contract:", error.message);
    toast({
      title: "Erro ao carregar contrato",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Create a new contract
export async function createContract(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<Contract | null> {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .insert({
        contract_number: contract.contractNumber,
        supplier_id: contract.supplierId,
        description: contract.description,
        start_date: contract.startDate,
        end_date: contract.endDate,
        total_value: contract.totalValue,
        status: contract.status
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Contrato criado",
      description: `O contrato ${contract.contractNumber} foi criado com sucesso.`,
    });

    return mapContractFromDb(data);
  } catch (error: any) {
    console.error("Error creating contract:", error.message);
    toast({
      title: "Erro ao criar contrato",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Update an existing contract
export async function updateContract(contractId: string, contract: Partial<Omit<Contract, "id" | "createdAt" | "updatedAt">>): Promise<Contract | null> {
  try {
    const updateData: Record<string, any> = {};
    
    if (contract.contractNumber !== undefined) updateData.contract_number = contract.contractNumber;
    if (contract.supplierId !== undefined) updateData.supplier_id = contract.supplierId;
    if (contract.description !== undefined) updateData.description = contract.description;
    if (contract.startDate !== undefined) updateData.start_date = contract.startDate;
    if (contract.endDate !== undefined) updateData.end_date = contract.endDate;
    if (contract.totalValue !== undefined) updateData.total_value = contract.totalValue;
    if (contract.status !== undefined) updateData.status = contract.status;

    const { data, error } = await supabase
      .from("contracts")
      .update(updateData)
      .eq("id", contractId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Contrato atualizado",
      description: `O contrato foi atualizado com sucesso.`,
    });

    return mapContractFromDb(data);
  } catch (error: any) {
    console.error("Error updating contract:", error.message);
    toast({
      title: "Erro ao atualizar contrato",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Update contract status
export async function updateContractStatus(contractId: string, status: ContractStatus): Promise<Contract | null> {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .update({ status })
      .eq("id", contractId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Status atualizado",
      description: `O status do contrato foi atualizado para ${status}.`,
    });

    return mapContractFromDb(data);
  } catch (error: any) {
    console.error("Error updating contract status:", error.message);
    toast({
      title: "Erro ao atualizar status",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
