
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ChatPanel } from "@/components/chat/ChatPanel";

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

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredUserType,
}: { 
  children: JSX.Element,
  requiredUserType: "admin" | "citizen" | "any",
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType === "any" || userType === requiredUserType) {
    return children;
  }
  
  return <Navigate to={`/${userType}/dashboard`} replace />;
};

// Auth route component (redirects if already logged in)
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (isAuthenticated && userType) {
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }
  
  return children;
};

function AppWithProviders() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/admin-register" element={<AuthRoute><AdminRegister /></AuthRoute>} />
        <Route path="/esqueci-senha" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredUserType="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          {/* Add more admin routes here as needed */}
        </Route>

        {/* Citizen Routes */}
        <Route path="/citizen" element={<ProtectedRoute requiredUserType="citizen"><CitizenLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CitizenDashboard />} />
          {/* Add more citizen routes here as needed */}
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Show chat panel only when authenticated */}
      {isAuthenticated && <ChatPanel />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
        <AuthProvider>
          <AppWithProviders />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
