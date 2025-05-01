import { supabase } from "@/integrations/supabase/client";
import {
  AssistanceCenter,
  EmergencyBenefit,
  FamilyMember,
  FamilyMonitoringPlan,
  FamilyVisit,
  SocialAttendance,
  SocialProgram,
  VulnerableFamily,
  Evolution,
} from "@/types/assistance";

// CRAS/CREAS centers
export const getAssistanceCenters = async (): Promise<AssistanceCenter[]> => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching assistance centers:", error);
    throw error;
  }

  // Cast data to the correct type
  return data?.map(center => ({
    ...center,
    type: center.type as "CRAS" | "CREAS"
  })) || [];
};

export const getAssistanceCenter = async (id: string): Promise<AssistanceCenter> => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching assistance center:", error);
    throw error;
  }

  // Cast to the correct type
  return {
    ...data,
    type: data.type as "CRAS" | "CREAS"
  };
};

export const createAssistanceCenter = async (center: Omit<AssistanceCenter, "id" | "created_at" | "updated_at">): Promise<AssistanceCenter> => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .insert([center])
    .select()
    .single();

  if (error) {
    console.error("Error creating assistance center:", error);
    throw error;
  }

  // Cast to the correct type
  return {
    ...data,
    type: data.type as "CRAS" | "CREAS"
  };
};

export const updateAssistanceCenter = async (id: string, center: Partial<AssistanceCenter>): Promise<AssistanceCenter> => {
  const { data, error } = await supabase
    .from("assistance_centers")
    .update(center)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating assistance center:", error);
    throw error;
  }

  // Cast to the correct type
  return {
    ...data,
    type: data.type as "CRAS" | "CREAS"
  };
};

export const deleteAssistanceCenter = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("assistance_centers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting assistance center:", error);
    throw error;
  }
};

// Social Attendances
export const getSocialAttendances = async (): Promise<SocialAttendance[]> => {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .order("attendance_date", { ascending: false });

  if (error) {
    console.error("Error fetching social attendances:", error);
    throw error;
  }

  return data || [];
};

export const getSocialAttendance = async (id: string): Promise<SocialAttendance> => {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching social attendance:", error);
    throw error;
  }

  return data;
};

export const createSocialAttendance = async (attendance: Omit<SocialAttendance, "id" | "created_at" | "updated_at">): Promise<SocialAttendance> => {
  const { data, error } = await supabase
    .from("social_attendances")
    .insert([attendance])
    .select()
    .single();

  if (error) {
    console.error("Error creating social attendance:", error);
    throw error;
  }

  return data;
};

export const updateSocialAttendance = async (id: string, attendance: Partial<SocialAttendance>): Promise<SocialAttendance> => {
  const { data, error } = await supabase
    .from("social_attendances")
    .update(attendance)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating social attendance:", error);
    throw error;
  }

  return data;
};

// Vulnerable Families
export const getVulnerableFamilies = async (): Promise<VulnerableFamily[]> => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .order("family_name");

  if (error) {
    console.error("Error fetching vulnerable families:", error);
    throw error;
  }

  return data || [];
};

export const getVulnerableFamily = async (id: string): Promise<VulnerableFamily> => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching vulnerable family:", error);
    throw error;
  }

  return data;
};

export const createVulnerableFamily = async (family: Omit<VulnerableFamily, "id" | "created_at" | "updated_at">): Promise<VulnerableFamily> => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .insert([family])
    .select()
    .single();

  if (error) {
    console.error("Error creating vulnerable family:", error);
    throw error;
  }

  return data;
};

export const updateVulnerableFamily = async (id: string, family: Partial<VulnerableFamily>): Promise<VulnerableFamily> => {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .update(family)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vulnerable family:", error);
    throw error;
  }

  return data;
};

export const deleteVulnerableFamily = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("vulnerable_families")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting vulnerable family:", error);
    throw error;
  }
};

// Family Members
export const getFamilyMembers = async (familyId: string): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from("family_members")
    .select("*, citizen_id(*)")
    .eq("family_id", familyId);

  if (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }

  return data || [];
};

export const addFamilyMember = async (member: Omit<FamilyMember, "id" | "created_at" | "updated_at">): Promise<FamilyMember> => {
  const { data, error } = await supabase
    .from("family_members")
    .insert([member])
    .select()
    .single();

  if (error) {
    console.error("Error adding family member:", error);
    throw error;
  }

  return data;
};

