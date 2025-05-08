
import React from "react";
import { RouteObject } from "react-router-dom";
import ChatPage from "@/pages/admin/chat/ChatPage";

export const chatGptRoutes: RouteObject[] = [
  {
    path: "chat",
    element: <ChatPage />,
  },
];
