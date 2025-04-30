
import { AdminUser, CitizenUser, User } from "@/types/auth";

/**
 * Type guard to check if a user is an AdminUser
 * @param user The user to check
 * @returns Boolean indicating if the user is an AdminUser
 */
export function isAdminUser(user: User | null): user is AdminUser {
  return user?.role === "admin" || user?.role === "prefeito";
}

/**
 * Type guard to check if a user is a CitizenUser
 * @param user The user to check
 * @returns Boolean indicating if the user is a CitizenUser
 */
export function isCitizenUser(user: User | null): user is CitizenUser {
  return user?.role === "citizen";
}
