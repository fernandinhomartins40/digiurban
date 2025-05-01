
import { User } from "@/types/auth";

/**
 * Permission checking utilities
 */
export function createPermissionUtils(user: User | null) {
  const hasPermission = (moduleId: string, action: "create" | "read" | "update" | "delete") => {
    if (!user) return false;
    
    // Prefeito has all permissions
    if (user.role === "prefeito") return true;
    
    // For development purposes, let's enable access to all modules
    // This ensures modules don't disappear from sidebar due to permission issues
    // TODO: Remove this in production and implement proper permission checks
    if (process.env.NODE_ENV === 'development') return true;
    
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
