
import { Database } from "@/integrations/supabase/types";

export type DocumentStatus = Database["public"]["Enums"]["mail_document_status"];

export interface DocumentType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  protocol_number: string;
  document_type_id: string;
  document_type?: DocumentType;
  creator_id: string;
  department: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
  template_id: string | null;
  header?: string | null;
  footer?: string | null;
  document_category?: string;
}

export interface DocumentDestination {
  id: string;
  document_id: string;
  document?: Document;
  from_department: string;
  to_department: string;
  sent_by: string;
  sent_at: string;
  received_at: string | null;
  read_at: string | null;
  response_text: string | null;
  status: DocumentStatus;
}

export interface DocumentAttachment {
  id: string;
  document_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  content: string;
  header?: string | null;
  footer?: string | null;
  document_type_id: string | null;
  document_type?: DocumentType;
  creator_id: string;
  departments: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  fields?: TemplateField[];
}

// Making field_key and field_label and field_type required but handle compatibility with React Hook Form
export interface TemplateField {
  id?: string;
  template_id?: string;
  field_key: string;
  field_label: string;
  field_type: string;
  field_options?: any | null;
  is_required: boolean;
  order_position?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentFilters {
  type?: string;
  department?: string;
  status?: DocumentStatus;
  dateRange?: { from: Date; to: Date };
  search?: string;
}
