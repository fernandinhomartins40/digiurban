
import { supabase } from '@/integrations/supabase/client';
import { SocialProgram, ProgramBeneficiary } from '@/types/assistance';

export async function fetchSocialPrograms(): Promise<SocialProgram[]> {
  const { data, error } = await supabase
    .from('social_programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching social programs:', error);
    throw error;
  }

  return data || [];
}

export async function fetchProgramById(id: string): Promise<SocialProgram | null> {
  const { data, error } = await supabase
    .from('social_programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching social program:', error);
    throw error;
  }

  return data;
}

export async function createProgram(program: Partial<SocialProgram>): Promise<SocialProgram> {
  const { data, error } = await supabase
    .from('social_programs')
    .insert(program)
    .select()
    .single();

  if (error) {
    console.error('Error creating social program:', error);
    throw error;
  }

  return data;
}

export async function updateProgram(id: string, program: Partial<SocialProgram>): Promise<SocialProgram> {
  const { data, error } = await supabase
    .from('social_programs')
    .update(program)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating social program:', error);
    throw error;
  }

  return data;
}

export async function fetchProgramBeneficiaries(programId: string): Promise<ProgramBeneficiary[]> {
  const { data, error } = await supabase
    .from('program_beneficiaries')
    .select('*')
    .eq('program_id', programId)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching program beneficiaries:', error);
    throw error;
  }

  return data || [];
}

export async function addBeneficiary(beneficiary: Partial<ProgramBeneficiary>): Promise<ProgramBeneficiary> {
  const { data, error } = await supabase
    .from('program_beneficiaries')
    .insert(beneficiary)
    .select()
    .single();

  if (error) {
    console.error('Error adding beneficiary:', error);
    throw error;
  }

  return data;
}

export async function removeBeneficiary(id: string): Promise<void> {
  const { error } = await supabase
    .from('program_beneficiaries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing beneficiary:', error);
    throw error;
  }
}

export async function updateBeneficiary(id: string, beneficiary: Partial<ProgramBeneficiary>): Promise<ProgramBeneficiary> {
  const { data, error } = await supabase
    .from('program_beneficiaries')
    .update(beneficiary)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating beneficiary:', error);
    throw error;
  }

  return data;
}
