
import { supabase } from '@/integrations/supabase/client';
import { FamilyVisit, VisitAttachment } from '@/types/assistance';

export async function createFamilyVisit(visit: Partial<FamilyVisit>): Promise<FamilyVisit> {
  // Validate required fields
  if (!visit.family_id) {
    throw new Error('Family ID is required');
  }
  if (!visit.situation) {
    throw new Error('Situation is required');
  }
  if (!visit.observations) {
    throw new Error('Observations are required');
  }
  
  // Create a safe visit object
  const safeVisit = {
    family_id: visit.family_id,
    professional_id: visit.professional_id,
    professional_name: visit.professional_name,
    visit_date: visit.visit_date || new Date().toISOString(),
    next_visit_date: visit.next_visit_date,
    situation: visit.situation,
    observations: visit.observations,
    evolution: visit.evolution
  };

  const { data, error } = await supabase
    .from('family_visits')
    .insert(safeVisit)
    .select()
    .single();

  if (error) {
    console.error('Error creating family visit:', error);
    throw error;
  }

  return data;
}

export async function updateFamilyVisit(id: string, visit: Partial<FamilyVisit>): Promise<FamilyVisit> {
  const { data, error } = await supabase
    .from('family_visits')
    .update(visit)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating family visit:', error);
    throw error;
  }

  return data;
}

export async function uploadVisitAttachment(
  visitId: string,
  file: File,
  userId: string
): Promise<VisitAttachment> {
  // First upload the file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `visits/${visitId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('tfd_documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Then create a record in the attachments table
  const attachment = {
    visit_id: visitId,
    file_name: fileName,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId
  };

  const { data, error } = await supabase
    .from('visit_attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error('Error saving attachment record:', error);
    throw error;
  }

  return data;
}
