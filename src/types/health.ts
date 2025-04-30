
import { User } from './auth';

// Health Appointments
export interface HealthAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientCpf?: string;
  patientSusCode?: string;
  professionalId: string;
  professionalName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentTypeId: string;
  appointmentType: AppointmentType;
  procedures: AppointmentProcedure[];
  diagnosis?: string;
  observations?: string;
  healthUnit: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface AppointmentProcedure {
  id: string;
  appointmentId: string;
  name: string;
  code?: string;
  description?: string;
}

export interface AppointmentAttachment {
  id: string;
  appointmentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Medications
export interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  dosage: string;
  form: string;
  stock: number;
  minStock: number;
  expirationDate?: string;
  batch?: string;
  location: string;
}

export interface MedicationDispensing {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  batch?: string;
  prescriptionId?: string;
  dispensedAt: string;
  dispensedBy: string;
  observations?: string;
}

// TFD (Treatment Away from Home)
export interface TFDReferral {
  id: string;
  protocolNumber: string;
  patientId: string;
  patientName: string;
  patientCpf?: string;
  specialty: string;
  destinationCity: string;
  referralReason: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: TFDStatus;
  estimatedWaitTime?: number; // in days
  referredBy: string;
  referredAt: string;
  scheduledDate?: string;
  transportId?: string;
  observations?: string;
}

export type TFDStatus = 
  | 'referred'     // Encaminhado
  | 'authorized'   // Autorizado
  | 'scheduled'    // Agendado
  | 'in-transport' // Em transporte
  | 'completed'    // Finalizado
  | 'canceled';    // Cancelado

export interface TFDDocument {
  id: string;
  referralId: string;
  documentType: 'medical-report' | 'exam' | 'authorization' | 'other';
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TFDTransport {
  id: string;
  vehicleId: string;
  vehicleDescription: string;
  driverId: string;
  driverName: string;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  capacity: number;
  occupiedSeats: number;
  notes?: string;
}

// Health Programs
export interface HealthProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  meetingFrequency?: string;
  coordinatorId: string;
  coordinatorName: string;
  category: string; // e.g., 'hiperdia', 'saude_mental', etc.
  createdAt: string;
}

export interface ProgramParticipant {
  id: string;
  programId: string;
  patientId: string;
  patientName: string;
  joinDate: string;
  exitDate?: string;
  isActive: boolean;
  notes?: string;
  metrics?: Record<string, any>; // For program-specific metrics like blood pressure, weight, etc.
}

export interface ProgramActivity {
  id: string;
  programId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  responsibleId: string;
  responsibleName: string;
  maxParticipants?: number;
  actualParticipants?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'canceled';
}

// Campaigns
export interface HealthCampaign {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  category: string; // e.g., 'vaccination', 'screening', 'awareness', etc.
  coordinatorId: string;
  coordinatorName: string;
  createdAt: string;
}

export interface CampaignLocation {
  id: string;
  campaignId: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  startTime: string;
  endTime: string;
  date: string;
  capacity?: number;
  responsible?: string;
  notes?: string;
}

export interface CampaignParticipant {
  id: string;
  campaignId: string;
  locationId?: string;
  citizenId: string;
  citizenName: string;
  citizenCpf?: string;
  participationDate: string;
  notes?: string;
  serviceDone?: string; // e.g., 'vaccine type', 'exam done', etc.
  serviceResult?: string;
}

// ACS (Community Health Agents)
export interface ACSAgent {
  id: string;
  name: string;
  registration: string;
  email?: string;
  phone?: string;
  healthUnitId: string;
  healthUnitName: string;
  territoryId: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export interface ACSTerritory {
  id: string;
  name: string;
  description?: string;
  neighborhoodCoverage: string[];
  familiesCount: number;
  peopleCount: number;
  healthUnitId: string;
}

export interface ACSVisit {
  id: string;
  agentId: string;
  agentName: string;
  familyId: string;
  familyName: string;
  address: string;
  visitDate: string;
  visitTime: string;
  visitReason: string;
  actionsPerformed: string[];
  observations?: string;
  hasReferral: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface ACSFamily {
  id: string;
  familyNumber: string;
  responsibleName: string;
  address: string;
  neighborhood: string;
  peopleCount: number;
  contactPhone?: string;
  territoryId: string;
  riskLevel?: 'low' | 'medium' | 'high';
  observations?: string;
  lastVisit?: string;
}