export const removeFamilyMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error removing family member:", error);
    throw error;
  }
};

// Family Monitoring Plans
export const getFamilyMonitoringPlans = async (familyId: string): Promise<FamilyMonitoringPlan[]> => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .select("*")
    .eq("family_id", familyId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching family monitoring plans:", error);
    throw error;
  }

  return data || [];
};

export const createFamilyMonitoringPlan = async (plan: Omit<FamilyMonitoringPlan, "id" | "created_at" | "updated_at">): Promise<FamilyMonitoringPlan> => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .insert([plan])
    .select()
    .single();

  if (error) {
    console.error("Error creating family monitoring plan:", error);
    throw error;
  }

  return data;
};

export const updateFamilyMonitoringPlan = async (id: string, plan: Partial<FamilyMonitoringPlan>): Promise<FamilyMonitoringPlan> => {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .update(plan)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating family monitoring plan:", error);
    throw error;
  }

  return data;
};

// Family Visits
export const getFamilyVisits = async (familyId: string): Promise<FamilyVisit[]> => {
  const { data, error } = await supabase
    .from("family_visits")
    .select("*")
    .eq("family_id", familyId)
    .order("visit_date", { ascending: false });

  if (error) {
    console.error("Error fetching family visits:", error);
    throw error;
  }

  // Cast evolution to correct enum type
  return data?.map(visit => ({
    ...visit,
    evolution: visit.evolution as Evolution
  })) || [];
};

export const createFamilyVisit = async (visit: Omit<FamilyVisit, "id" | "created_at" | "updated_at">): Promise<FamilyVisit> => {
  const { data, error } = await supabase
    .from("family_visits")
    .insert([visit])
    .select()
    .single();

  if (error) {
    console.error("Error creating family visit:", error);
    throw error;
  }

  // Cast evolution to correct enum type
  return {
    ...data,
    evolution: data.evolution as Evolution
  };
};

// Benefits
export const getEmergencyBenefits = async (): Promise<EmergencyBenefit[]> => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .order("request_date", { ascending: false });

  if (error) {
    console.error("Error fetching emergency benefits:", error);
    throw error;
  }

  return data || [];
};

export const getEmergencyBenefit = async (id: string): Promise<EmergencyBenefit> => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching emergency benefit:", error);
    throw error;
  }

  return data;
};

export const createEmergencyBenefit = async (benefit: Omit<EmergencyBenefit, "id" | "created_at" | "updated_at">): Promise<EmergencyBenefit> => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .insert([benefit])
    .select()
    .single();

  if (error) {
    console.error("Error creating emergency benefit:", error);
    throw error;
  }

  return data;
};

export const updateEmergencyBenefit = async (id: string, benefit: Partial<EmergencyBenefit>): Promise<EmergencyBenefit> => {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .update(benefit)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating emergency benefit:", error);
    throw error;
  }

  return data;
};

// Social Programs
export const getSocialPrograms = async (): Promise<SocialProgram[]> => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching social programs:", error);
    throw error;
  }

  // Cast scope to the correct type
  return data?.map(program => ({
    ...program,
    scope: program.scope as "municipal" | "state" | "federal"
  })) || [];
};

export const getSocialProgram = async (id: string): Promise<SocialProgram> => {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching social program:", error);
    throw error;
  }

  // Cast scope to the correct type
  return {
    ...data,
    scope: data.scope as "municipal" | "state" | "federal"
  };
};

export const createSocialProgram = async (program: Omit<SocialProgram, "id" | "created_at" | "updated_at">): Promise<SocialProgram> => {
  const { data, error } = await supabase
    .from("social_programs")
    .insert([program])
    .select()
    .single();

  if (error) {
    console.error("Error creating social program:", error);
    throw error;
  }

  // Cast scope to the correct type
  return {
    ...data,
    scope: data.scope as "municipal" | "state" | "federal"
  };
};

export const updateSocialProgram = async (id: string, program: Partial<SocialProgram>): Promise<SocialProgram> => {
  const { data, error } = await supabase
    .from("social_programs")
    .update(program)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating social program:", error);
    throw error;
  }

  // Cast scope to the correct type
  return {
    ...data,
    scope: data.scope as "municipal" | "state" | "federal"
  };
};

export const deleteSocialProgram = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("social_programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting social program:", error);
    throw error;
  }
};
