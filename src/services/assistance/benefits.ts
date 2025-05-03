
import { supabase } from '@/integrations/supabase/client';
import { EmergencyBenefit, BenefitAttachment, BenefitStatus } from '@/types/assistance';

export async function fetchBenefits(): Promise<EmergencyBenefit[]> {
  const { data, error } = await supabase
    .from('emergency_benefits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching benefits:', error);
    throw error;
  }

  return data || [];
}

export async function fetchBenefitById(id: string): Promise<EmergencyBenefit | null> {
  const { data, error } = await supabase
    .from('emergency_benefits')
    .select(`
      *,
      attachments:benefit_attachments(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching benefit:', error);
    throw error;
  }

  return data;
}

export async function createBenefit(benefit: Partial<EmergencyBenefit>): Promise<EmergencyBenefit> {
  // Make sure required fields are present
  if (!benefit.benefit_type) {
    throw new Error('Benefit type is required');
  }
  if (!benefit.reason) {
    throw new Error('Reason is required');
  }

  const { data, error } = await supabase
    .from('emergency_benefits')
    .insert(benefit)
    .select()
    .single();

  if (error) {
    console.error('Error creating benefit:', error);
    throw error;
  }

  return data;
}

export async function updateBenefit(id: string, benefit: Partial<EmergencyBenefit>): Promise<EmergencyBenefit> {
  const { data, error } = await supabase
    .from('emergency_benefits')
    .update(benefit)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating benefit:', error);
    throw error;
  }

  return data;
}

export async function updateBenefitStatus(
  id: string, 
  status: BenefitStatus,
  comments?: string
): Promise<EmergencyBenefit> {
  const updates: Record<string, any> = { 
    status, 
    comments: comments || undefined
  };
  
  // Add delivery_date when status is delivered
  if (status === 'delivered') {
    updates.delivery_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('emergency_benefits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating benefit status:', error);
    throw error;
  }

  return data;
}

export async function uploadBenefitAttachment(
  benefitId: string,
  file: File,
  userId: string
): Promise<BenefitAttachment> {
  // First upload the file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `benefits/${benefitId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('tfd_documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Then create a record in the attachments table
  const attachment = {
    benefit_id: benefitId,
    file_name: fileName,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId
  };

  const { data, error } = await supabase
    .from('benefit_attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error('Error saving attachment record:', error);
    throw error;
  }

  return data;
}
