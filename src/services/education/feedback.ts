
import { MealFeedback, PaginatedResponse } from "@/types/education";

// Temporary mock data
const mockFeedbacks: MealFeedback[] = [
  {
    id: "fb1",
    schoolId: "school1",
    mealMenuId: "menu1",
    parentName: "João Silva",
    studentName: "Maria Silva",
    classId: "class1",
    rating: "satisfactory",
    comments: "A comida estava boa e bem servida.",
    feedbackDate: "2024-05-01T10:30:00Z",
    createdAt: "2024-05-01T10:30:00Z"
  },
  {
    id: "fb2",
    schoolId: "school2",
    parentName: "Ana Oliveira",
    studentName: "Pedro Oliveira",
    classId: "class2",
    rating: "insufficient",
    comments: "Meu filho reclamou que a comida estava fria.",
    feedbackDate: "2024-05-02T12:15:00Z",
    createdAt: "2024-05-02T12:15:00Z"
  },
  {
    id: "fb3",
    schoolId: "school1",
    mealMenuId: "menu2",
    parentName: "Carlos Santos",
    studentName: "Julia Santos",
    classId: "class3",
    rating: "problems",
    comments: "Minha filha é alérgica a amendoim e havia traços no prato servido hoje.",
    feedbackDate: "2024-05-03T11:45:00Z",
    createdAt: "2024-05-03T11:45:00Z"
  }
];

interface FeedbackParams {
  page?: number;
  pageSize?: number;
  search?: string;
  schoolId?: string;
  rating?: string;
}

export const getFeedbacks = async (params: FeedbackParams = {}): Promise<PaginatedResponse<MealFeedback>> => {
  const { page = 1, pageSize = 10, search = '', schoolId, rating } = params;
  
  // Filter the feedbacks
  let filteredFeedbacks = [...mockFeedbacks];
  
  if (search) {
    filteredFeedbacks = filteredFeedbacks.filter(
      feedback => feedback.parentName.toLowerCase().includes(search.toLowerCase()) ||
                feedback.studentName.toLowerCase().includes(search.toLowerCase()) ||
                feedback.comments?.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (schoolId) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.schoolId === schoolId);
  }
  
  if (rating) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.rating === rating);
  }
  
  // Calculate pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedFeedbacks = filteredFeedbacks.slice(start, end);
  
  return {
    data: paginatedFeedbacks,
    count: filteredFeedbacks.length,
    page,
    pageSize
  };
};

export const getFeedbackById = async (feedbackId: string): Promise<MealFeedback | null> => {
  const feedback = mockFeedbacks.find(fb => fb.id === feedbackId);
  return feedback || null;
};

export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  const feedbackIndex = mockFeedbacks.findIndex(fb => fb.id === feedbackId);
  
  if (feedbackIndex === -1) {
    throw new Error("Feedback not found");
  }
  
  mockFeedbacks.splice(feedbackIndex, 1);
};
