
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";

// Mock service for mayor appointments
export async function getMayorAppointments(
  status?: AppointmentStatus
): Promise<Appointment[]> {
  // This would typically call an API to get appointments
  // For now, returning an empty array
  return [];
}

export async function updateMayorAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<Appointment> {
  // This would typically call an API to update an appointment's status
  // For now, just mocking a response
  return {
    id: appointmentId,
    status,
    subject: "Mock Appointment",
    requesterName: "Mock User",
    requesterEmail: "mock@example.com",
    requestedDate: new Date(),
    requestedTime: "10:00",
    durationMinutes: 30,
    priority: "normal",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateMayorAppointmentNotes(
  appointmentId: string,
  notes: string
): Promise<Appointment> {
  // This would typically call an API to update appointment notes
  // For now, just mocking a response
  return {
    id: appointmentId,
    status: "pending",
    subject: "Mock Appointment",
    requesterName: "Mock User",
    requesterEmail: "mock@example.com",
    requestedDate: new Date(),
    requestedTime: "10:00",
    durationMinutes: 30,
    priority: "normal",
    adminNotes: notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
