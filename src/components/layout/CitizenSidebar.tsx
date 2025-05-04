
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  Building,
  BookOpen,
  Heart,
  MessageCircle
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";
import { UserSection } from "./sidebar/UserSection";

export function CitizenSidebar() {
  const { conversations } = useChat();
  const location = useLocation();

  // Calculate unread messages
  const unreadCount = conversations
    .filter(conv => conv.type === "citizen")
    .reduce((total, conv) => total + conv.unreadCount, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="p-3 flex items-center">
        <h1 className="text-lg font-bold text-primary">digiurban</h1>
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/dashboard")} tooltip="Início">
              <Link to="/citizen/dashboard">
                <Home className="h-5 w-5" />
                <span>Início</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/chat")} tooltip="Chat">
              <Link to="/citizen/chat" className="relative">
                <MessageCircle className="h-5 w-5" />
                <span>Chat</span>
                {unreadCount > 0 && (
                  <Badge className="absolute right-2 top-1/2 -translate-y-1/2 h-5 min-w-5">{unreadCount}</Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/requests")} tooltip="Solicitações">
              <Link to="/citizen/requests">
                <FileText className="h-5 w-5" />
                <span>Solicitações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/services")} tooltip="Serviços">
              <Link to="/citizen/services">
                <Building className="h-5 w-5" />
                <span>Serviços</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/education")} tooltip="Educação">
              <Link to="/citizen/education">
                <BookOpen className="h-5 w-5" />
                <span>Educação</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/citizen/health")} tooltip="Saúde">
              <Link to="/citizen/health">
                <Heart className="h-5 w-5" />
                <span>Saúde</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <UserSection />
      </SidebarFooter>
    </Sidebar>
  );
}
