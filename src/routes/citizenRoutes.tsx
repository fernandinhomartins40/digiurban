
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { CitizenLayout } from "@/components/layout/CitizenLayout";

// Lazy load components
const CitizenDashboard = lazy(() => import("@/pages/citizen/Dashboard"));
const CitizenRequests = lazy(() => import("@/pages/citizen/requests"));
const NewCitizenRequest = lazy(() => import("@/pages/citizen/requests/new"));
const ManageCitizenRequests = lazy(() => import("@/pages/citizen/requests/manage"));
const CitizenProfile = lazy(() => import("@/pages/citizen/Profile"));

export const citizenRoutes: RouteObject[] = [
  {
    path: "",
    element: <CitizenLayout />,
    children: [
      {
        path: "dashboard",
        element: <CitizenDashboard />,
      },
      {
        path: "requests",
        element: <CitizenRequests />,
      },
      {
        path: "requests/new",
        element: <NewCitizenRequest />,
      },
      {
        path: "requests/manage",
        element: <ManageCitizenRequests />,
      },
      {
        path: "profile",
        element: <CitizenProfile />,
      },
    ],
  },
];
