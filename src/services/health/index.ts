
// Re-export all health service functions for easier importing
export * from './appointments';
export * from './medications';
export * from './tfd';
export * from './programs';
export * from './campaigns';
export * from './acs';

// Re-export types from types/health that are used in health services
import { 
  HealthAppointment, 
  AppointmentType,
  AppointmentProcedure,
  MedicationDispensing,
  TFDReferral,
  TFDStatus,
  HealthProgram,
  ProgramParticipant,
  HealthCampaign,
  ACSVisit,
  ACSAgent
} from "@/types/health";

export type { 
  HealthAppointment, 
  AppointmentType,
  AppointmentProcedure,
  MedicationDispensing,
  TFDReferral,
  TFDStatus,
  HealthProgram,
  ProgramParticipant,
  HealthCampaign,
  ACSVisit,
  ACSAgent
};
