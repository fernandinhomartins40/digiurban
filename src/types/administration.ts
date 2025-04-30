
import { RequestStatus } from "./mayorOffice";

// Common Types
export type DocumentType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// HR Types
export type HRDocumentStatus = 'pending' | 'approved' | 'rejected';

export type HRDocument = {
  id: string;
  userId: string;
  documentTypeId: string;
  documentType?: DocumentType;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  observations: string | null;
  status: HRDocumentStatus;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type HRRequestStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export type HRRequestType = {
  id: string;
  name: string;
  description: string | null;
  formSchema: {
    fields: {
      name: string;
      type: string;
      label: string;
      required: boolean;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export type HRRequest = {
  id: string;
  protocolNumber: string;
  userId: string;
  requestTypeId: string;
  requestType?: HRRequestType;
  formData: Record<string, any>;
  status: HRRequestStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type HRRequestAttachment = {
  id: string;
  requestId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
};

export type HRStatusHistory = {
  id: string;
  requestId: string;
  status: HRRequestStatus;
  comments: string | null;
  changedBy: string;
  createdAt: Date;
};

// Purchase Types
export type PurchasePriority = 'low' | 'normal' | 'high' | 'urgent';
export type PurchaseRequestStatus = 'pending' | 'in_analysis' | 'approved' | 'in_process' | 'completed' | 'rejected';

export type PurchaseRequest = {
  id: string;
  protocolNumber: string;
  userId: string;
  department: string;
  justification: string;
  status: PurchaseRequestStatus;
  priority: PurchasePriority;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: PurchaseItem[];
  attachments?: PurchaseAttachment[];
};

export type PurchaseItem = {
  id: string;
  requestId: string;
  name: string;
  quantity: number;
  unit: string;
  description: string | null;
  estimatedPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PurchaseAttachment = {
  id: string;
  requestId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
};

export type PurchaseStatusHistory = {
  id: string;
  requestId: string;
  status: PurchaseRequestStatus;
  comments: string | null;
  changedBy: string;
  createdAt: Date;
};
