
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { citizenRoutes } from "./citizenRoutes";
import LandingPage from "@/pages/Landing";

// Import NotFound directly instead of lazy loading
import NotFound from "@/pages/NotFound";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
    index: true,
  },
  {
    path: "admin/*",
    children: adminRoutes,
  },
  {
    path: "auth/*",
    children: authRoutes,
  },
  {
    path: "citizen/*",
    children: citizenRoutes,
  },
  // Adiciona uma rota específica para /login que redireciona para /auth/login
  {
    path: "login",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
