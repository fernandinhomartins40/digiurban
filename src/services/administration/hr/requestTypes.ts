
import { supabase } from "@/integrations/supabase/client";
import { HRRequestType } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Fetch request types
export async function fetchRequestTypes(): Promise<HRRequestType[]> {
  try {
    const { data, error } = await supabase
      .from("hr_request_types")
      .select("*")
      .order("name");

    if (error) throw error;

    return (data || []).map((type) => ({
      id: type.id,
      name: type.name,
      description: type.description,
      formSchema: type.form_schema as { fields: { name: string; type: string; label: string; required: boolean; }[] },
      createdAt: new Date(type.created_at),
      updatedAt: new Date(type.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching request types:", error.message);
    toast({
      title: "Erro ao carregar tipos de solicitação",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
