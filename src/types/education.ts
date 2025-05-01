
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
  guardian_name: string;
  guardian_relationship: string;
  phone: string;
  address: string;
  enrollment_id?: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  specialization: string;
  education_level: string;
  phone: string;
  email: string;
  active: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  protocol_number: string;
  student_id: string;
  student_name: string;
  school_id: string;
  school_name: string;
  grade: string;
  school_year: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
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
}
