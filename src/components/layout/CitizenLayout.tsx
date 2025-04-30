
import React, { useEffect } from "react";
import { CitizenNavbar } from "./CitizenNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function CitizenLayout() {
  const { isLoading, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CitizenLayout - Auth state:", { 
      isLoading, 
      isAuthenticated, 
      userType 
    });
    
    // Only redirect after loading is complete
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log("CitizenLayout: Not authenticated, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }
      
      // If authenticated but not a citizen, redirect to appropriate dashboard
      if (isAuthenticated && userType !== "citizen") {
        console.log("CitizenLayout: User is not citizen, redirecting to admin dashboard");
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }
  }, [isLoading, isAuthenticated, userType, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Carregando informações do usuário...</p>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!isAuthenticated || userType !== "citizen") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CitizenNavbar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
