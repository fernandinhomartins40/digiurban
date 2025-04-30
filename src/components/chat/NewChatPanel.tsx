
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatProvider } from "@/contexts/ChatContext";
import { CitizenChatView } from "./CitizenChatView";
import { AdminChatView } from "./AdminChatView";

export function NewChatPanel() {
  const { user } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="rounded-full h-12 w-12 shadow-lg"
        variant={isPanelOpen ? "outline" : "default"}
      >
        {isPanelOpen ? <X /> : <MessageCircle />}
      </Button>

      {/* Chat Panel */}
      {isPanelOpen && (
        <ChatProvider>
          <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[600px] bg-white rounded-lg shadow-xl border flex flex-col">
            {user.role === "citizen" ? <CitizenChatView /> : <AdminChatView />}
          </div>
        </ChatProvider>
      )}
    </div>
  );
}
