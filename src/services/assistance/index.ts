
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
  BenefitStatus
} from "@/types/assistance";

// Emergency Benefits Services
export const getEmergencyBenefits = async (filters = {}) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getEmergencyBenefitById = async (id: string) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createEmergencyBenefit = async (
  benefit: Omit<EmergencyBenefit, "id" | "created_at" | "updated_at" | "protocol_number">
) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .insert([benefit])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateEmergencyBenefit = async (
  id: string,
  updates: Partial<EmergencyBenefit>
) => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Benefit Attachments Services
export const getBenefitAttachments = async (benefitId: string) => {
  const { data, error } = await supabase
    .from("benefit_attachments")
    .select("*")
    .eq("benefit_id", benefitId);

  if (error) throw error;
  return { data: data || [] };
};

export const uploadBenefitAttachment = async (
  attachment: Omit<BenefitAttachment, "id" | "uploaded_at">
) => {
  const { data, error } = await supabase
    .from("benefit_attachments")
    .insert([attachment])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Social Programs Services
export const getSocialPrograms = async (filters = {}) => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getSocialProgramById = async (id: string) => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createSocialProgram = async (
  program: Omit<SocialProgram, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("social_programs")
    .insert([program])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateSocialProgram = async (
  id: string,
  updates: Partial<SocialProgram>
) => {
  const { data, error } = await supabase
    .from("social_programs")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Program Beneficiaries Services
export const getProgramBeneficiaries = async (filters = {}) => {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getProgramBeneficiaryById = async (id: string) => {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createProgramBeneficiary = async (
  beneficiary: Omit<ProgramBeneficiary, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .insert([beneficiary])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateProgramBeneficiary = async (
  id: string,
  updates: Partial<ProgramBeneficiary>
) => {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Assistance Centers Services
export const getAssistanceCenters = async (filters = {}) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getAssistanceCenterById = async (id: string) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createAssistanceCenter = async (
  center: Omit<AssistanceCenter, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .insert([center])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateAssistanceCenter = async (
  id: string,
  updates: Partial<AssistanceCenter>
) => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Social Attendances Services
export const getSocialAttendances = async (filters = {}) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getSocialAttendanceById = async (id: string) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createSocialAttendance = async (
  attendance: Omit<SocialAttendance, "id" | "created_at" | "updated_at" | "protocol_number">
) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .insert([attendance])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateSocialAttendance = async (
  id: string,
  updates: Partial<SocialAttendance>
) => {
  const { data, error } = await supabase
    .from("social_attendances")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Attendance Attachments Services
export const getAttendanceAttachments = async (attendanceId: string) => {
  const { data, error } = await supabase
    .from("attendance_attachments")
    .select("*")
    .eq("attendance_id", attendanceId);

  if (error) throw error;
  return { data: data || [] };
};

export const uploadAttendanceAttachment = async (
  attachment: Omit<AttendanceAttachment, "id" | "uploaded_at">
) => {
  const { data, error } = await supabase
    .from("attendance_attachments")
    .insert([attachment])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Vulnerable Families Services
export const getVulnerableFamilies = async (filters = {}) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .match(filters);

  if (error) throw error;
  return { data: data || [] };
};

export const getVulnerableFamilyById = async (id: string) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

export const createVulnerableFamily = async (
  family: Omit<VulnerableFamily, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .insert([family])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateVulnerableFamily = async (
  id: string,
  updates: Partial<VulnerableFamily>
) => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Family Members Services
export const getFamilyMembers = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId);

  if (error) throw error;
  return { data: data || [] };
};

export const createFamilyMember = async (
  member: Omit<FamilyMember, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("family_members")
    .insert([member])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateFamilyMember = async (
  id: string,
  updates: Partial<FamilyMember>
) => {
  const { data, error } = await supabase
    .from("family_members")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const deleteFamilyMember = async (id: string) => {
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
};

// Family Monitoring Plans Services
export const getFamilyMonitoringPlans = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .select("*")
    .eq("family_id", familyId);

  if (error) throw error;
  return { data: data || [] };
};

export const createFamilyMonitoringPlan = async (
  plan: Omit<FamilyMonitoringPlan, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .insert([plan])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateFamilyMonitoringPlan = async (
  id: string,
  updates: Partial<FamilyMonitoringPlan>
) => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Family Visits Services
export const getFamilyVisits = async (familyId: string) => {
  const { data, error } = await supabase
    .from("family_visits")
    .select("*")
    .eq("family_id", familyId)
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return { data: data || [] };
};

export const createFamilyVisit = async (
  visit: Omit<FamilyVisit, "id" | "created_at" | "updated_at">
) => {
  const { data, error } = await supabase
    .from("family_visits")
    .insert([visit])
    .select();

  if (error) throw error;
  return { data: data[0] };
};

export const updateFamilyVisit = async (
  id: string,
  updates: Partial<FamilyVisit>
) => {
  const { data, error } = await supabase
    .from("family_visits")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return { data: data[0] };
};

// Visit Attachments Services
export const getVisitAttachments = async (visitId: string) => {
  const { data, error } = await supabase
    .from("visit_attachments")
    .select("*")
    .eq("visit_id", visitId);

  if (error) throw error;
  return { data: data || [] };
};

export const uploadVisitAttachment = async (
  attachment: Omit<VisitAttachment, "id" | "uploaded_at">
) => {
  const { data, error } = await supabase
    .from("visit_attachments")
    .insert([attachment])
    .select();

  if (error) throw error;
  return { data: data[0] };
};
