
import React from "react";
import { Navigate } from "react-router-dom";

export default function RHPage() {
  // Redirect to the dashboard page
  return <Navigate to="/admin/rh/dashboard" replace />;
}
