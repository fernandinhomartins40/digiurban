
import { AdminUser, CitizenUser, User } from "@/types/auth";

/**
 * Type guard to check if a user is an AdminUser
 * @param user The user to check
 * @returns Boolean indicating if the user is an AdminUser
 */
export function isAdminUser(user: User | null): user is AdminUser {
  if (!user) return false;
  return user.role === "admin" || user.role === "prefeito";
}

/**
 * Type guard to check if a user is a CitizenUser
 * @param user The user to check
 * @returns Boolean indicating if the user is a CitizenUser
 */
export function isCitizenUser(user: User | null): user is CitizenUser {
  if (!user) return false;
  return user.role === "citizen";
}

/**
 * Helper function to determine user type from role
 * @param role The user role
 * @returns The user type or null if role is invalid
 */
export function getUserTypeFromRole(role: string | undefined): "admin" | "citizen" | null {
  if (!role) return null;
  if (role === "admin" || role === "prefeito") return "admin";
  if (role === "citizen") return "citizen";
  return null;
}

/**
 * Safe wrapper for localStorage access with proper error handling
 */
export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },
  
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting localStorage item:", error);
      // You could implement a fallback storage mechanism here
      // For example, using an in-memory store or session cookies
    }
  },
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  }
};

/**
 * Helper to determine if browser supports localStorage
 */
export function supportsLocalStorage(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    const supports = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return supports;
  } catch (e) {
    return false;
  }
}
