
import { supabase } from "@/integrations/supabase/client";
import { HRDocument, HRDocumentStatus, DocumentType } from "@/types/administration";
import { toast } from "@/hooks/use-toast";

// Fetch document types
export async function fetchDocumentTypes(): Promise<DocumentType[]> {
  try {
    const { data, error } = await supabase
      .from("hr_document_types")
      .select("*")
      .order("name");

    if (error) throw error;

    return (data || []).map((type) => ({
      id: type.id,
      name: type.name,
      description: type.description,
      createdAt: new Date(type.created_at),
      updatedAt: new Date(type.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching document types:", error.message);
    toast({
      title: "Erro ao carregar tipos de documentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Upload document file to storage
export async function uploadDocumentFile(
  userId: string,
  file: File
): Promise<{ path: string; size: number } | null> {
  try {
    const filePath = `${userId}/${new Date().getTime()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from("hr_documents")
      .upload(filePath, file);

    if (error) throw error;

    return {
      path: data.path,
      size: file.size,
    };
  } catch (error: any) {
    console.error("Error uploading document:", error.message);
    toast({
      title: "Erro ao fazer upload do documento",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Create a new document record
export async function createDocument(
  userId: string,
  documentTypeId: string,
  filePath: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  observations: string | null
): Promise<HRDocument | null> {
  try {
    const { data, error } = await supabase
      .from("hr_documents")
      .insert({
        user_id: userId,
        document_type_id: documentTypeId,
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        observations: observations,
      })
      .select("*, document_type:document_type_id(*)")
      .single();

    if (error) throw error;

    return mapDocumentFromDb(data);
  } catch (error: any) {
    console.error("Error creating document record:", error.message);
    toast({
      title: "Erro ao registrar documento",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Fetch documents for a user
export async function fetchUserDocuments(userId: string): Promise<HRDocument[]> {
  try {
    const { data, error } = await supabase
      .from("hr_documents")
      .select("*, document_type:document_type_id(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(mapDocumentFromDb);
  } catch (error: any) {
    console.error("Error fetching user documents:", error.message);
    toast({
      title: "Erro ao carregar documentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Fetch documents for admin (all documents)
export async function fetchAllDocuments(
  status?: HRDocumentStatus,
  documentTypeId?: string
): Promise<HRDocument[]> {
  try {
    let query = supabase
      .from("hr_documents")
      .select("*, document_type:document_type_id(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (documentTypeId) {
      query = query.eq("document_type_id", documentTypeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(mapDocumentFromDb);
  } catch (error: any) {
    console.error("Error fetching all documents:", error.message);
    toast({
      title: "Erro ao carregar documentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Update document status
export async function updateDocumentStatus(
  documentId: string,
  status: HRDocumentStatus,
  reviewerId: string
): Promise<HRDocument | null> {
  try {
    const { data, error } = await supabase
      .from("hr_documents")
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select("*, document_type:document_type_id(*)")
      .single();

    if (error) throw error;

    toast({
      title: "Status atualizado",
      description: `Documento ${status === 'approved' ? 'aprovado' : status === 'rejected' ? 'rejeitado' : 'atualizado'} com sucesso.`,
    });

    return mapDocumentFromDb(data);
  } catch (error: any) {
    console.error("Error updating document status:", error.message);
    toast({
      title: "Erro ao atualizar status",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Helper function to map document data from database
function mapDocumentFromDb(document: any): HRDocument {
  return {
    id: document.id,
    userId: document.user_id,
    documentTypeId: document.document_type_id,
    documentType: document.document_type ? {
      id: document.document_type.id,
      name: document.document_type.name,
      description: document.document_type.description,
      createdAt: new Date(document.document_type.created_at),
      updatedAt: new Date(document.document_type.updated_at),
    } : undefined,
    filePath: document.file_path,
    fileName: document.file_name,
    fileType: document.file_type,
    fileSize: document.file_size,
    observations: document.observations,
    status: document.status,
    reviewedBy: document.reviewed_by,
    reviewedAt: document.reviewed_at ? new Date(document.reviewed_at) : null,
    createdAt: new Date(document.created_at),
    updatedAt: new Date(document.updated_at),
  };
}
