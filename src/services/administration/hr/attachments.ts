
import { supabase } from "@/integrations/supabase/client";
import { HRRequestAttachment } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Upload attachment for request
export async function uploadRequestAttachment(
  userId: string,
  requestId: string,
  file: File
): Promise<HRRequestAttachment | null> {
  try {
    const filePath = `${userId}/${requestId}/${new Date().getTime()}-${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("hr_documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from("hr_request_attachments")
      .insert({
        request_id: requestId,
        file_path: uploadData.path,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      requestId: data.request_id,
      filePath: data.file_path,
      fileName: data.file_name,
      fileType: data.file_type,
      fileSize: data.file_size,
      createdAt: new Date(data.created_at),
    };
  } catch (error: any) {
    console.error("Error uploading attachment:", error.message);
    toast({
      title: "Erro ao fazer upload do anexo",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Fetch request attachments
export async function fetchRequestAttachments(requestId: string): Promise<HRRequestAttachment[]> {
  try {
    const { data, error } = await supabase
      .from("hr_request_attachments")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((attachment) => ({
      id: attachment.id,
      requestId: attachment.request_id,
      filePath: attachment.file_path,
      fileName: attachment.file_name,
      fileType: attachment.file_type,
      fileSize: attachment.file_size,
      createdAt: new Date(attachment.created_at),
    }));
  } catch (error: any) {
    console.error("Error fetching request attachments:", error.message);
    toast({
      title: "Erro ao carregar anexos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
