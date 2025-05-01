import { supabase } from "@/integrations/supabase/client";
import { 
  Occurrence, 
  OccurrenceType,
  OccurrenceSeverity,
  OccurrenceAttachment, 
  OccurrencesRequestParams, 
  PaginatedResponse 
} from "@/types/education";

/**
 * Fetches a paginated list of occurrences based on filter criteria
 */
export async function getOccurrences(params: OccurrencesRequestParams = {}): Promise<PaginatedResponse<Occurrence>> {
  const {
    page = 1,
    pageSize = 10,
    studentId,
    schoolId,
    classId,
    occurrenceType,
    startDate,
    endDate,
  } = params;

  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("education_occurrences")
    .select("*", { count: "exact" });

  // Apply filters
  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  if (schoolId) {
    query = query.eq("school_id", schoolId);
  }

  if (classId) {
    query = query.eq("class_id", classId);
  }

  if (occurrenceType) {
    query = query.eq("occurrence_type", occurrenceType);
  }

  if (startDate) {
    query = query.gte("occurrence_date", startDate);
  }

  if (endDate) {
    query = query.lte("occurrence_date", endDate);
  }

  // Fetch the records with pagination
  const { data, error, count } = await query
    .order("occurrence_date", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw error;
  }

  return {
    data: data.map(occurrence => ({
      id: occurrence.id,
      studentId: occurrence.student_id,
      schoolId: occurrence.school_id,
      classId: occurrence.class_id,
      occurrenceType: occurrence.occurrence_type as OccurrenceType,
      subject: occurrence.subject,
      description: occurrence.description,
      severity: occurrence.severity as OccurrenceSeverity,
      reportedBy: occurrence.reported_by,
      reportedByName: occurrence.reported_by_name,
      occurrenceDate: occurrence.occurrence_date,
      resolution: occurrence.resolution,
      resolvedBy: occurrence.resolved_by,
      resolutionDate: occurrence.resolution_date,
      parentNotified: occurrence.parent_notified,
      parentNotificationDate: occurrence.parent_notification_date,
      createdAt: occurrence.created_at,
      updatedAt: occurrence.updated_at
    })),
    count: count || 0,
    page,
    pageSize,
  };
}

/**
 * Get a single occurrence by ID
 */
