export type BenefitStatus = 'pending' | 'approved' | 'rejected' | 'delivering' | 'delivered' | 'completed';
export type AttendanceType = 'reception' | 'qualified_listening' | 'referral' | 'guidance' | 'follow_up' | 'other';
export type FamilyStatus = 'monitoring' | 'stable' | 'critical' | 'improved' | 'completed';

export interface EmergencyBenefit {
  id: string;
  protocol_number: string;
  citizen_id?: string;
  citizen_name?: string;
  benefit_type: string;
  reason: string;
  status: BenefitStatus;
  responsible_id?: string;
  responsible_name?: string;
  request_date: string;
  delivery_date?: string;
  comments?: string;
  receiver_signature?: string;
  created_at: string;
  updated_at: string;
  attachments?: BenefitAttachment[];
}

export interface BenefitAttachment {
  id: string;
  benefit_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface SocialProgram {
  id: string;
  name: string;
  description?: string;
  scope: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  beneficiaries_count?: number;
}

export interface ProgramBeneficiary {
  id: string;
  program_id: string;
  citizen_id?: string;
  citizen_name?: string;
  nis_number?: string;
  entry_date: string;
  exit_date?: string;
  is_active: boolean;
  last_update_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AssistanceCenter {
  id: string;
  name: string;
  type: string; 
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  coordinator_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendances_count?: number;
}

export interface SocialAttendance {
  id: string;
  protocol_number: string;
  citizen_id?: string;
  citizen_name?: string;
  professional_id?: string;
  professional_name?: string;
  center_id?: string;
  center_name?: string;
  attendance_type: AttendanceType;
  attendance_date: string;
  description: string;
  referrals?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  attachments?: AttendanceAttachment[];
}

export interface AttendanceAttachment {
  id: string;
  attendance_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface VulnerableFamily {
  id: string;
  family_name: string;
  reference_person_id?: string;
  reference_person_name?: string;
  responsible_id?: string;
  responsible_name?: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  vulnerability_criteria: string[];
  family_status: FamilyStatus;
  created_at: string;
  updated_at: string;
  members_count?: number;
  members?: FamilyMember[];
  visits?: FamilyVisit[];
  monitoring_plans?: FamilyMonitoringPlan[];
}

export interface FamilyMember {
  id: string;
  family_id: string;
  citizen_id?: string;
  citizen_name?: string;
  relationship: string;
  is_dependent: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyVisit {
  id: string;
  family_id: string;
  professional_id?: string;
  professional_name?: string;
  visit_date: string;
  next_visit_date?: string;
  situation: string;
  observations: string;
  evolution?: string;
  created_at: string;
  updated_at: string;
  attachments?: VisitAttachment[];
}

export interface VisitAttachment {
  id: string;
  visit_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface FamilyMonitoringPlan {
  id: string;
  family_id: string;
  responsible_id?: string;
  responsible_name?: string;
  start_date: string;
  end_date?: string;
  objectives: string;
  actions: string[];
  contact_frequency: string;
  status: string;
  created_at: string;
  updated_at: string;
}
