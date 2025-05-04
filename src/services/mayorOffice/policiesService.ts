
import { supabase } from "@/integrations/supabase/client";
import { PolicyStatus, GoalStatus, PublicPolicy, Policy } from "@/types/mayorOffice";
import { toast } from "@/hooks/use-toast";

// Public Policies
export async function getPublicPolicies(status?: PolicyStatus): Promise<Policy[]> {
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

    return (data || []).map((policy) => {
      const publicPolicy: PublicPolicy = {
        id: policy.id,
        title: policy.title,
        description: policy.description,
        startDate: new Date(policy.start_date),
        endDate: policy.end_date ? new Date(policy.end_date) : undefined,
        status: policy.status as PolicyStatus,
        responsibleId: policy.responsible_id,
        // Use responsible_id if responsible_name is missing
        responsibleName: policy.responsible_id, 
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
      };

      // Calculate progress based on completed goals
      const totalGoals = publicPolicy.goals.length;
      const completedGoals = publicPolicy.goals.filter(g => g.status === 'completed').length;
      const progress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      // Map PublicPolicy to Policy interface needed by components
      return {
        id: publicPolicy.id,
        name: publicPolicy.title, // Map title to name
        description: publicPolicy.description,
        category: publicPolicy.department, // Map department to category
        status: publicPolicy.status,
        startDate: publicPolicy.startDate.toISOString(),
        endDate: publicPolicy.endDate?.toISOString(),
        responsible: publicPolicy.responsibleName,
        progress: progress,
        updatedAt: publicPolicy.updatedAt.toISOString(),
        // For optional fields that may not exist in the database, provide defaults
        code: undefined, // These fields may not exist in the database yet
        targetGoal: undefined,
        key_objectives: [],
      };
    });
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
