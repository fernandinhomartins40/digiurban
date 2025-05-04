
import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminRegister from "@/pages/auth/AdminRegister";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "admin-register",
    element: <AdminRegister />,
  },
  {
    path: "esqueci-senha",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
];

export default authRoutes;
