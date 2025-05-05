
export type RequestStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'forwarded';
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';
export type RequesterType = 'citizen' | 'department' | 'mayor';
export type AuthorType = 'citizen' | 'department' | 'mayor';

export interface UnifiedRequest {
  id: string;
  protocolNumber: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Request origin and destination
  requesterType: RequesterType;
  requesterId: string;
  requesterName?: string; // Derived from the requester ID
  targetDepartment: string;
  
  // Optional citizen reference
  citizenId?: string;
  citizenName?: string; // Derived from the citizen ID
  
  // Status and priority
  status: RequestStatus;
  priority: PriorityLevel;
  
  // Dates
  dueDate?: Date;
  completedAt?: Date;
  
  // For forwarded requests
  originalRequestId?: string;
  previousDepartment?: string;
  
  // Related items (populated separately)
  comments?: RequestComment[];
  attachments?: RequestAttachment[];
  statusHistory?: RequestStatusChange[];
}

export interface RequestComment {
  id: string;
  requestId: string;
  authorId: string;
  authorType: AuthorType;
  authorName?: string; // Derived from authorId
  commentText: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface RequestAttachment {
  id: string;
  requestId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName?: string; // Derived
  uploadedAt: Date;
}

export interface RequestStatusChange {
  id: string;
  requestId: string;
  previousStatus: RequestStatus;
  newStatus: RequestStatus;
  changedBy: string;
  changedByName?: string; // Derived
  comments?: string;
  createdAt: Date;
}

export interface CreateRequestDTO {
  title: string;
  description: string;
  requesterType: RequesterType;
  requesterId: string;
  targetDepartment: string;
  citizenId?: string;
  priority: PriorityLevel;
  dueDate?: string;
}

export interface UpdateRequestDTO {
  id: string;
  title?: string;
  description?: string;
  targetDepartment?: string;
  priority?: PriorityLevel;
  status?: RequestStatus;
  dueDate?: string;
}
