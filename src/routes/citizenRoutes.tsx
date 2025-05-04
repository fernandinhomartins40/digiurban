
import { RouteObject } from "react-router-dom";
import { CitizenLayout } from "@/components/layout/CitizenLayout";
import CitizenDashboard from "@/pages/citizen/dashboard";
import CitizenChatPage from "@/pages/citizen/chat/ChatPage";
import CitizenRequestsPage from "@/pages/citizen/requests";
import NewCitizenRequestPage from "@/pages/citizen/requests/new";
import RequestDetailPage from "@/pages/citizen/requests/[id]";

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
        children: [
          {
            path: "",
            element: <CitizenRequestsPage />,
          },
          {
            path: "new",
            element: <NewCitizenRequestPage />,
          },
          {
            path: ":id",
            element: <RequestDetailPage />,
          }
        ]
      },
      {
        path: "chat",
        element: <CitizenChatPage />,
      },
      // These routes are placeholders, we will implement them later
      {
        path: "services",
        element: <CitizenDashboard />, // Placeholder, to be replaced
      },
      {
        path: "education",
        element: <CitizenDashboard />, // Placeholder, to be replaced
      },
      {
        path: "health",
        element: <CitizenDashboard />, // Placeholder, to be replaced
      },
    ],
  },
];

export default citizenRoutes;
