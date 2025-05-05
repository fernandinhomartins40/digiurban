
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: "1",
    requesterName: "João Silva",
    requesterEmail: "joao.silva@exemplo.com",
    subject: "Reunião sobre infraestrutura urbana",
    description: "Gostaria de discutir melhorias na infraestrutura do bairro São José.",
    requestedDate: new Date("2025-06-10"),
    requestedTime: "10:00",
    durationMinutes: 30,
    status: "pending",
    priority: "normal",
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-01"),
    location: "Gabinete do Prefeito"
  },
  {
    id: "2",
    requesterName: "Maria Oliveira",
    requesterEmail: "maria.oliveira@exemplo.com",
    subject: "Projeto de revitalização da praça central",
    description: "Apresentação do projeto comunitário para revitalização da praça central.",
    requestedDate: new Date("2025-06-12"),
    requestedTime: "14:00",
    durationMinutes: 45,
    status: "approved",
    priority: "high",
    adminNotes: "Importante projeto comunitário com apoio de vários comerciantes locais.",
    createdAt: new Date("2025-05-02"),
    updatedAt: new Date("2025-05-03"),
    location: "Sala de reuniões"
  },
  {
    id: "3",
    requesterName: "Carlos Santos",
    requesterEmail: "carlos.santos@exemplo.com",
    subject: "Discussão sobre coleta seletiva",
    description: "Proposta para implementação de coleta seletiva em novos bairros.",
    requestedDate: new Date("2025-06-15"),
    requestedTime: "11:30",
    durationMinutes: 30,
    status: "rejected",
    priority: "normal",
    adminNotes: "Encaminhar para Secretaria de Meio Ambiente.",
    createdAt: new Date("2025-05-03"),
    updatedAt: new Date("2025-05-04"),
    location: "Gabinete do Prefeito"
  }
];

// Mock service for mayor appointments
export async function getMayorAppointments(
  status?: AppointmentStatus,
  searchTerm?: string
): Promise<Appointment[]> {
  // In a real app, this would call an API with query parameters
  
  // For now, simulate filtering with our mock data
  let filteredAppointments = [...mockAppointments];
  
  // Filter by status if provided
  if (status) {
    filteredAppointments = filteredAppointments.filter(
      appointment => appointment.status === status
    );
  }
  
  // Filter by search term if provided
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase().trim();
    filteredAppointments = filteredAppointments.filter(
      appointment => 
        appointment.requesterName.toLowerCase().includes(term) || 
        appointment.subject.toLowerCase().includes(term)
    );
  }
  
  return filteredAppointments;
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
