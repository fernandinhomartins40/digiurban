
import { supabase } from '@/integrations/supabase/client';
import { SocialProgram, ProgramBeneficiary } from '@/types/assistance';

export async function fetchSocialPrograms(): Promise<SocialProgram[]> {
  const { data, error } = await supabase
    .from('social_programs')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching social programs:', error);
    throw error;
  }

  return data || [];
}

export async function fetchSocialProgramById(id: string): Promise<SocialProgram | null> {
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

export async function createSocialProgram(program: Partial<SocialProgram>): Promise<SocialProgram> {
  if (!program.name) {
    throw new Error('Program name is required');
  }
  if (!program.scope) {
    throw new Error('Program scope is required');
  }

  const { data, error } = await supabase
    .from('social_programs')
    .insert({
      name: program.name,
      description: program.description,
      scope: program.scope,
      start_date: program.start_date,
      end_date: program.end_date,
      is_active: program.is_active ?? true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating social program:', error);
    throw error;
  }

  return data;
}

export async function updateSocialProgram(id: string, program: Partial<SocialProgram>): Promise<SocialProgram> {
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
