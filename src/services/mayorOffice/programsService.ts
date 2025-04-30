
import { supabase } from "@/integrations/supabase/client";
import { ProgramStatus, StrategicProgram, GoalStatus } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Strategic Programs
export async function getStrategicPrograms(status?: ProgramStatus): Promise<StrategicProgram[]> {
  try {
    let query = supabase
      .from("strategic_programs")
      .select(
        `*, 
        strategic_program_milestones(*), 
        strategic_program_documents(*)`
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((program) => ({
      id: program.id,
      title: program.title,
      description: program.description,
      startDate: new Date(program.start_date),
      endDate: program.end_date ? new Date(program.end_date) : undefined,
      budget: program.budget,
      spentAmount: program.spent_amount,
      status: program.status as ProgramStatus,
      progressPercentage: program.progress_percentage,
      coordinatorId: program.coordinator_id,
      coordinatorName: program.coordinator_name,
      createdBy: program.created_by,
      createdAt: new Date(program.created_at),
      updatedAt: new Date(program.updated_at),
      milestones: program.strategic_program_milestones?.map((milestone: any) => ({
        id: milestone.id,
        programId: milestone.program_id,
        title: milestone.title,
        description: milestone.description,
        dueDate: new Date(milestone.due_date),
        completionDate: milestone.completion_date ? new Date(milestone.completion_date) : undefined,
        status: milestone.status as GoalStatus,
        responsibleId: milestone.responsible_id,
        responsibleName: milestone.responsible_name,
        createdAt: new Date(milestone.created_at),
        updatedAt: new Date(milestone.updated_at),
      })) || [],
      documents: program.strategic_program_documents?.map((document: any) => ({
        id: document.id,
        programId: document.program_id,
        documentTitle: document.document_title,
        documentDescription: document.document_description,
        filePath: document.file_path,
        fileName: document.file_name,
        fileType: document.file_type,
        fileSize: document.file_size,
        uploadedBy: document.uploaded_by,
        createdAt: new Date(document.created_at),
      })) || [],
    }));
  } catch (error: any) {
    console.error("Error fetching strategic programs:", error.message);
    toast({
      title: "Erro ao carregar programas estratégicos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
