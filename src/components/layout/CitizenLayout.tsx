
import React, { useEffect } from "react";
import { CitizenNavbar } from "./CitizenNavbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ChatProvider } from "@/contexts/ChatContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CitizenSidebar } from "./CitizenSidebar";

export function CitizenLayout() {
  const { isLoading, isAuthenticated, userType, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CitizenLayout - Auth state:", { 
      isLoading, 
      isAuthenticated, 
      userType,
      user
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
  }, [isLoading, isAuthenticated, userType, navigate, user]);

  // Show loading indicator for a maximum of 5 seconds
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Carregando informações do usuário...</p>
        
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

  // Additional safety check - make sure we actually have a user object
  if (!isAuthenticated || userType !== "citizen" || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Verificando credenciais...</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
            onClick={() => navigate("/login", { replace: true })}
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-col h-screen bg-gray-50 w-full">
          <CitizenNavbar />
          <div className="flex flex-1 overflow-hidden">
            <CitizenSidebar />
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
