
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 
import { appRoutes } from "./routes";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// AppRoutes component to use the useRoutes hook
const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

function App() {
  return (
    // Wrap the entire app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
          <AuthProvider>
            <ChatProvider>
              <AppRoutes />
              <Toaster />
              <NewChatPanel />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
