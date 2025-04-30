
import { supabase } from "@/integrations/supabase/client";
import {
  DashboardStatistic,
  DirectRequest,
  RequestAttachment,
  RequestComment,
  MayorAppointment,
  PublicPolicy,
  PolicyGoal,
  StrategicProgram,
  ProgramMilestone,
  ProgramDocument,
  RequestStatus,
  AppointmentStatus,
  PriorityLevel,
  PolicyStatus,
  ProgramStatus,
  GoalStatus,
} from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Dashboard statistics
export async function getDashboardStats(
  startDate?: Date,
  endDate?: Date,
  sector?: string
): Promise<DashboardStatistic[]> {
  try {
    let query = supabase
      .from("mayor_dashboard_stats")
      .select("*")
      .order("stat_date", { ascending: false });

    if (startDate) {
      query = query.gte("stat_date", startDate.toISOString().split("T")[0]);
    }
    if (endDate) {
      query = query.lte("stat_date", endDate.toISOString().split("T")[0]);
    }
    if (sector) {
      query = query.eq("sector_id", sector);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((stat) => ({
      id: stat.id,
      statDate: new Date(stat.stat_date),
      statType: stat.stat_type,
      statValue: stat.stat_value,
      statTarget: stat.stat_target,
      sectorId: stat.sector_id,
      createdAt: new Date(stat.created_at),
      updatedAt: new Date(stat.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error.message);
    toast({
      title: "Erro ao carregar estatísticas",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Direct Requests
export async function getDirectRequests(
  status?: RequestStatus,
  department?: string,
  priority?: PriorityLevel
): Promise<DirectRequest[]> {
  try {
    let query = supabase
      .from("mayor_direct_requests")
      .select(
        `*, 
        mayor_request_attachments(*), 
        mayor_request_comments(*)`
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (department) {
      query = query.eq("target_department", department);
    }
    if (priority) {
      query = query.eq("priority", priority);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((request) => ({
      id: request.id,
      protocolNumber: request.protocol_number,
      title: request.title,
      description: request.description,
      requesterId: request.requester_id,
      targetDepartment: request.target_department,
      priority: request.priority as PriorityLevel,
      status: request.status as RequestStatus,
      dueDate: request.due_date ? new Date(request.due_date) : undefined,
      completedAt: request.completed_at
        ? new Date(request.completed_at)
        : undefined,
      createdAt: new Date(request.created_at),
      updatedAt: new Date(request.updated_at),
      attachments: request.mayor_request_attachments?.map((attachment: any) => ({
        id: attachment.id,
        requestId: attachment.request_id,
        fileName: attachment.file_name,
        filePath: attachment.file_path,
        fileType: attachment.file_type,
        fileSize: attachment.file_size,
        uploadedBy: attachment.uploaded_by,
        createdAt: new Date(attachment.created_at),
      })),
      comments: request.mayor_request_comments?.map((comment: any) => ({
        id: comment.id,
        requestId: comment.request_id,
        commentText: comment.comment_text,
        authorId: comment.author_id,
        createdAt: new Date(comment.created_at),
      })),
    }));
  } catch (error: any) {
    console.error("Error fetching direct requests:", error.message);
    toast({
      title: "Erro ao carregar solicitações",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createDirectRequest(request: Omit<DirectRequest, "id" | "protocolNumber" | "createdAt" | "updatedAt" | "attachments" | "comments">): Promise<DirectRequest | null> {
  try {
    const { data, error } = await supabase
      .from("mayor_direct_requests")
      .insert({
        title: request.title,
        description: request.description,
        requester_id: request.requesterId,
        target_department: request.targetDepartment,
        priority: request.priority,
        status: request.status,
        due_date: request.dueDate?.toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;

    if (!data) throw new Error("Falha ao criar solicitação");

    toast({
      title: "Solicitação criada",
      description: `Protocolo: ${data.protocol_number}`,
    });

    return {
      id: data.id,
      protocolNumber: data.protocol_number,
      title: data.title,
      description: data.description,
      requesterId: data.requester_id,
      targetDepartment: data.target_department,
      priority: data.priority as PriorityLevel,
      status: data.status as RequestStatus,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      attachments: [],
      comments: [],
    };
  } catch (error: any) {
    console.error("Error creating direct request:", error.message);
    toast({
      title: "Erro ao criar solicitação",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateDirectRequest(
  id: string,
  requestData: Partial<DirectRequest>
): Promise<boolean> {
  try {
    const updateData: any = {};
    if (requestData.title) updateData.title = requestData.title;
    if (requestData.description) updateData.description = requestData.description;
    if (requestData.targetDepartment) updateData.target_department = requestData.targetDepartment;
    if (requestData.priority) updateData.priority = requestData.priority;
    if (requestData.status) updateData.status = requestData.status;
    if (requestData.dueDate) updateData.due_date = requestData.dueDate.toISOString().split("T")[0];
    
    if (requestData.status === "completed" && !requestData.completedAt) {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("mayor_direct_requests")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Solicitação atualizada",
      description: "Os dados da solicitação foram atualizados com sucesso",
    });

    return true;
  } catch (error: any) {
    console.error("Error updating direct request:", error.message);
    toast({
      title: "Erro ao atualizar solicitação",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}

// Appointments
export async function getMayorAppointments(
  status?: AppointmentStatus,
  startDate?: Date,
  endDate?: Date
): Promise<MayorAppointment[]> {
  try {
    let query = supabase
      .from("mayor_appointments")
      .select("*")
      .order("requested_date", { ascending: true });

    if (status) {
      query = query.eq("status", status);
    }
    if (startDate) {
      query = query.gte("requested_date", startDate.toISOString().split("T")[0]);
    }
    if (endDate) {
      query = query.lte("requested_date", endDate.toISOString().split("T")[0]);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((appointment) => ({
      id: appointment.id,
      requesterName: appointment.requester_name,
      requesterId: appointment.requester_id,
      requesterEmail: appointment.requester_email,
      requesterPhone: appointment.requester_phone,
      subject: appointment.subject,
      description: appointment.description,
      requestedDate: new Date(appointment.requested_date),
      requestedTime: appointment.requested_time,
      durationMinutes: appointment.duration_minutes,
      status: appointment.status as AppointmentStatus,
      priority: appointment.priority as PriorityLevel,
      adminNotes: appointment.admin_notes,
      responseMessage: appointment.response_message,
      respondedBy: appointment.responded_by,
      respondedAt: appointment.responded_at ? new Date(appointment.responded_at) : undefined,
      createdAt: new Date(appointment.created_at),
      updatedAt: new Date(appointment.updated_at),
    }));
  } catch (error: any) {
    console.error("Error fetching appointments:", error.message);
    toast({
      title: "Erro ao carregar agendamentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Public Policies
export async function getPublicPolicies(status?: PolicyStatus): Promise<PublicPolicy[]> {
  try {
    let query = supabase
      .from("public_policies")
      .select(`*, public_policy_goals(*)`)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((policy) => ({
      id: policy.id,
      title: policy.title,
      description: policy.description,
      startDate: new Date(policy.start_date),
      endDate: policy.end_date ? new Date(policy.end_date) : undefined,
      status: policy.status as PolicyStatus,
      responsibleId: policy.responsible_id,
      department: policy.department,
      createdBy: policy.created_by,
      createdAt: new Date(policy.created_at),
      updatedAt: new Date(policy.updated_at),
      goals: policy.public_policy_goals?.map((goal: any) => ({
        id: goal.id,
        policyId: goal.policy_id,
        title: goal.title,
        description: goal.description,
        targetValue: goal.target_value,
        targetUnit: goal.target_unit,
        currentValue: goal.current_value,
        dueDate: goal.due_date ? new Date(goal.due_date) : undefined,
        status: goal.status as GoalStatus,
        createdAt: new Date(goal.created_at),
        updatedAt: new Date(goal.updated_at),
      })),
    }));
  } catch (error: any) {
    console.error("Error fetching public policies:", error.message);
    toast({
      title: "Erro ao carregar políticas públicas",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

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
      })),
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
      })),
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

// Attachments and files
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

// Add attachment to a direct request
export async function addRequestAttachment(
  requestId: string,
  file: File,
  userId: string
): Promise<RequestAttachment | null> {
  try {
    const filePath = await uploadMayorOfficeFile(file, "requests");
    if (!filePath) throw new Error("Failed to upload file");

    const { data, error } = await supabase
      .from("mayor_request_attachments")
      .insert({
        request_id: requestId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Anexo adicionado",
      description: "Arquivo anexado com sucesso",
    });

    return {
      id: data.id,
      requestId: data.request_id,
      fileName: data.file_name,
      filePath: data.file_path,
      fileType: data.file_type,
      fileSize: data.file_size,
      uploadedBy: data.uploaded_by,
      createdAt: new Date(data.created_at),
    };
  } catch (error: any) {
    console.error("Error adding attachment:", error.message);
    toast({
      title: "Erro ao adicionar anexo",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Add comment to a direct request
export async function addRequestComment(
  requestId: string,
  commentText: string,
  authorId: string
): Promise<RequestComment | null> {
  try {
    const { data, error } = await supabase
      .from("mayor_request_comments")
      .insert({
        request_id: requestId,
        comment_text: commentText,
        author_id: authorId,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso",
    });

    return {
      id: data.id,
      requestId: data.request_id,
      commentText: data.comment_text,
      authorId: data.author_id,
      createdAt: new Date(data.created_at),
    };
  } catch (error: any) {
    console.error("Error adding comment:", error.message);
    toast({
      title: "Erro ao adicionar comentário",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Audit log
export async function logMayorAction(
  entityType: string,
  entityId: string,
  actionType: string,
  actionDetails: any,
  userId: string
): Promise<void> {
  try {
    await supabase.from("mayor_office_audit_log").insert({
      entity_type: entityType,
      entity_id: entityId,
      action_type: actionType,
      action_details: actionDetails,
      performed_by: userId,
    });
  } catch (error: any) {
    console.error("Error logging action:", error.message);
  }
}
