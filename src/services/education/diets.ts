
import { SpecialDiet } from "@/types/education";

// Temporary mock data
const mockDiets: SpecialDiet[] = [
  {
    id: "diet1",
    studentId: "student1",
    schoolId: "school1",
    dietType: "Sem Glúten",
    restrictions: ["Glúten", "Trigo"],
    medicalDocumentation: true,
    notes: "Celíaco diagnosticado",
    startDate: "2024-01-15T00:00:00Z",
    isActive: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "diet2",
    studentId: "student2",
    schoolId: "school2",
    dietType: "Sem Lactose",
    restrictions: ["Leite", "Derivados de leite"],
    medicalDocumentation: true,
    notes: "Intolerância à lactose",
    startDate: "2024-02-01T00:00:00Z",
    isActive: true,
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z"
  }
];

export const getSpecialDiets = async (studentId?: string): Promise<SpecialDiet[]> => {
  if (studentId) {
    return mockDiets.filter(diet => diet.studentId === studentId);
  }
  return mockDiets;
};

export const getSpecialDietById = async (dietId: string): Promise<SpecialDiet | null> => {
  const diet = mockDiets.find(d => d.id === dietId);
  return diet || null;
};

export const createSpecialDiet = async (dietData: Partial<SpecialDiet>): Promise<SpecialDiet> => {
  const newDiet: SpecialDiet = {
    id: `diet${Date.now()}`,
    studentId: dietData.studentId || "",
    schoolId: dietData.schoolId || "",
    dietType: dietData.dietType || "",
    restrictions: dietData.restrictions || [],
    medicalDocumentation: dietData.medicalDocumentation || false,
    notes: dietData.notes,
    startDate: dietData.startDate || new Date().toISOString(),
    endDate: dietData.endDate,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockDiets.push(newDiet);
  return newDiet;
};

export const updateSpecialDiet = async (id: string, dietData: Partial<SpecialDiet>): Promise<SpecialDiet> => {
  const dietIndex = mockDiets.findIndex(diet => diet.id === id);
  
  if (dietIndex === -1) {
    throw new Error("Diet not found");
  }
  
  const updatedDiet = {
    ...mockDiets[dietIndex],
    ...dietData,
    updatedAt: new Date().toISOString()
  };
  
  mockDiets[dietIndex] = updatedDiet;
  return updatedDiet;
};

export const deleteSpecialDiet = async (id: string): Promise<void> => {
  const dietIndex = mockDiets.findIndex(diet => diet.id === id);
  
  if (dietIndex === -1) {
    throw new Error("Diet not found");
  }
  
  mockDiets.splice(dietIndex, 1);
};
