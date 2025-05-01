
import { supabase } from "@/integrations/supabase/client";
import {
  EmergencyBenefit,
  BenefitAttachment,
  SocialProgram,
  ProgramBeneficiary,
  AssistanceCenter,
  SocialAttendance,
  AttendanceAttachment,
  VulnerableFamily,
  FamilyMember,
  FamilyMonitoringPlan,
  FamilyVisit,
  VisitAttachment,
} from "@/types/assistance";

// Emergency Benefits
export const getEmergencyBenefits = async () => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .order("request_date", { ascending: false });

  if (error) {
    console.error("Error fetching emergency benefits:", error);
    throw error;
  }

  return data as EmergencyBenefit[];
};

export const getEmergencyBenefitById = async (id: string) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching emergency benefit with id ${id}:`, error);
    throw error;
  }

  return data as EmergencyBenefit;
};

export const createEmergencyBenefit = async (benefit: Omit<EmergencyBenefit, 'id' | 'protocol_number' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .insert([benefit])
    .select();

  if (error) {
    console.error("Error creating emergency benefit:", error);
    throw error;
  }

  return data[0] as EmergencyBenefit;
};

export const updateEmergencyBenefit = async (id: string, benefit: Partial<EmergencyBenefit>) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .update(benefit)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating emergency benefit with id ${id}:`, error);
    throw error;
  }

  return data[0] as EmergencyBenefit;
};

export const getBenefitAttachments = async (benefitId: string) => {
  const { data, error } = await supabase
    .from("benefit_attachments")
    .select("*")
    .eq("benefit_id", benefitId);

  if (error) {
    console.error(`Error fetching attachments for benefit ${benefitId}:`, error);
    throw error;
  }

  return data as BenefitAttachment[];
};

export const uploadBenefitAttachment = async (
  benefitId: string,
  file: File,
  userId: string
) => {
  const filePath = `benefit_attachments/${benefitId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("tfd_documents")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw uploadError;
  }

  const attachment = {
    benefit_id: benefitId,
    file_name: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId,
  };

  const { data, error } = await supabase
    .from("benefit_attachments")
    .insert([attachment])
    .select();

  if (error) {
    console.error("Error creating attachment record:", error);
    throw error;
  }

  return data[0] as BenefitAttachment;
};

// Social Programs
export const getSocialPrograms = async () => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching social programs:", error);
    throw error;
  }

  return data as SocialProgram[];
};

export const getSocialProgramById = async (id: string) => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching social program with id ${id}:`, error);
    throw error;
  }

  return data as SocialProgram;
};

export const createSocialProgram = async (program: Omit<SocialProgram, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("social_programs")
    .insert([program])
    .select();

  if (error) {
    console.error("Error creating social program:", error);
    throw error;
  }

  return data[0] as SocialProgram;
};

export const updateSocialProgram = async (id: string, program: Partial<SocialProgram>) => {
  const { data, error } = await supabase
    .from("social_programs")
    .update(program)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating social program with id ${id}:`, error);
    throw error;
  }

  return data[0] as SocialProgram;
};

export const getProgramBeneficiaries = async (programId?: string) => {
  let query = supabase
    .from("program_beneficiaries")
    .select("*");
  
  if (programId) {
    query = query.eq("program_id", programId);
  }
  
  const { data, error } = await query.order("entry_date", { ascending: false });

  if (error) {
    console.error("Error fetching program beneficiaries:", error);
    throw error;
  }

  return data as ProgramBeneficiary[];
};

export const createProgramBeneficiary = async (beneficiary: Omit<ProgramBeneficiary, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .insert([beneficiary])
    .select();

  if (error) {
    console.error("Error creating program beneficiary:", error);
    throw error;
  }

  return data[0] as ProgramBeneficiary;
};

// Assistance Centers (CRAS/CREAS)
export const getAssistanceCenters = async () => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching assistance centers:", error);
    throw error;
  }

  return data as AssistanceCenter[];
};

export const getAssistanceCenterById = async (id: string) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching assistance center with id ${id}:`, error);
    throw error;
  }

  return data as AssistanceCenter;
};

export const createAssistanceCenter = async (center: Omit<AssistanceCenter, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .insert([center])
    .select();

  if (error) {
    console.error("Error creating assistance center:", error);
    throw error;
  }

  return data[0] as AssistanceCenter;
};

export const updateAssistanceCenter = async (id: string, center: Partial<AssistanceCenter>) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .update(center)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating assistance center with id ${id}:`, error);
    throw error;
  }

  return data[0] as AssistanceCenter;
};

// Social Attendances
export const getSocialAttendances = async (centerId?: string) => {
  let query = supabase
    .from("social_attendances")
    .select("*");
  
  if (centerId) {
    query = query.eq("center_id", centerId);
  }
  
  const { data, error } = await query.order("attendance_date", { ascending: false });

  if (error) {
    console.error("Error fetching social attendances:", error);
    throw error;
  }

  return data as SocialAttendance[];
};

export const getSocialAttendanceById = async (id: string) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching social attendance with id ${id}:`, error);
    throw error;
  }

  return data as SocialAttendance;
};

