
export interface School {
  id: string;
  name: string;
  address: string;
  type: 'school' | 'cmei';
  director_name: string;
  phone: string;
  email: string;
  capacity: number;
  active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  birth_date: string;
  address: string;
  created_at: string;
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
  // Fields for mapping to our original interface
  guardian_name?: string;
  guardian_relationship?: string;
  phone?: string;
  enrollment_id?: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  created_at: string;
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
  student_name: string;
  school_id: string;
  school_name: string;
  pickup_address: string;
  distance_km: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
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
  // Fields needed for database operations
  reported_by: string;
  student_id: string; 
  reported_by_name?: string;
}
