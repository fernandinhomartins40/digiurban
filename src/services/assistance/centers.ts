
import { supabase } from '@/integrations/supabase/client';
import { AssistanceCenter, SocialAttendance, AttendanceAttachment, AttendanceType } from '@/types/assistance';

export async function fetchAssistanceCenters(): Promise<AssistanceCenter[]> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching assistance centers:', error);
    throw error;
  }

  return data || [];
}

export async function fetchCenterById(id: string): Promise<AssistanceCenter | null> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching assistance center:', error);
    throw error;
  }

  return data;
}

export async function createCenter(center: Partial<AssistanceCenter>): Promise<AssistanceCenter> {
  // Make sure required fields are present
  if (!center.name) {
    throw new Error('Center name is required');
  }
  if (!center.type) {
    throw new Error('Center type is required');
  }
  if (!center.address) {
    throw new Error('Address is required');
  }
  if (!center.neighborhood) {
    throw new Error('Neighborhood is required');
  }
  if (!center.city) {
    throw new Error('City is required');
  }
  if (!center.state) {
    throw new Error('State is required');
  }

  // Create a safe center object with only the allowed fields
  const safeCenter = {
    name: center.name,
    type: center.type,
    address: center.address,
    neighborhood: center.neighborhood,
    city: center.city,
    state: center.state,
    phone: center.phone,
    email: center.email,
    coordinator_name: center.coordinator_name,
    is_active: center.is_active !== undefined ? center.is_active : true
  };

  const { data, error } = await supabase
    .from('assistance_centers')
    .insert(safeCenter)
    .select()
    .single();

  if (error) {
    console.error('Error creating assistance center:', error);
    throw error;
  }

  return data;
}

export async function updateCenter(id: string, center: Partial<AssistanceCenter>): Promise<AssistanceCenter> {
  const { data, error } = await supabase
    .from('assistance_centers')
    .update(center)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating assistance center:', error);
    throw error;
  }

  return data;
}

export async function fetchAttendances(centerId?: string): Promise<SocialAttendance[]> {
  let query = supabase
    .from('social_attendances')
    .select('*')
    .order('created_at', { ascending: false });

  if (centerId) {
    query = query.eq('center_id', centerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching social attendances:', error);
    throw error;
  }

  return data || [];
}

export async function fetchAttendanceById(id: string): Promise<SocialAttendance | null> {
  const { data, error } = await supabase
    .from('social_attendances')
    .select(`
      *,
      attachments:attendance_attachments(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching social attendance:', error);
    throw error;
  }

  return data;
}

export async function createAttendance(attendance: Partial<SocialAttendance>): Promise<SocialAttendance> {
  // Validate required fields
  if (!attendance.attendance_type) {
    throw new Error('Attendance type is required');
  }
  if (!attendance.description) {
    throw new Error('Description is required');
  }
  
  // Validate attendance_type is one of the allowed values
  const validAttendanceTypes: AttendanceType[] = [
    'individual', 'family', 'group', 'other', 'reception', 
    'qualified_listening', 'referral', 'guidance', 'follow_up'
  ];
  
  if (!validAttendanceTypes.includes(attendance.attendance_type)) {
    throw new Error('Invalid attendance type');
  }

  // Create a safe attendance object
  const safeAttendance = {
    protocol_number: attendance.protocol_number,
    citizen_id: attendance.citizen_id,
    citizen_name: attendance.citizen_name,
    professional_id: attendance.professional_id,
    professional_name: attendance.professional_name,
    center_id: attendance.center_id,
    center_name: attendance.center_name,
    attendance_type: attendance.attendance_type,
    attendance_date: attendance.attendance_date,
    description: attendance.description,
    referrals: attendance.referrals,
    follow_up_required: attendance.follow_up_required,
    follow_up_date: attendance.follow_up_date
  };

  const { data, error } = await supabase
    .from('social_attendances')
    .insert(safeAttendance)
    .select()
    .single();

  if (error) {
    console.error('Error creating social attendance:', error);
    throw error;
  }

  return data;
}

export async function updateAttendance(id: string, attendance: Partial<SocialAttendance>): Promise<SocialAttendance> {
  // Validate attendance_type if provided
  if (attendance.attendance_type) {
    const validAttendanceTypes: AttendanceType[] = [
      'individual', 'family', 'group', 'other', 'reception', 
      'qualified_listening', 'referral', 'guidance', 'follow_up'
    ];
    
    if (!validAttendanceTypes.includes(attendance.attendance_type)) {
      throw new Error('Invalid attendance type');
    }
  }
  
  const { data, error } = await supabase
    .from('social_attendances')
    .update(attendance)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating social attendance:', error);
    throw error;
  }

  return data;
}

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
