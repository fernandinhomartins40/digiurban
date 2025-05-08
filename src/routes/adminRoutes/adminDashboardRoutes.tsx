
import React from "react";
import { RouteObject } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
];
