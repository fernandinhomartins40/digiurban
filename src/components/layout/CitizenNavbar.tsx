
import React from "react";
import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";
import { NotificationsSheet } from "@/components/chat/NotificationsSheet";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CitizenNavbar() {
  const { user } = useAuth();
  const { notifications = [] } = useChat();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <SidebarTrigger />
            </div>
            <h1 className="text-xl font-bold text-primary md:block hidden">digiurban</h1>
            <span className="text-sm text-muted-foreground ml-4 hidden md:block">
              Bem-vindo(a), {user?.name || "Cidadão"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <div className="md:hidden">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationsSheet open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>
  );
}
