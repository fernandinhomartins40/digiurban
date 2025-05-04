
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';
export type RequestStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type PolicyStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type ProgramStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';
export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface DashboardStatistic {
  id: string;
  statDate: Date;
  statType: string;
  statValue: number;
  statTarget?: number;
  sectorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectRequest {
  id: string;
  protocolNumber: string;
  title: string;
  description: string;
  requesterId?: string;
  requesterName?: string;
  targetDepartment: string;
  priority: PriorityLevel;
  status: RequestStatus;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  attachments?: RequestAttachment[];
  comments?: RequestComment[];
}

export interface RequestAttachment {
  id: string;
  requestId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: Date;
}

export interface RequestComment {
  id: string;
  requestId: string;
  commentText: string;
  authorId: string;
  authorName?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  requesterName: string;
  requesterId?: string;
  requesterEmail: string;
  requesterPhone?: string;
  subject: string;
  description?: string;
  requestedDate: Date;
  requestedTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  priority: PriorityLevel;
  adminNotes?: string;
  responseMessage?: string;
  respondedBy?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  protocol_number?: string; // Adding this for backward compatibility
}

export interface Policy {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  status: PolicyStatus;
  startDate?: string;
  endDate?: string;
  targetGoal?: string;
  responsible?: string;
  progress?: number;
  updatedAt?: string;
  key_objectives?: string[];
}

export interface Program {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  status: ProgramStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  responsible?: string;
  progress?: number;
  beneficiaries_count?: number;
  updatedAt?: string;
  milestones?: {
    title: string;
    date?: string;
    completed: boolean;
  }[];
}

// Add new StrategicProgram interface
export interface StrategicProgram {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  spentAmount?: number;
  status: ProgramStatus;
  progressPercentage: number;
  coordinatorId: string;
  coordinatorName?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  milestones?: ProgramMilestone[];
  documents?: ProgramDocument[];
}

// Add supporting interfaces for StrategicProgram
export interface ProgramMilestone {
  id: string;
  programId: string;
  title: string;
  description: string;
  dueDate: Date;
  completionDate?: Date;
  status: string;
  responsibleId: string;
  responsibleName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramDocument {
  id: string;
  programId: string;
  documentTitle: string;
  documentDescription?: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: Date;
}

// Add new PublicPolicy interface
export interface PublicPolicy {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: PolicyStatus;
  responsibleId: string;
  responsibleName?: string;
  department: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  goals?: PolicyGoal[];
}

// Add supporting interface for PublicPolicy
export interface PolicyGoal {
  id: string;
  policyId: string;
  title: string;
  description: string;
  targetValue?: number;
  targetUnit?: string;
  currentValue?: number;
  dueDate?: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}
