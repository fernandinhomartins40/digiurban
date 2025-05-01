
import { supabase } from "@/integrations/supabase/client";
import {
  AssistanceCenter,
  BenefitAttachment,
  EmergencyBenefit,
  FamilyMember,
  FamilyMonitoringPlan,
  FamilyVisit,
  ProgramBeneficiary,
  SocialAttendance,
  SocialProgram,
  VulnerableFamily
} from "@/types/assistance";

// Emergency Benefits
export async function getEmergencyBenefits(): Promise<EmergencyBenefit[]> {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .order("request_date", { ascending: false });

  if (error) {
    console.error("Error fetching emergency benefits:", error);
    throw error;
  }

  return data as EmergencyBenefit[];
}

export async function getEmergencyBenefit(id: string): Promise<EmergencyBenefit> {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching emergency benefit with ID ${id}:`, error);
    throw error;
  }

  return data as EmergencyBenefit;
}

export async function createEmergencyBenefit(benefit: Omit<EmergencyBenefit, "id" | "created_at" | "updated_at" | "protocol_number">): Promise<EmergencyBenefit> {
  // Generate protocol number
  const protocolNumber = `BEN-${Date.now().toString().slice(-6)}`;
  
  const { data, error } = await supabase
    .from("emergency_benefits")
    .insert({
      ...benefit,
      protocol_number: protocolNumber,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating emergency benefit:", error);
    throw error;
  }

  return data as EmergencyBenefit;
}

export async function updateEmergencyBenefit(id: string, updates: Partial<EmergencyBenefit>): Promise<EmergencyBenefit> {
  const { data, error } = await supabase
    .from("emergency_benefits")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating emergency benefit with ID ${id}:`, error);
    throw error;
  }

  return data as EmergencyBenefit;
}

export async function deleteEmergencyBenefit(id: string): Promise<void> {
  const { error } = await supabase
    .from("emergency_benefits")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting emergency benefit with ID ${id}:`, error);
    throw error;
  }
}

// Benefit Attachments
export async function getBenefitAttachments(benefitId: string): Promise<BenefitAttachment[]> {
  const { data, error } = await supabase
    .from("benefit_attachments")
    .select("*")
    .eq("benefit_id", benefitId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error(`Error fetching attachments for benefit ${benefitId}:`, error);
    throw error;
  }

  return data as BenefitAttachment[];
}

export async function createBenefitAttachment(attachment: Omit<BenefitAttachment, "id" | "uploaded_at">): Promise<BenefitAttachment> {
  const { data, error } = await supabase
    .from("benefit_attachments")
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error("Error creating benefit attachment:", error);
    throw error;
  }

  return data as BenefitAttachment;
}

export async function deleteBenefitAttachment(id: string): Promise<void> {
  const { error } = await supabase
    .from("benefit_attachments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting benefit attachment with ID ${id}:`, error);
    throw error;
  }
}

// Social Programs
export async function getSocialPrograms(): Promise<SocialProgram[]> {
  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching social programs:", error);
    throw error;
  }

  return data as SocialProgram[];
}

export async function createSocialProgram(program: Omit<SocialProgram, "id" | "created_at" | "updated_at">): Promise<SocialProgram> {
  const { data, error } = await supabase
    .from("social_programs")
    .insert(program)
    .select()
    .single();

  if (error) {
    console.error("Error creating social program:", error);
    throw error;
  }

  return data as SocialProgram;
}

export async function updateSocialProgram(id: string, updates: Partial<SocialProgram>): Promise<SocialProgram> {
  const { data, error } = await supabase
    .from("social_programs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating social program with ID ${id}:`, error);
    throw error;
  }

  return data as SocialProgram;
}

export async function deleteSocialProgram(id: string): Promise<void> {
  const { error } = await supabase
    .from("social_programs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting social program with ID ${id}:`, error);
    throw error;
  }
}

// Program Beneficiaries
export async function getProgramBeneficiaries(programId: string): Promise<ProgramBeneficiary[]> {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .select("*")
    .eq("program_id", programId);

  if (error) {
    console.error(`Error fetching beneficiaries for program ${programId}:`, error);
    throw error;
  }

  return data as ProgramBeneficiary[];
}

export async function createProgramBeneficiary(beneficiary: Omit<ProgramBeneficiary, "id" | "created_at" | "updated_at">): Promise<ProgramBeneficiary> {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .insert(beneficiary)
    .select()
    .single();

  if (error) {
    console.error("Error creating program beneficiary:", error);
    throw error;
  }

  return data as ProgramBeneficiary;
}

