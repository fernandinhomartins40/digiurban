
import { RouteObject } from "react-router-dom";
import { CitizenLayout } from "@/components/layout/CitizenLayout";
import CitizenDashboard from "@/pages/admin/Dashboard";
import CitizenChatPage from "@/pages/citizen/chat/ChatPage";

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
        path: "chat",
        element: <CitizenChatPage />,
      },
    ],
  },
];

export default citizenRoutes;
