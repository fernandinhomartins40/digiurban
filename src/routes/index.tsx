
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { citizenRoutes } from "./citizenRoutes";
import LandingPage from "@/pages/Landing";

// Components
const NotFound = lazy(() => import("@/pages/NotFound"));

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
  {
    path: "*",
    element: <NotFound />,
  },
];
