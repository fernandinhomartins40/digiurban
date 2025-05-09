
import React, { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isAdminUser } from "@/utils/authGuards";

export function AdminLayout() {
  const { isLoading, isAuthenticated, userType, user } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [readyForQuery, setReadyForQuery] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show fallback UI after timeout
  const [showFallback, setShowFallback] = React.useState(false);
  
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setShowFallback(true);
      }, 5000);
    } else {
      setShowFallback(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);
  
  useEffect(() => {
    console.log("AdminLayout - Auth state:", { 
      isLoading, 
      isAuthenticated, 
      userType, 
      hasUser: !!user,
      department: isAdminUser(user) ? user?.department : undefined
    });
    
    // Only take action once loading is complete
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log("AdminLayout: Not authenticated, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }
      
      // If we're authenticated but not an admin user, redirect to citizen dashboard
      if (isAuthenticated && userType !== "admin") {
        console.log("AdminLayout: User is not admin, redirecting to citizen dashboard");
        navigate("/citizen/dashboard", { replace: true });
        return;
      }
      
      // Check if admin has a department set (required for the mail module)
      if (isAuthenticated && userType === "admin" && user && isAdminUser(user) && (!user.department || user.department.trim() === "")) {
        console.log("AdminLayout: Admin user has no department");
        setLocalError("Seu usuário administrativo não possui um departamento configurado. Entre em contato com o suporte.");
        return;
      }
      
      // Only mark ready for React Query operations when auth is complete
      if (isAuthenticated && userType === "admin" && user) {
        console.log("AdminLayout: User is admin, setting readyForQuery");
        setReadyForQuery(true);
      }
      
      // Handle dashboard access for non-mayor users
      if (isAuthenticated && user?.role !== "prefeito") {
        // Check if trying to access mayor-only dashboard routes
        if (location.pathname.includes("/admin/gabinete/dashboard") || 
            location.pathname.includes("/admin/executivo/dashboard")) {
          console.log("Non-mayor user attempting to access dashboard, redirecting");
          // Redirect to a more appropriate page based on their role
          navigate("/admin/gabinete/solicitacoes", { replace: true });
        }
      }
      
      // Redirect from root admin path to dashboard
      if (isAuthenticated && (location.pathname === "/admin" || location.pathname === "/admin/")) {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, userType, navigate, user, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-primary">Verificando credenciais...</span>
        
        {showFallback && (
          <div className="mt-8 max-w-md">
            <p className="text-center text-red-600 mb-4">
              O carregamento está demorando mais do que o esperado.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => navigate("/login", { replace: true })}
              >
                Voltar para login
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={() => window.location.reload()}
              >
                Recarregar página
              </button>
            </div>
          </div>
        )}
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

  // Additional safety check - make sure we have a user with department for mail module
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Verificando credenciais...</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate("/login", { replace: true })}
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  if (userType !== "admin") {
    console.log("AdminLayout: User is not admin, redirecting to citizen dashboard");
    return <Navigate to="/citizen/dashboard" replace />;
  }

  // We're authenticated and an admin, so render the admin layout
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
