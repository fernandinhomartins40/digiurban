
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: "admin" | "citizen" | null;
  login: (email: string, password: string, userType: "admin" | "citizen") => Promise<void>;
  register: (userData: any, userType: "admin" | "citizen") => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserType(null);
      }
    });

    // Check for initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to get admin profile
      const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("*, admin_permissions(*)")
        .eq("id", userId)
        .single();

      if (adminProfile) {
        const permissions = adminProfile.admin_permissions.map((permission: any) => ({
          moduleId: permission.module_id,
          create: permission.create_permission,
          read: permission.read_permission,
          update: permission.update_permission,
          delete: permission.delete_permission,
        }));

        setUser({
          id: adminProfile.id,
          email: adminProfile.email,
          name: adminProfile.name,
          role: adminProfile.role,
          department: adminProfile.department,
          position: adminProfile.position,
          permissions,
          createdAt: adminProfile.created_at,
          updatedAt: adminProfile.updated_at,
        });
        setUserType("admin");
        return;
      }

      // If not admin, try to get citizen profile
      const { data: citizenProfile } = await supabase
        .from("citizen_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (citizenProfile) {
        setUser({
          id: citizenProfile.id,
          email: citizenProfile.email,
          name: citizenProfile.name,
          cpf: citizenProfile.cpf,
          role: "citizen",
          address: {
            street: citizenProfile.street,
            number: citizenProfile.number,
            neighborhood: citizenProfile.neighborhood,
            city: citizenProfile.city,
            state: citizenProfile.state,
            zipCode: citizenProfile.zipcode,
          },
          phone: citizenProfile.phone,
          createdAt: citizenProfile.created_at,
          updatedAt: citizenProfile.updated_at,
        });
        setUserType("citizen");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // User type is checked on backend via profile tables
      return;
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, userType: "admin" | "citizen") => {
    try {
      setIsLoading(true);
      
      // Add user_type to metadata
      const metadata = {
        ...userData,
        user_type: userType,
      };
      
      // Remove password from metadata
      const { password, confirmPassword, ...userMetadata } = metadata;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userMetadata,
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
      
      return;
    } catch (error: any) {
      console.error("Registration error:", error.message);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível completar o cadastro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Reset password error:", error.message);
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Não foi possível enviar o email de recuperação",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso",
      });
    } catch (error: any) {
      console.error("Update password error:", error.message);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Não foi possível atualizar sua senha",
        variant: "destructive",
      });
      throw error;
    }
  };

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

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    userType,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
