
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider as SupabaseAuthProvider } from "@/contexts/auth/AuthProvider"; 
import { AuthProvider as AppAuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 
import { createOptimizedQueryClient } from "@/lib/api/queryClient";
import { SecurityProvider } from "@/components/providers/SecurityProvider";

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
        <SecurityProvider>
          <SupabaseAuthProvider>
            <AppAuthProvider>
              <ChatProvider>
                {children}
                <Toaster />
                <NewChatPanel />
              </ChatProvider>
            </AppAuthProvider>
          </SupabaseAuthProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
