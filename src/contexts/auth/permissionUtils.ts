
import { User } from "@/types/auth";

/**
 * Permission checking utilities
 */
export function createPermissionUtils(user: User | null) {
  const hasPermission = (moduleId: string, action: "create" | "read" | "update" | "delete") => {
    if (!user || user.role === "citizen") return false;
    
    // Prefeito has all permissions
    if (user.role === "prefeito") return true;
    
    // Check specific permissions
    return user.permissions.some(
      (permission) => 
        (permission.moduleId === "all" || permission.moduleId === moduleId) && 
        permission[action]
    );
  };

  return {
    hasPermission,
  };
}
