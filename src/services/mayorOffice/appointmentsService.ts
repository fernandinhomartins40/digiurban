
import { supabase } from "@/integrations/supabase/client";
import { AppointmentStatus, MayorAppointment, PriorityLevel } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

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
