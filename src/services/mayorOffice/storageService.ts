
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// File upload for mayor office module
export async function uploadMayorOfficeFile(
  file: File,
  folder: string
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("mayor_office")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from("mayor_office").getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    toast({
      title: "Erro ao fazer upload do arquivo",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