export const createSocialAttendance = async (attendance: Omit<SocialAttendance, 'id' | 'protocol_number' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .insert([attendance])
    .select();

  if (error) {
    console.error("Error creating social attendance:", error);
    throw error;
  }

  return data[0] as SocialAttendance;
};

export const updateSocialAttendance = async (id: string, attendance: Partial<SocialAttendance>) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .update(attendance)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating social attendance with id ${id}:`, error);
    throw error;
  }

  return data[0] as SocialAttendance;
};

export const getAttendanceAttachments = async (attendanceId: string) => {
  const { data, error } = await supabase
    .from("attendance_attachments")
    .select("*")
    .eq("attendance_id", attendanceId);

  if (error) {
    console.error(`Error fetching attachments for attendance ${attendanceId}:`, error);
    throw error;
  }

  return data as AttendanceAttachment[];
};

export const uploadAttendanceAttachment = async (
  attendanceId: string,
  file: File,
  userId: string
) => {
  const filePath = `attendance_attachments/${attendanceId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("tfd_documents")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw uploadError;
  }

  const attachment = {
    attendance_id: attendanceId,
    file_name: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId,
  };

  const { data, error } = await supabase
    .from("attendance_attachments")
    .insert([attachment])
    .select();

  if (error) {
    console.error("Error creating attachment record:", error);
    throw error;
  }

  return data[0] as AttendanceAttachment;
};

// Vulnerable Families
export const getVulnerableFamilies = async () => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vulnerable families:", error);
    throw error;
  }

  return data as VulnerableFamily[];
};

export const getVulnerableFamilyById = async (id: string) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching vulnerable family with id ${id}:`, error);
    throw error;
  }

  return data as VulnerableFamily;
};

export const createVulnerableFamily = async (family: Omit<VulnerableFamily, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .insert([family])
    .select();

  if (error) {
    console.error("Error creating vulnerable family:", error);
    throw error;
  }

  return data[0] as VulnerableFamily;
};

export const updateVulnerableFamily = async (id: string, family: Partial<VulnerableFamily>) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .update(family)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating vulnerable family with id ${id}:`, error);
    throw error;
  }

  return data[0] as VulnerableFamily;
};

export const getFamilyMembers = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId);

  if (error) {
    console.error(`Error fetching family members for family ${familyId}:`, error);
    throw error;
  }

  return data as FamilyMember[];
};

export const createFamilyMember = async (member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("family_members")
    .insert([member])
    .select();

  if (error) {
    console.error("Error creating family member:", error);
    throw error;
  }

  return data[0] as FamilyMember;
};

export const getFamilyMonitoringPlans = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching monitoring plans for family ${familyId}:`, error);
    throw error;
  }

  return data as FamilyMonitoringPlan[];
};

export const createFamilyMonitoringPlan = async (plan: Omit<FamilyMonitoringPlan, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .insert([plan])
    .select();

  if (error) {
    console.error("Error creating family monitoring plan:", error);
    throw error;
  }

  return data[0] as FamilyMonitoringPlan;
};

export const getFamilyVisits = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_visits")
    .select("*")
    .eq("family_id", familyId)
    .order("visit_date", { ascending: false });

  if (error) {
    console.error(`Error fetching visits for family ${familyId}:`, error);
    throw error;
  }

  return data as FamilyVisit[];
};

export const createFamilyVisit = async (visit: Omit<FamilyVisit, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from("family_visits")
    .insert([visit])
    .select();

  if (error) {
    console.error("Error creating family visit:", error);
    throw error;
  }

  return data[0] as FamilyVisit;
};

export const getVisitAttachments = async (visitId: string) => {
  const { data, error } = await supabase
    .from("visit_attachments")
    .select("*")
    .eq("visit_id", visitId);

  if (error) {
    console.error(`Error fetching attachments for visit ${visitId}:`, error);
    throw error;
  }

  return data as VisitAttachment[];
};

export const uploadVisitAttachment = async (
  visitId: string,
  file: File,
  userId: string
) => {
  const filePath = `visit_attachments/${visitId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("tfd_documents")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw uploadError;
  }

  const attachment = {
    visit_id: visitId,
    file_name: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId,
  };

  const { data, error } = await supabase
    .from("visit_attachments")
    .insert([attachment])
    .select();

  if (error) {
    console.error("Error creating attachment record:", error);
    throw error;
  }

  return data[0] as VisitAttachment;
};
