
import React from "react";
import { AdminChatView } from "@/components/chat/AdminChatView";

export default function AdminChatPage() {
  return (
    <div className="container mx-auto py-6 h-[calc(100vh-80px)]">
      <div className="border rounded-md shadow-sm h-full">
        <AdminChatView />
      </div>
    </div>
  );
}
