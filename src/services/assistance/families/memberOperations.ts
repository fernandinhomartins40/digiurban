
import { supabase } from '@/integrations/supabase/client';
import { FamilyMember } from '@/types/assistance';

export async function createFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
  // Validate required fields
  if (!member.family_id) {
    throw new Error('Family ID is required');
  }
  if (!member.relationship) {
    throw new Error('Relationship is required');
  }
  
  // Create a safe member object
  const safeMember = {
    family_id: member.family_id,
    citizen_id: member.citizen_id,
    citizen_name: member.citizen_name,
    relationship: member.relationship,
    is_dependent: member.is_dependent !== undefined ? member.is_dependent : false
  };

  const { data, error } = await supabase
    .from('family_members')
    .insert(safeMember)
    .select()
    .single();

  if (error) {
    console.error('Error creating family member:', error);
    throw error;
  }

  return data;
}

export async function updateFamilyMember(id: string, member: Partial<FamilyMember>): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating family member:', error);
    throw error;
  }

  return data;
}

export async function removeFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
}
