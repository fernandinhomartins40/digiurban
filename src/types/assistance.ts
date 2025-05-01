
export type BenefitStatus = "pending" | "approved" | "delivering" | "completed" | "rejected";
export type VulnerabilityCriteria = "income" | "housing" | "education" | "domestic_violence" | "health" | "unemployment" | "food_insecurity" | "other";
export type AttendanceType = "reception" | "qualified_listening" | "referral" | "guidance" | "follow_up" | "other";
export type FamilyStatus = "monitoring" | "stable" | "critical" | "improved" | "completed";
export type Evolution = "improved" | "stable" | "worsened";

export interface EmergencyBenefit {
  id: string;
  citizen_id?: string;
  protocol_number: string;
  request_date?: string;
  reason: string;
  status?: BenefitStatus;
  benefit_type: string;
  delivery_date?: string;
  responsible_id?: string;
  receiver_signature?: string;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BenefitAttachment {
  id: string;
  benefit_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at?: string;
}

export interface SocialProgram {
  id: string;
  name: string;
  description?: string;
  scope: "municipal" | "state" | "federal";
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramBeneficiary {
  id: string;
  citizen_id?: string;
  program_id: string;
  nis_number?: string;
  entry_date: string;
  exit_date?: string;
  is_active?: boolean;
  last_update_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssistanceCenter {
  id: string;
  name: string;
  type: "CRAS" | "CREAS";
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  coordinator_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialAttendance {
  id: string;
  protocol_number: string;
  citizen_id?: string;
  center_id?: string;
  attendance_date?: string;
  attendance_type: AttendanceType;
  professional_id?: string;
  description: string;
  referrals?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceAttachment {
  id: string;
  attendance_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at?: string;
}

export interface VulnerableFamily {
  id: string;
  family_name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  reference_person_id?: string;
  vulnerability_criteria: VulnerabilityCriteria[];
  family_status?: FamilyStatus;
  responsible_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  citizen_id: string;
  relationship: string;
  is_dependent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyMonitoringPlan {
  id: string;
  family_id: string;
  start_date: string;
  end_date?: string;
  contact_frequency: string;
  responsible_id?: string;
  actions: string[];
  objectives: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyVisit {
  id: string;
  family_id: string;
  visit_date: string;
  professional_id?: string;
  observations: string;
  situation: string;
  evolution?: Evolution;
  next_visit_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VisitAttachment {
  id: string;
  visit_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at?: string;
}
