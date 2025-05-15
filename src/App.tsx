
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appRoutes } from './routes';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

// Configure React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Root redirect to auth/login for now */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          
          {/* Render all application routes */}
          {appRoutes.map((route, index) => {
            const { path, element, children } = route;
            
            // Log route for debugging
            console.log(`Registering route: ${path}`);
            
            return (
              <Route key={index} path={path} element={element}>
                {children?.map((childRoute, childIndex) => (
                  <Route
                    key={`${index}-${childIndex}`}
                    path={childRoute.path}
                    element={childRoute.element}
                    index={childRoute.index}
                  />
                ))}
              </Route>
            );
          })}
        </Routes>
        
        {/* Global Toaster for notifications */}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
