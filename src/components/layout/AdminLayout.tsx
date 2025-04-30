
import React, { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminLayout() {
  const { isLoading, isAuthenticated, userType, user } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [readyForQuery, setReadyForQuery] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("AdminLayout - Auth state:", { 
      isLoading, 
      isAuthenticated, 
      userType, 
      hasUser: !!user 
    });
    
    // Extra safety check - if we're not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log("AdminLayout: Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }
    
    // If we're authenticated but not an admin user, redirect to citizen dashboard
    if (!isLoading && isAuthenticated && userType !== "admin") {
      console.log("AdminLayout: User is not admin, redirecting to citizen dashboard");
      navigate("/citizen/dashboard", { replace: true });
      return;
    }
    
    // Only mark ready for React Query operations when auth is complete
    if (!isLoading && isAuthenticated && userType === "admin") {
      console.log("AdminLayout: User is admin, setting readyForQuery");
      setReadyForQuery(true);
    }
  }, [isLoading, isAuthenticated, userType, navigate, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-primary">Verificando credenciais...</span>
      </div>
    );
  }

  // Show error if we have one
  if (localError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate("/login")}
        >
          Voltar para login
        </button>
      </div>
    );
  }

  // At this point we should be authenticated and an admin user
  if (!isAuthenticated || !user) {
    console.log("AdminLayout: Authentication validation failed, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (userType !== "admin") {
    console.log("AdminLayout: User is not admin, redirecting to citizen dashboard");
    return <Navigate to="/citizen/dashboard" replace />;
  }

  // We're authenticated and an admin, so render the admin layout
  // Only pass readyForQuery to sidebar when we're fully authenticated
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar ready={readyForQuery} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
