
// Re-export all education service functions for easier importing
export * from './schools';
export * from './classes';
export * from './students';
export * from './teachers';
export * from './enrollment';
export * from './transport';

// Export from meals without the conflicting exports that are now in diets
import * as MealsExports from './meals';
export const {
  createMealMenu,
  getMealMenus,
  getMealMenuById,
  updateMealMenu,
  // deleteMealMenu is not defined in meals.ts, so we're removing it
} = MealsExports;

// Explicitly export from other modules
export * from './occurrences';
export * from './grades';
export * from './diets'; // Contains special diet functions
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
