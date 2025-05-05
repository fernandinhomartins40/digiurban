
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
    mutations: {
      onError: (error) => {
        console.error("Mutation error:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar sua solicitação",
          variant: "destructive",
        });
      },
    }
  },
});

// Add a global error handler for all queries
const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'error' && event.error instanceof Error) {
    console.error("Query error:", event.error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao carregar os dados",
      variant: "destructive",
    });
  }
});

// Note: In a real application, you might want to clean up this subscription
// This could be done in a useEffect if AppProviders was a functional component

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
