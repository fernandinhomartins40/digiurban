
import React from "react";
import { CitizenChatView } from "@/components/chat/CitizenChatView";

export default function CitizenChatPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="rounded-lg border bg-card shadow-sm h-[calc(100vh-13rem)] overflow-hidden">
        <CitizenChatView />
      </div>
    </div>
  );
}
