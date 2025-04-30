
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  Building,
  BookOpen,
  Heart,
  User,
  Menu,
  LogOut,
  X,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useChat } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";

export function CitizenNavbar() {
  const { logout, user } = useAuth();
  const { conversations } = useChat();
  const location = useLocation();

  // Calculate unread messages
  const unreadCount = conversations
    .filter(conv => conv.type === "citizen")
    .reduce((total, conv) => total + conv.unreadCount, 0);

  const navItems = [
    {
      icon: <Home size={18} />,
      title: "Início",
      path: "/citizen/dashboard",
    },
    {
      icon: <MessageCircle size={18} />,
      title: "Chat",
      path: "/citizen/chat",
      badge: unreadCount,
    },
    {
      icon: <FileText size={18} />,
      title: "Solicitações",
      path: "/citizen/requests",
    },
    {
      icon: <Building size={18} />,
      title: "Serviços",
      path: "/citizen/services",
    },
    {
      icon: <BookOpen size={18} />,
      title: "Educação",
      path: "/citizen/education",
    },
    {
      icon: <Heart size={18} />,
      title: "Saúde",
      path: "/citizen/health",
    },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            "flex items-center px-4 py-2 text-sm rounded-md",
            location.pathname === item.path
              ? "bg-primary/10 text-primary"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="mr-2">{item.icon}</span>
          <span>{item.title}</span>
          {item.badge > 0 && (
            <Badge className="ml-2">{item.badge}</Badge>
          )}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">digiurban</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </nav>

          {/* User menu and mobile menu */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <div className="flex items-center border-r pr-4 mr-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user?.name || "Cidadão"}</p>
                  <p className="text-xs text-gray-500">Cidadão</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2" 
                onClick={() => logout()}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-lg font-semibold">Menu</h2>
                    </div>
                    
                    <div className="flex flex-col py-4 space-y-1 flex-grow">
                      <NavLinks />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{user?.name || "Cidadão"}</p>
                          <p className="text-xs text-gray-500">Cidadão</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2" 
                        onClick={() => logout()}
                      >
                        <LogOut size={16} />
                        <span>Sair</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
