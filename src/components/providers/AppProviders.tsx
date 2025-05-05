
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 
import { createOptimizedQueryClient } from "@/lib/api/queryClient";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a new QueryClient instance outside the component
// This ensures it's not recreated on every render
const queryClient = createOptimizedQueryClient();

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
