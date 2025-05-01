
// Re-export all education services
import * as schoolsService from "./schools";
import * as enrollmentsService from "./enrollments";
import * as transportService from "./transport";
import * as peopleService from "./people";
import * as mealsService from "./meals";
import * as incidentsService from "./incidents";

// Schools
export const {
  fetchSchools,
  fetchSchoolById,
  createSchool,
  updateSchool,
  deleteSchool
} = schoolsService;

// Enrollments
export const {
  fetchEnrollments,
  fetchEnrollmentById,
  createEnrollment,
  updateEnrollmentStatus
} = enrollmentsService;

// Transport
export const {
  fetchTransportRequests,
  fetchTransportRequestById,
  createTransportRequest,
  updateTransportRequestStatus
} = transportService;

// People (Students & Teachers)
export const {
  fetchStudents,
  fetchStudentById,
  createStudent,
  updateStudent,
  fetchTeachers,
  fetchTeacherById,
  createTeacher,
  updateTeacher
} = peopleService;

// Meals
export const {
  fetchSchoolMeals,
  fetchMealById,
  createMealMenu,
  updateMealMenu
} = mealsService;

// Incidents
export const {
  fetchIncidents,
  fetchIncidentById,
  createIncident,
  updateIncident,
  updateIncidentStatus
} = incidentsService;
