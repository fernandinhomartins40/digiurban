
import { supabase } from "@/integrations/supabase/client";
import { PolicyStatus, GoalStatus, PublicPolicy } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Public Policies
export async function getPublicPolicies(status?: PolicyStatus): Promise<PublicPolicy[]> {
  try {
    let query = supabase
      .from("public_policies")
      .select(
        `*, 
        public_policy_goals(*)`
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((policy) => ({
      id: policy.id,
      title: policy.title,
      description: policy.description,
      startDate: new Date(policy.start_date),
      endDate: policy.end_date ? new Date(policy.end_date) : undefined,
      status: policy.status as PolicyStatus,
      responsibleId: policy.responsible_id,
      responsibleName: policy.responsible_id, // This field doesn't exist in the DB, using responsible_id as fallback
      department: policy.department,
      createdBy: policy.created_by,
      createdAt: new Date(policy.created_at),
      updatedAt: new Date(policy.updated_at),
      goals: policy.public_policy_goals?.map((goal: any) => ({
        id: goal.id,
        policyId: goal.policy_id,
        title: goal.title,
        description: goal.description,
        targetValue: goal.target_value,
        targetUnit: goal.target_unit,
        currentValue: goal.current_value,
        dueDate: goal.due_date ? new Date(goal.due_date) : undefined,
        status: goal.status as GoalStatus,
        createdAt: new Date(goal.created_at),
        updatedAt: new Date(goal.updated_at),
      })) || [],
    }));
  } catch (error: any) {
    console.error("Error fetching public policies:", error.message);
    toast({
      title: "Erro ao carregar políticas públicas",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
