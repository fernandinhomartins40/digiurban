
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 

// Create a new QueryClient instance
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

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
