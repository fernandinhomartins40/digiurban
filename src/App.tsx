
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appRoutes } from './routes';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              {/* Root redirect to login for now */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
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
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