export async function getOccurrenceById(id: string): Promise<Occurrence> {
  const { data, error } = await supabase
    .from("education_occurrences")
    .select(`
      *,
      education_students(id, name, registration_number),
      education_classes(id, name, grade),
      education_schools(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  // Create the base occurrence object
  const occurrence: Occurrence = {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    classId: data.class_id,
    occurrenceType: data.occurrence_type as OccurrenceType,
    subject: data.subject,
    description: data.description,
    severity: data.severity as OccurrenceSeverity,
    reportedBy: data.reported_by,
    reportedByName: data.reported_by_name,
    occurrenceDate: data.occurrence_date,
    resolution: data.resolution,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    parentNotified: data.parent_notified,
    parentNotificationDate: data.parent_notification_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };

  // Return the occurrence object
  return occurrence;
}

/**
 * Create a new occurrence
 */
export async function createOccurrence(occurrence: Omit<Occurrence, "id" | "createdAt" | "updatedAt">): Promise<Occurrence> {
  const { data, error } = await supabase
    .from("education_occurrences")
    .insert([{
      student_id: occurrence.studentId,
      school_id: occurrence.schoolId,
      class_id: occurrence.classId,
      occurrence_type: occurrence.occurrenceType,
      subject: occurrence.subject,
      description: occurrence.description,
      severity: occurrence.severity,
      reported_by: occurrence.reportedBy,
      reported_by_name: occurrence.reportedByName,
      occurrence_date: occurrence.occurrenceDate,
      resolution: occurrence.resolution,
      resolved_by: occurrence.resolvedBy,
      resolution_date: occurrence.resolutionDate,
      parent_notified: occurrence.parentNotified,
      parent_notification_date: occurrence.parentNotificationDate
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    classId: data.class_id,
    occurrenceType: data.occurrence_type as OccurrenceType,
    subject: data.subject,
    description: data.description,
    severity: data.severity as OccurrenceSeverity,
    reportedBy: data.reported_by,
    reportedByName: data.reported_by_name,
    occurrenceDate: data.occurrence_date,
    resolution: data.resolution,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    parentNotified: data.parent_notified,
    parentNotificationDate: data.parent_notification_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Update an existing occurrence
 */
export async function updateOccurrence(id: string, occurrence: Partial<Omit<Occurrence, "id" | "createdAt" | "updatedAt">>): Promise<Occurrence> {
  const updateData: any = {};

  // Map only the provided fields
  if (occurrence.subject !== undefined) updateData.subject = occurrence.subject;
  if (occurrence.description !== undefined) updateData.description = occurrence.description;
  if (occurrence.severity !== undefined) updateData.severity = occurrence.severity;
  if (occurrence.resolution !== undefined) updateData.resolution = occurrence.resolution;
  if (occurrence.resolvedBy !== undefined) updateData.resolved_by = occurrence.resolvedBy;
  if (occurrence.resolutionDate !== undefined) updateData.resolution_date = occurrence.resolutionDate;
  if (occurrence.parentNotified !== undefined) updateData.parent_notified = occurrence.parentNotified;
  if (occurrence.parentNotificationDate !== undefined) updateData.parent_notification_date = occurrence.parentNotificationDate;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("education_occurrences")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    classId: data.class_id,
    occurrenceType: data.occurrence_type as OccurrenceType,
    subject: data.subject,
    description: data.description,
    severity: data.severity as OccurrenceSeverity,
    reportedBy: data.reported_by,
    reportedByName: data.reported_by_name,
    occurrenceDate: data.occurrence_date,
    resolution: data.resolution,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    parentNotified: data.parent_notified,
    parentNotificationDate: data.parent_notification_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Get attachments for an occurrence
 */
export async function getOccurrenceAttachments(occurrenceId: string): Promise<OccurrenceAttachment[]> {
  const { data, error } = await supabase
    .from("education_occurrence_attachments")
    .select("*")
    .eq("occurrence_id", occurrenceId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(attachment => ({
    id: attachment.id,
    occurrenceId: attachment.occurrence_id,
    fileName: attachment.file_name,
    filePath: attachment.file_path,
    fileSize: attachment.file_size,
    fileType: attachment.file_type,
    uploadedBy: attachment.uploaded_by,
    uploadedAt: attachment.uploaded_at
  }));
}

/**
 * Upload an attachment for an occurrence
 */
export async function uploadOccurrenceAttachment(
  occurrenceId: string,
  file: File,
  userId: string
): Promise<OccurrenceAttachment> {
  // Upload file to storage
  const filePath = `occurrences/${occurrenceId}/${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from("education_documents")
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // Create record in database
  const { data, error } = await supabase
    .from("education_occurrence_attachments")
    .insert([{
      occurrence_id: occurrenceId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: userId
    }])
    .select()
    .single();

  if (error) {
    // Try to delete the uploaded file if record creation fails
    await supabase.storage
      .from("education_documents")
      .remove([filePath]);
      
    throw error;
  }

  return {
    id: data.id,
    occurrenceId: data.occurrence_id,
    fileName: data.file_name,
    filePath: data.file_path,
    fileSize: data.file_size,
    fileType: data.file_type,
    uploadedBy: data.uploaded_by,
    uploadedAt: data.uploaded_at
  };
}

/**
 * Delete an occurrence attachment
 */
export async function deleteOccurrenceAttachment(id: string): Promise<void> {
  // Get the attachment to find the file path
  const { data: attachment, error: getError } = await supabase
    .from("education_occurrence_attachments")
    .select("file_path")
    .eq("id", id)
    .single();

  if (getError) {
    throw getError;
  }

  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from("education_documents")
    .remove([attachment.file_path]);

  if (storageError) {
    throw storageError;
  }

  // Delete the record from database
  const { error: deleteError } = await supabase
    .from("education_occurrence_attachments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw deleteError;
  }
}

/**
 * Get URL for downloading an attachment
 */
export async function getAttachmentDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("education_documents")
    .createSignedUrl(filePath, 3600); // URL valid for 1 hour

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

/**
 * Notify parent about an occurrence
 */
export async function notifyParentAboutOccurrence(occurrenceId: string, userId: string): Promise<Occurrence> {
  const { data, error } = await supabase
    .from("education_occurrences")
    .update({
      parent_notified: true,
      parent_notification_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", occurrenceId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    schoolId: data.school_id,
    classId: data.class_id,
    occurrenceType: data.occurrence_type as OccurrenceType,
    subject: data.subject,
    description: data.description,
    severity: data.severity as OccurrenceSeverity,
    reportedBy: data.reported_by,
    reportedByName: data.reported_by_name,
    occurrenceDate: data.occurrence_date,
    resolution: data.resolution,
    resolvedBy: data.resolved_by,
    resolutionDate: data.resolution_date,
    parentNotified: data.parent_notified,
    parentNotificationDate: data.parent_notification_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
