// Education Module Types

// School Types
export type SchoolType = 'school' | 'cmei' | 'eja';

export interface School {
  id: string;
  name: string;
  inepCode: string;
  type: SchoolType;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  directorName?: string;
  directorContact?: string;
  viceDirectorName?: string;
  viceDirectorContact?: string;
  pedagogicalCoordinator?: string;
  maxCapacity: number;
  currentStudents: number;
  shifts: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Class Types
export type ClassShift = 'morning' | 'afternoon' | 'evening' | 'full';

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  shift: ClassShift;
  year: number;
  maxStudents: number;
  currentStudents: number;
  classroom?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Student Types
export interface Student {
  id: string;
  name: string;
  cpf?: string;
  birthDate: string;
  registrationNumber: string;
  parentId?: string;
  parentName: string;
  parentCpf?: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  specialNeeds?: string;
  medicalInfo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Teacher Types
export interface Teacher {
  id: string;
  name: string;
  cpf: string;
  registrationNumber: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  educationLevel: string;
  specialties?: string[];
  teachingAreas: string[];
  hiringDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSchool {
  id: string;
  teacherId: string;
  schoolId: string;
  workload: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TeacherClass {
  id: string;
  teacherId: string;
  classId: string;
  subject: string;
  weeklyHours: number;
  isActive: boolean;
  createdAt: string;
}

// Enrollment Types
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'waitlist' | 'transferred' | 'cancelled';

export interface Enrollment {
  id: string;
  protocolNumber: string;
  studentId: string;
  classId?: string;
  requestedSchoolId: string;
  assignedSchoolId?: string;
  schoolYear: number;
  status: EnrollmentStatus;
  requestDate: string;
  decisionDate?: string;
  decisionBy?: string;
  justification?: string;
  specialRequest?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Transport Types
export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  model: string;
  capacity: number;
  year: number;
  isAccessible: boolean;
  driverName: string;
  driverContact: string;
  driverLicense: string;
  monitorName?: string;
  monitorContact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  vehicleId: string;
  origin: string;
  destination: string;
  schoolIds: string[];
  departureTime: string;
  returnTime: string;
  distance?: number;
  averageDuration?: number;
  maxCapacity: number;
  currentStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransportStatus = 'active' | 'inactive' | 'pending' | 'cancelled';

export interface StudentTransport {
  id: string;
  studentId: string;
  routeId: string;
  pickupLocation: string;
  returnLocation: string;
  schoolId: string;
  startDate: string;
  endDate?: string;
  status: TransportStatus;
  createdAt: string;
  updatedAt: string;
  studentInfo?: {
    id: string;
    name: string;
    registrationNumber: string;
  };
  schoolInfo?: {
    id: string;
    name: string;
    type: string;
  };
}

export type TransportRequestType = 'new' | 'change' | 'complaint' | 'cancellation';
export type TransportRequestStatus = 'pending' | 'in_analysis' | 'approved' | 'rejected' | 'resolved';

export interface TransportRequest {
  id: string;
  protocolNumber: string;
  requestType: TransportRequestType;
  studentId?: string;
  requesterId?: string;
  requesterName: string;
  requesterContact: string;
  schoolId?: string;
  currentRouteId?: string;
  requestedRouteId?: string;
  pickupLocation?: string;
  returnLocation?: string;
  complaintType?: string;
  description: string;
  status: TransportRequestStatus;
  resolvedBy?: string;
  resolutionDate?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Meal Types
export type MealShift = 'morning' | 'afternoon' | 'evening' | 'all';

export interface MealMenu {
  id: string;
  schoolId: string;
  name: string;
  shift: MealShift;
  dayOfWeek: number;
  menuItems: string[];
  nutritionalInfo?: string;
  isSpecialDiet: boolean;
  forDietaryRestrictions?: string[];
  weekNumber?: number;
  month?: number;
  year: number;
  activeFrom: string;
  activeUntil?: string;
  createdBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialDiet {
  id: string;
  studentId: string;
  schoolId: string;
  dietType: string;
  restrictions: string[];
  medicalDocumentation: boolean;
  notes?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MealRating = 'satisfactory' | 'insufficient' | 'problems';

export interface MealFeedback {
  id: string;
  schoolId: string;
  mealMenuId?: string;
  parentId?: string;
  parentName: string;
  studentName: string;
  classId?: string;
  rating: MealRating;
  comments?: string;
  feedbackDate: string;
  createdAt: string;
}

// Occurrence Types
export type OccurrenceType = 'discipline' | 'health' | 'performance' | 'absence' | 'achievement' | 'other';
export type OccurrenceSeverity = 'low' | 'medium' | 'high';

export interface Occurrence {
  id: string;
  studentId: string;
  schoolId: string;
  classId?: string;
  occurrenceType: OccurrenceType;
  subject?: string;
  description: string;
  severity?: OccurrenceSeverity;
  reportedBy: string;
  reportedByName: string;
  occurrenceDate: string;
  resolution?: string;
  resolvedBy?: string;
  resolutionDate?: string;
  parentNotified: boolean;
  parentNotificationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OccurrenceAttachment {
  id: string;
  occurrenceId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Grade Types
export type GradePeriod = 'first' | 'second' | 'third' | 'fourth' | 'final';

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  teacherId?: string;
  period: GradePeriod;
  grade?: number;
  attendanceDays?: number;
  absenceDays: number;
  comments?: string;
  schoolYear: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Request params and responses
export interface SchoolsRequestParams {
  page?: number;
  pageSize?: number;
  type?: SchoolType;
  name?: string;
  neighborhood?: string;
  isActive?: boolean;
}

export interface StudentsRequestParams {
  page?: number;
  pageSize?: number;
  name?: string;
  registrationNumber?: string;
  classId?: string;
  schoolId?: string;
  isActive?: boolean;
}

export interface EnrollmentsRequestParams {
  page?: number;
  pageSize?: number;
  schoolId?: string;
  studentId?: string;
  status?: EnrollmentStatus;
  schoolYear?: number;
}

export interface TeachersRequestParams {
  page?: number;
  pageSize?: number;
  name?: string;
  schoolId?: string;
  subject?: string;
  isActive?: boolean;
}

export interface OccurrencesRequestParams {
  page?: number;
  pageSize?: number;
  studentId?: string;
  schoolId?: string;
  classId?: string;
  occurrenceType?: OccurrenceType;
  startDate?: string;
  endDate?: string;
}

export interface TransportRoutesRequestParams {
  page?: number;
  pageSize?: number;
  name?: string;
  schoolId?: string;
  origin?: string;
  destination?: string;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}
