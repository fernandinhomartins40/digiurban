
import { supabase } from "@/integrations/supabase/client";
import { StrategicProgram, Program, ProgramStatus } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Strategic Programs
export async function getStrategicPrograms(status?: ProgramStatus): Promise<Program[]> {
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

    return (data || []).map((program) => {
      const strategicProgram: StrategicProgram = {
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
        // Use coordinator_id if coordinator_name is missing
        coordinatorName: program.coordinator_id,
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
          status: milestone.status,
          responsibleId: milestone.responsible_id,
          responsibleName: milestone.responsible_name || milestone.responsible_id,
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
      };

      // Map StrategicProgram to Program interface needed by components
      return {
        id: strategicProgram.id,
        name: strategicProgram.title, // Map title to name
        description: strategicProgram.description,
        status: strategicProgram.status,
        startDate: strategicProgram.startDate.toISOString(),
        endDate: strategicProgram.endDate?.toISOString(),
        budget: strategicProgram.budget,
        responsible: strategicProgram.coordinatorName, // Map coordinatorName to responsible
        progress: strategicProgram.progressPercentage, // Map progressPercentage to progress
        updatedAt: strategicProgram.updatedAt.toISOString(),
        // For optional fields that may not exist in the database, provide defaults
        code: undefined, // These fields may not exist in the database yet
        category: undefined,
        beneficiaries_count: undefined,
        milestones: strategicProgram.milestones?.map(milestone => ({
          title: milestone.title,
          date: milestone.dueDate.toISOString(),
          completed: milestone.status === 'completed'
        }))
      };
    });
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