export async function updateProgramBeneficiary(id: string, updates: Partial<ProgramBeneficiary>): Promise<ProgramBeneficiary> {
  const { data, error } = await supabase
    .from("program_beneficiaries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating program beneficiary with ID ${id}:`, error);
    throw error;
  }

  return data as ProgramBeneficiary;
}

export async function deleteProgramBeneficiary(id: string): Promise<void> {
  const { error } = await supabase
    .from("program_beneficiaries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting program beneficiary with ID ${id}:`, error);
    throw error;
  }
}

// Assistance Centers (CRAS/CREAS)
export async function getAssistanceCenters(): Promise<AssistanceCenter[]> {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching assistance centers:", error);
    throw error;
  }

  return data as AssistanceCenter[];
}

export async function getAssistanceCenter(id: string): Promise<AssistanceCenter> {
  const { data, error } = await supabase
    .from("assistance_centers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching assistance center with ID ${id}:`, error);
    throw error;
  }

  return data as AssistanceCenter;
}

export async function createAssistanceCenter(center: Omit<AssistanceCenter, "id" | "created_at" | "updated_at">): Promise<AssistanceCenter> {
  const { data, error } = await supabase
    .from("assistance_centers")
    .insert(center)
    .select()
    .single();

  if (error) {
    console.error("Error creating assistance center:", error);
    throw error;
  }

  return data as AssistanceCenter;
}

export async function updateAssistanceCenter(id: string, updates: Partial<AssistanceCenter>): Promise<AssistanceCenter> {
  const { data, error } = await supabase
    .from("assistance_centers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating assistance center with ID ${id}:`, error);
    throw error;
  }

  return data as AssistanceCenter;
}

export async function deleteAssistanceCenter(id: string): Promise<void> {
  const { error } = await supabase
    .from("assistance_centers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting assistance center with ID ${id}:`, error);
    throw error;
  }
}

// Social Attendances
export async function getSocialAttendances(): Promise<SocialAttendance[]> {
  const { data, error } = await supabase
    .from("social_attendances")
    .select("*")
    .order("attendance_date", { ascending: false });

  if (error) {
    console.error("Error fetching social attendances:", error);
    throw error;
  }

  return data as SocialAttendance[];
}

export async function createSocialAttendance(attendance: Omit<SocialAttendance, "id" | "created_at" | "updated_at" | "protocol_number">): Promise<SocialAttendance> {
  // Generate protocol number
  const protocolNumber = `ATT-${Date.now().toString().slice(-6)}`;
  
  const { data, error } = await supabase
    .from("social_attendances")
    .insert({
      ...attendance,
      protocol_number: protocolNumber,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating social attendance:", error);
    throw error;
  }

  return data as SocialAttendance;
}

// Vulnerable Families
export async function getVulnerableFamilies(): Promise<VulnerableFamily[]> {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .order("family_name");

  if (error) {
    console.error("Error fetching vulnerable families:", error);
    throw error;
  }

  return data as VulnerableFamily[];
}

export async function getVulnerableFamily(id: string): Promise<VulnerableFamily> {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching vulnerable family with ID ${id}:`, error);
    throw error;
  }

  return data as VulnerableFamily;
}

export async function createVulnerableFamily(family: Omit<VulnerableFamily, "id" | "created_at" | "updated_at">): Promise<VulnerableFamily> {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .insert(family)
    .select()
    .single();

  if (error) {
    console.error("Error creating vulnerable family:", error);
    throw error;
  }

  return data as VulnerableFamily;
}

export async function updateVulnerableFamily(id: string, updates: Partial<VulnerableFamily>): Promise<VulnerableFamily> {
  const { data, error } = await supabase
    .from("vulnerable_families")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating vulnerable family with ID ${id}:`, error);
    throw error;
  }

  return data as VulnerableFamily;
}

// Family Members
export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId);

  if (error) {
    console.error(`Error fetching members for family ${familyId}:`, error);
    throw error;
  }

  return data as FamilyMember[];
}

// Family Monitoring Plans
export async function getFamilyMonitoringPlans(familyId: string): Promise<FamilyMonitoringPlan[]> {
  const { data, error } = await supabase
    .from("family_monitoring_plans")
    .select("*")
    .eq("family_id", familyId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error(`Error fetching monitoring plans for family ${familyId}:`, error);
    throw error;
  }

  return data as FamilyMonitoringPlan[];
}

// Family Visits
export async function getFamilyVisits(familyId: string): Promise<FamilyVisit[]> {
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
}
