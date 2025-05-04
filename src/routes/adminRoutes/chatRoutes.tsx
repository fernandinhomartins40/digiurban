
import { RouteObject } from "react-router-dom";
import AdminChatPage from "@/pages/admin/chat/ChatPage";

export const adminChatRoutes: RouteObject[] = [
  {
    path: "chat",
    element: <AdminChatPage />,
  },
];
