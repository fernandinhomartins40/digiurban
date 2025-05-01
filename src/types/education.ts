
export interface School {
  id: string;
  name: string;
  address: string;
  type: 'school' | 'cmei';
  director_name: string | null;
  phone: string | null;
  email: string | null;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  neighborhood: string;
  city: string;
  state: string;
  inep_code: string;
  current_students: number | null;
  director_contact: string | null;
  vice_director_name: string | null;
  vice_director_contact: string | null;
  pedagogical_coordinator: string | null;
  zip_code: string | null;
  shifts: string[];
  // Aliases for backward compatibility
  active: boolean; // maps to is_active
  capacity: number; // maps to max_capacity
}

export interface Student {
  id: string;
  name: string;
  birth_date: string;
  address: string;
  created_at: string;
  updated_at: string;
  // Fields from our database schema
  neighborhood: string;
  city: string;
  state: string;
  zip_code?: string;
  cpf?: string;
  medical_info?: string;
  special_needs?: string;
  is_active?: boolean;
  parent_name: string;
  parent_cpf?: string;
  parent_phone: string;
  parent_email?: string;
  registration_number: string;
  // Aliases for backward compatibility
  guardian_name?: string; // maps to parent_name
  guardian_relationship?: string; // not in DB
  phone?: string; // maps to parent_phone
  enrollment_id?: string; // not in DB
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean; // maps to is_active
  created_at: string;
  updated_at: string;
  // Fields from our database schema
  birth_date: string;
  address: string;
  cpf: string;
  education_level: string;
  specialization?: string;
  specialties?: string[];
  teaching_areas?: string[];
  registration_number: string;
  hiring_date: string;
  is_active?: boolean;
}

export interface Enrollment {
  id: string;
  protocol_number: string;
  student_id: string;
  requested_school_id: string;
  assigned_school_id?: string;
  class_id?: string;
  school_year: number;
  request_date: string;
  decision_date?: string;
  decision_by?: string;
  special_request?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  notes?: string;
  justification?: string;
  // Frontend display properties
  student_name?: string;
  school_name?: string;
  grade?: string;
}

export interface TransportRequest {
  id: string;
  protocol_number: string;
  student_id: string;
  school_id: string;
  requester_id?: string;
  requester_name: string;
  requester_contact: string;
  request_type: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  resolution_notes?: string;
  resolution_date?: string;
  resolved_by?: string;
  pickup_location?: string;
  return_location?: string;
  current_route_id?: string;
  requested_route_id?: string;
  complaint_type?: string;
  // Frontend display properties
  student_name?: string;
  school_name?: string;
  pickup_address?: string; // For backward compatibility
  distance_km?: number; // For backward compatibility
}

export interface SchoolMeal {
  id: string;
  school_id: string;
  school_name: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  nutritional_info: string;
  created_at: string;
  // Fields needed for database operations
  year: number;
  day_of_week?: number;
  menu_items?: any[];
  // Mapping to database fields
  active_from?: string; // maps to date
  active_until?: string;
  shift?: string; // maps to meal_type
  name?: string; // maps to description
}

export interface SchoolIncident {
  id: string;
  school_id: string;
  school_name: string;
  date: string;
  incident_type: 'behavioral' | 'accident' | 'infrastructure' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
  // Fields needed for database operations
  reported_by: string;
  student_id: string; 
  reported_by_name?: string;
  // Mapping to database fields
  occurrence_date?: string; // maps to date
  occurrence_type?: string; // maps to incident_type
  resolution_date?: string;
  resolved_by?: string;
  subject?: string;
  parent_notification_date?: string;
  parent_notified?: boolean;
  resolution?: string;
  class_id?: string;
}
