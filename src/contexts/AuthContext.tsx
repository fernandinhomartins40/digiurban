
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: "admin" | "citizen" | null;
  login: (email: string, password: string, userType: "admin" | "citizen") => Promise<void>;
  register: (userData: any, userType: "admin" | "citizen") => Promise<void>;
  logout: () => void;
  hasPermission: (moduleId: string, action: "create" | "read" | "update" | "delete") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"admin" | "citizen" | null>(null);

  useEffect(() => {
    // Check for stored session on mount
    const checkSession = async () => {
      try {
        // This is a placeholder for actual authentication logic
        // In a real implementation, we would verify the token with the backend
        const storedUser = localStorage.getItem("digiUrbis_user");
        const storedUserType = localStorage.getItem("digiUrbis_userType");
        
        if (storedUser && storedUserType) {
          setUser(JSON.parse(storedUser));
          setUserType(storedUserType as "admin" | "citizen");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, userType: "admin" | "citizen") => {
    setIsLoading(true);
    try {
      // This is a placeholder for actual login logic
      // In a real implementation, we would call an API endpoint to authenticate
      
      // Mock login for demo purposes
      let mockUser: User;
      
      if (userType === "admin") {
        // Mock admin user
        mockUser = {
          id: "admin-123",
          email: email,
          name: "Admin User",
          role: email.includes("prefeito") ? "prefeito" : "admin",
          department: "Gabinete",
          position: email.includes("prefeito") ? "Prefeito" : "Servidor",
          permissions: [
            { moduleId: "all", create: true, read: true, update: true, delete: true }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        // Mock citizen user
        mockUser = {
          id: "citizen-123",
          email: email,
          name: "Citizen User",
          cpf: "123.456.789-00",
          role: "citizen",
          address: {
            street: "Rua Principal",
            number: "123",
            neighborhood: "Centro",
            city: "Município",
            state: "Estado",
            zipCode: "12345-678"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      setUser(mockUser);
      setUserType(userType);
      
      // Store user info in localStorage
      localStorage.setItem("digiUrbis_user", JSON.stringify(mockUser));
      localStorage.setItem("digiUrbis_userType", userType);
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, userType: "admin" | "citizen") => {
    setIsLoading(true);
    try {
      // This is a placeholder for actual registration logic
      // In a real implementation, we would call an API endpoint to register the user
      
      // For now, we'll just simulate a successful registration and login
      await login(userData.email, userData.password, userType);
      
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("digiUrbis_user");
    localStorage.removeItem("digiUrbis_userType");
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
    isLoading,
    isAuthenticated: !!user,
    userType,
    login,
    register,
    logout,
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
