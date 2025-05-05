
// Add or update the following type definitions to fix the errors

export type RequestStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'forwarded';
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';
export type RequesterType = 'citizen' | 'department' | 'mayor';

export interface UnifiedRequest {
  id: string;
  protocol_number: string;
  title: string;
  description: string;
  created_at: string | Date;
  updated_at: string | Date;
  requester_type: RequesterType;
  requester_id: string;
  target_department: string;
  citizen_id?: string;
  status: RequestStatus;
  priority: PriorityLevel;
  due_date?: string | Date;
  completed_at?: string | Date;
  original_request_id?: string;
  previous_department?: string;
  
  // Additional fields for UI
  requester_name?: string;
  citizen_name?: string;
  department_name?: string;
  attachments?: RequestAttachment[];
  comments?: RequestComment[];
  status_history?: RequestStatusHistory[];
}

export interface CreateRequestDTO {
  title: string;
  description: string;
  requester_type: RequesterType;
  requester_id: string;
  target_department: string;
  citizen_id?: string;
  priority?: PriorityLevel;
  due_date?: string | Date;
}

export interface UpdateRequestDTO {
  id: string;
  status?: RequestStatus;
  priority?: PriorityLevel;
  target_department?: string;
  description?: string;
  due_date?: string | Date;
  completed_at?: string | Date;
}

export interface RequestStatusHistory {
  id: string;
  request_id: string;
  previous_status: RequestStatus;
  new_status: RequestStatus;
  changed_by: string;
  comments?: string;
  created_at: string | Date;
  
  // Additional fields for UI
  changed_by_name?: string;
}

export interface RequestComment {
  id: string;
  request_id: string;
  author_id: string;
  author_type: RequesterType;
  comment_text: string;
  is_internal: boolean;
  created_at: string | Date;
  
  // Additional fields for UI
  author_name?: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string | Date;
  
  // Additional fields for UI
  uploaded_by_name?: string;
}

// Add this AuthorType to fix the error
export type AuthorType = 'citizen' | 'department' | 'mayor';
