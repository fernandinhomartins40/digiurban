
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; // Ensure this import is correct
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; // Updated import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminRegister from "@/pages/auth/AdminRegister";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CitizenLayout } from "@/components/layout/CitizenLayout";

import AdminDashboard from "@/pages/admin/Dashboard";
import CitizenDashboard from "@/pages/citizen/Dashboard";
import UserManagement from "@/pages/admin/users/UserManagement";

// Correio Interno (Internal Mail) Module
import MailDashboard from "@/pages/admin/correio/MailDashboard";
import OficioDigital from "@/pages/admin/correio/OficioDigital";
import TemplateCreator from "@/pages/admin/correio/TemplateCreator";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    // Wrap the entire app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                
                {/* Correio Interno Routes */}
                <Route path="correio/dashboard" element={<MailDashboard />} />
                <Route path="correio/oficio-digital" element={<OficioDigital />} />
                <Route path="correio/criador-oficios" element={<TemplateCreator />} />
              </Route>

              {/* Citizen Routes */}
              <Route path="/citizen" element={<CitizenLayout />}>
                <Route path="dashboard" element={<CitizenDashboard />} />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster />
            <NewChatPanel />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
