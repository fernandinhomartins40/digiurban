
import { supabase } from "@/integrations/supabase/client";

// Audit log for mayor's office actions
export async function logMayorAction(
  entityType: string,
  entityId: string,
  actionType: string,
  actionDetails: any,
  userId: string
): Promise<void> {
  try {
    await supabase.from("mayor_office_audit_log").insert({
      entity_type: entityType,
      entity_id: entityId,
      action_type: actionType,
      action_details: actionDetails,
      performed_by: userId,
    });
  } catch (error: any) {
    console.error("Error logging action:", error.message);
  }
}
