
import React from "react";
import { RouteObject } from "react-router-dom";
import UniversalRequestsPage from "@/pages/admin/requests/UniversalRequestsPage";

export const requestsRoutes: RouteObject[] = [
  {
    path: "solicitacoes",
    element: <UniversalRequestsPage />,
  },
];
