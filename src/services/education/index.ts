
// Re-export all education service functions for easier importing
export * from './schools';
export * from './classes';
export * from './students';
export * from './teachers';
export * from './enrollment';
export * from './transport';
export * from './meals';
export * from './occurrences';
export * from './grades';
export * from './diets';
export * from './feedback';
export * from './menus';

// Re-export types from types/education that are used in education services
import { 
  School,
  Class,
  Student,
  Teacher,
  TeacherSchool,
  TeacherClass,
  Enrollment,
  Vehicle,
  TransportRoute,
  StudentTransport,
  TransportRequest,
  MealMenu,
  SpecialDiet,
  MealFeedback,
  Occurrence,
  OccurrenceAttachment,
  Grade,
} from "@/types/education";

export type { 
  School,
  Class,
  Student,
  Teacher,
  TeacherSchool,
  TeacherClass,
  Enrollment,
  Vehicle,
  TransportRoute,
  StudentTransport,
  TransportRequest,
  MealMenu,
  SpecialDiet,
  MealFeedback,
  Occurrence,
  OccurrenceAttachment,
  Grade,
};
