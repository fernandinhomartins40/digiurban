
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function AdminLayout() {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const navigate = useNavigate();
  
  // Protection for admin routes
  useEffect(() => {
    console.log("Admin layout auth check:", { isAuthenticated, isLoading, userType });
    
    // Only redirect after loading completes
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate("/login");
      } else if (userType !== "admin") {
        // Not an admin, redirect to appropriate area
        toast({
          title: "Acesso restrito",
          description: "Esta área é restrita para administradores.",
          variant: "destructive",
        });
        navigate("/citizen/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, userType, navigate]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only show layout if authenticated as admin
  return isAuthenticated && userType === "admin" ? (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar ready={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  ) : null; // Render nothing while redirecting
}
