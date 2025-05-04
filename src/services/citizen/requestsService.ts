
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export interface CitizenRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string; 
  createdAt: string;
  updatedAt?: string;
  userId: string;
  departmentId: string;
  priority?: string;
  dueDate?: string;
  category?: string;
  protocol?: string;
  documents?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  isInternal: boolean;
}

export interface NewRequestData {
  title: string;
  description: string;
  target_department: string;
  priority: string;
}

// Mock data for requests
const MOCK_REQUESTS = [
  {
    id: "1",
    title: "Solicitação de material escolar",
    description: "Necessito de material escolar para meus filhos",
    status: "pending",
    type: "support", 
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    userId: "user-1",
    departmentId: "dept-1",
    priority: "medium",
    protocol: "2025-000123",
    target_department: "Secretaria de Educação"
  },
  {
    id: "2",
    title: "Consulta de agendamento médico",
    description: "Gostaria de verificar minha consulta agendada",
    status: "in_progress",
    type: "health", 
    createdAt: "2025-01-14T10:00:00Z",
    updatedAt: "2025-01-14T15:30:00Z",
    userId: "user-1",
    departmentId: "dept-2",
    priority: "high",
    protocol: "2025-000124",
    target_department: "Secretaria de Saúde"
  },
  {
    id: "3",
    title: "Manutenção de calçada",
    description: "Solicito a manutenção da calçada em frente a minha residência",
    status: "completed",
    type: "infrastructure", 
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-12T16:45:00Z",
    userId: "user-1",
    departmentId: "dept-3",
    priority: "low",
    protocol: "2025-000126",
    target_department: "Secretaria de Infraestrutura"
  }
];

export async function fetchCitizenRequests(userId: string): Promise<CitizenRequest[]> {
  try {
    // For now, we're using mock data - in a real app this would be a real Supabase query
    // const { data, error } = await supabase
    //   .from("citizen_requests")
    //   .select("*")
    //   .eq("userId", userId)
    //   .order("createdAt", { ascending: false });

    // if (error) {
    //   console.error("Error fetching citizen requests:", error);
    //   throw new Error(error.message);
    // }

    // Using mock data for now
    const mockData = MOCK_REQUESTS.filter(req => req.userId === userId);
    return mockData;
  } catch (error) {
    console.error("Error in fetchCitizenRequests:", error);
    throw error;
  }
}

export async function fetchCitizenRequestById(requestId: string): Promise<CitizenRequest> {
  try {
    // For now, we're using mock data - in a real app this would be a real Supabase query
    // const { data, error } = await supabase
    //   .from("citizen_requests")
    //   .select("*")
    //   .eq("id", requestId)
    //   .single();

    // if (error) {
    //   console.error("Error fetching citizen request:", error);
    //   throw new Error(error.message);
    // }

    // Using mock data for now
    const mockData = MOCK_REQUESTS.find(req => req.id === requestId);
    if (!mockData) {
      throw new Error("Request not found");
    }
    return mockData;
  } catch (error) {
    console.error("Error in fetchCitizenRequestById:", error);
    throw error;
  }
}

export async function createCitizenRequest(
  request: NewRequestData,
  userId?: string
): Promise<CitizenRequest> {
  try {
    const protocol = generateProtocol();
    const newRequest = {
      id: uuidv4(),
      title: request.title,
      description: request.description,
      target_department: request.target_department,
      status: "pending",
      type: "support",
      createdAt: new Date().toISOString(),
      userId: userId || "anonymous",
      departmentId: "dept-1", // Default department
      priority: request.priority,
      protocol
    };

    // In a real app, this would be sent to Supabase
    // const { data, error } = await supabase
    //   .from("citizen_requests")
    //   .insert([newRequest])
    //   .select()
    //   .single();

    // if (error) {
    //   console.error("Error creating citizen request:", error);
    //   throw new Error(error.message);
    // }

    toast({
      title: "Solicitação enviada",
      description: `Sua solicitação foi registrada com sucesso. Protocolo: ${protocol}`,
    });

    return newRequest as CitizenRequest;
  } catch (error) {
    console.error("Error in createCitizenRequest:", error);
    throw error;
  }
}

export async function updateCitizenRequest(
  id: string,
  updates: Partial<CitizenRequest>
): Promise<CitizenRequest> {
  try {
    // In a real app, this would update the request in Supabase
    // const { data, error } = await supabase
    //   .from("citizen_requests")
    //   .update({ ...updates, updatedAt: new Date().toISOString() })
    //   .eq("id", id)
    //   .select()
    //   .single();

    // if (error) {
    //   console.error("Error updating citizen request:", error);
    //   throw new Error(error.message);
    // }

    // Mock update for now
    const requestIndex = MOCK_REQUESTS.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      throw new Error("Request not found");
    }

    const updatedRequest = {
      ...MOCK_REQUESTS[requestIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    MOCK_REQUESTS[requestIndex] = updatedRequest;
    return updatedRequest as CitizenRequest;
  } catch (error) {
    console.error("Error in updateCitizenRequest:", error);
    throw error;
  }
}

export async function addCommentToCitizenRequest(
  requestId: string,
  content: string,
  userId?: string
): Promise<boolean> {
  try {
    // In a real app, this would add a comment to the request in Supabase
    const newComment = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      userId: userId || "anonymous",
      userName: "User",
      isInternal: false,
    };

    // Mock adding comment
    const requestIndex = MOCK_REQUESTS.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error("Request not found");
    }

    if (!MOCK_REQUESTS[requestIndex].comments) {
      MOCK_REQUESTS[requestIndex].comments = [];
    }

    MOCK_REQUESTS[requestIndex].comments!.push(newComment);
    MOCK_REQUESTS[requestIndex].updatedAt = new Date().toISOString();

    return true;
  } catch (error) {
    console.error("Error in addCommentToCitizenRequest:", error);
    throw error;
  }
}

// Helper function to generate a protocol number
function generateProtocol(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(6, "0");
  return `${year}-${random}`;
}
