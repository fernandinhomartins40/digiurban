
import { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { citizenRoutes } from "./citizenRoutes";

// Combine all routes
export const appRoutes: RouteObject[] = [
  // Root redirect
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  
  // Auth routes (login, register, etc.)
  ...authRoutes,
  
  // Admin routes
  ...adminRoutes,
  
  // Citizen routes
  ...citizenRoutes,
  
  // Catch-all route for 404
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
];
