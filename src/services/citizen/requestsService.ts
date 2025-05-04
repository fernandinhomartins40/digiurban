
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

export async function fetchCitizenRequests(userId: string): Promise<CitizenRequest[]> {
  try {
    const { data, error } = await supabase
      .from("citizen_requests")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching citizen requests:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchCitizenRequests:", error);
    throw error;
  }
}

export async function fetchCitizenRequestById(requestId: string): Promise<CitizenRequest> {
  try {
    const { data, error } = await supabase
      .from("citizen_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) {
      console.error("Error fetching citizen request:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in fetchCitizenRequestById:", error);
    throw error;
  }
}

export async function createCitizenRequest(
  request: Omit<CitizenRequest, "id" | "createdAt" | "status" | "protocol">
): Promise<CitizenRequest> {
  try {
    const protocol = generateProtocol();
    const newRequest = {
      ...request,
      id: uuidv4(),
      status: "pending",
      protocol,
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("citizen_requests")
      .insert([newRequest])
      .select()
      .single();

    if (error) {
      console.error("Error creating citizen request:", error);
      throw new Error(error.message);
    }

    toast({
      title: "Solicitação enviada",
      description: `Sua solicitação foi registrada com sucesso. Protocolo: ${protocol}`,
    });

    return data;
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
    const { data, error } = await supabase
      .from("citizen_requests")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating citizen request:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in updateCitizenRequest:", error);
    throw error;
  }
}

export async function addCommentToCitizenRequest(
  requestId: string,
  comment: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  try {
    // In a real app, you would add this to a comments table related to the request
    const newComment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    // For this example, we'll update the request's comments array
    const { data: request } = await supabase
      .from("citizen_requests")
      .select("comments")
      .eq("id", requestId)
      .single();

    const currentComments = request?.comments || [];
    
    const { data, error } = await supabase
      .from("citizen_requests")
      .update({
        comments: [...currentComments, newComment],
        updatedAt: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select("comments")
      .single();

    if (error) {
      console.error("Error adding comment to citizen request:", error);
      throw new Error(error.message);
    }

    return newComment;
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
