
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 
import { toast } from "@/hooks/use-toast";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a new QueryClient instance outside the component
// This ensures it's not recreated on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Using current best practices for React Query configuration
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
  // Global error handler for all queries
  queryCache: {
    onError: (error) => {
      console.error("Query error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados",
        variant: "destructive",
      });
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
        <AuthProvider>
          <ChatProvider>
            {children}
            <Toaster />
            <NewChatPanel />
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
