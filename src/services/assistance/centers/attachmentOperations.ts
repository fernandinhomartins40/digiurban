
import { supabase } from '@/integrations/supabase/client';
import { AttendanceAttachment } from '@/types/assistance';

export async function uploadAttendanceAttachment(
  attendanceId: string,
  file: File,
  userId: string
): Promise<AttendanceAttachment> {
  // First upload the file to storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `attendances/${attendanceId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('tfd_documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Then create a record in the attachments table
  const attachment = {
    attendance_id: attendanceId,
    file_name: fileName,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId
  };

  const { data, error } = await supabase
    .from('attendance_attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) {
    console.error('Error saving attachment record:', error);
    throw error;
  }

  return data;
}
