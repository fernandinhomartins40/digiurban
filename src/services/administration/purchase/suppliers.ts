
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Fetch all suppliers
export async function fetchSuppliers(
  isActive?: boolean
): Promise<Supplier[]> {
  try {
    let query = supabase
      .from("suppliers")
      .select("*")
      .order("name", { ascending: true });

    if (isActive !== undefined) {
      query = query.eq("is_active", isActive);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(mapSupplierFromDb);
  } catch (error: any) {
    console.error("Error fetching suppliers:", error.message);
    toast({
      title: "Erro ao carregar fornecedores",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Get supplier by ID
export async function getSupplierById(supplierId: string): Promise<Supplier | null> {
  try {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", supplierId)
      .single();

    if (error) throw error;

    return mapSupplierFromDb(data);
  } catch (error: any) {
    console.error("Error fetching supplier:", error.message);
    toast({
      title: "Erro ao carregar fornecedor",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Create a new supplier
export async function createSupplier(supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">): Promise<Supplier | null> {
  try {
    const { data, error } = await supabase
      .from("suppliers")
      .insert({
        name: supplier.name,
        cnpj: supplier.cnpj,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        state: supplier.state,
        is_active: supplier.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Fornecedor criado",
      description: `O fornecedor ${supplier.name} foi criado com sucesso.`,
    });

    return mapSupplierFromDb(data);
  } catch (error: any) {
    console.error("Error creating supplier:", error.message);
    toast({
      title: "Erro ao criar fornecedor",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Update an existing supplier
export async function updateSupplier(supplierId: string, supplier: Partial<Omit<Supplier, "id" | "createdAt" | "updatedAt">>): Promise<Supplier | null> {
  try {
    const updateData: Record<string, any> = {};
    
    if (supplier.name !== undefined) updateData.name = supplier.name;
    if (supplier.cnpj !== undefined) updateData.cnpj = supplier.cnpj;
    if (supplier.email !== undefined) updateData.email = supplier.email;
    if (supplier.phone !== undefined) updateData.phone = supplier.phone;
    if (supplier.address !== undefined) updateData.address = supplier.address;
    if (supplier.city !== undefined) updateData.city = supplier.city;
    if (supplier.state !== undefined) updateData.state = supplier.state;
    if (supplier.isActive !== undefined) updateData.is_active = supplier.isActive;

    const { data, error } = await supabase
      .from("suppliers")
      .update(updateData)
      .eq("id", supplierId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Fornecedor atualizado",
      description: `O fornecedor foi atualizado com sucesso.`,
    });

    return mapSupplierFromDb(data);
  } catch (error: any) {
    console.error("Error updating supplier:", error.message);
    toast({
      title: "Erro ao atualizar fornecedor",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Delete a supplier (or mark as inactive)
export async function deleteSupplier(supplierId: string): Promise<boolean> {
  try {
    // We're marking as inactive instead of deleting to preserve referential integrity
    const { error } = await supabase
      .from("suppliers")
      .update({ is_active: false })
      .eq("id", supplierId);

    if (error) throw error;

    toast({
      title: "Fornecedor desativado",
      description: `O fornecedor foi desativado com sucesso.`,
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting supplier:", error.message);
    toast({
      title: "Erro ao desativar fornecedor",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}

// Helper function to map supplier from database
function mapSupplierFromDb(supplier: any): Supplier {
  return {
    id: supplier.id,
    name: supplier.name,
    cnpj: supplier.cnpj,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    city: supplier.city,
    state: supplier.state,
    isActive: supplier.is_active,
    createdAt: new Date(supplier.created_at),
    updatedAt: new Date(supplier.updated_at),
  };
}
