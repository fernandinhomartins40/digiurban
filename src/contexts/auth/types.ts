
import { User } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: "admin" | "citizen" | null;
  session: Session | null; // Make sure session is included here
  login: (email: string, password: string, userType: "admin" | "citizen") => Promise<void>;
  register: (userData: any, userType: "admin" | "citizen") => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => boolean;
}
