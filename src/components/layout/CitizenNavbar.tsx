
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
  MessageCircle,
  ChevronDown,
  Settings,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
  Bell
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsSheet } from "@/components/chat/NotificationsSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CitizenNavbar() {
  const { logout, user } = useAuth();
  const { conversations, notifications } = useChat();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  // Calculate unread messages
  const unreadCount = conversations
    .filter(conv => conv.type === "citizen")
    .reduce((total, conv) => total + conv.unreadCount, 0);

  // Calculate unread notifications
  const unreadNotifications = notifications
    ? notifications.filter(n => !n.read).length
    : 0;

  // Define dropdown menus
  const dropdownMenus = [
    {
      label: "Serviços",
      icon: <Building size={18} />,
      items: [
        { 
          icon: <FileText size={16} />, 
          label: "Solicitações", 
          path: "/citizen/requests" 
        },
        { 
          icon: <ClipboardCheck size={16} />, 
          label: "Novos Serviços", 
          path: "/citizen/services" 
        },
        { 
          icon: <Calendar size={16} />, 
          label: "Agendamentos", 
          path: "/citizen/appointments" 
        },
      ]
    },
    {
      label: "Saúde",
      icon: <Heart size={18} />,
      items: [
        { 
          icon: <Heart size={16} />, 
          label: "Consultas", 
          path: "/citizen/health/appointments" 
        },
        { 
          icon: <ClipboardCheck size={16} />, 
          label: "Exames", 
          path: "/citizen/health/exams" 
        },
        { 
          icon: <Calendar size={16} />, 
          label: "Agendamentos", 
          path: "/citizen/health/schedule" 
        },
      ]
    },
    {
      label: "Educação",
      icon: <BookOpen size={18} />,
      items: [
        { 
          icon: <GraduationCap size={16} />, 
          label: "Matrículas", 
          path: "/citizen/education/enrollment" 
        },
        { 
          icon: <CalendarDays size={16} />, 
          label: "Calendário Escolar", 
          path: "/citizen/education/calendar" 
        },
        { 
          icon: <FileText size={16} />, 
          label: "Boletim", 
          path: "/citizen/education/report" 
        },
      ]
    }
  ];

  // Direct navigation items
  const directNavItems = [
    {
      icon: <Home size={18} />,
      label: "Início",
      path: "/citizen/dashboard",
    },
    {
      icon: <MessageCircle size={18} />,
      label: "Chat",
      path: "/citizen/chat",
      badge: unreadCount,
    },
  ];
  
  const isActiveItem = (path: string) => {
    return location.pathname === path ||
           location.pathname.startsWith(path + '/');
  };

  const NavLinks = () => (
    <>
      {directNavItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            "flex items-center px-4 py-2 text-sm rounded-md",
            isActiveItem(item.path)
              ? "bg-primary/10 text-primary"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <span className="mr-2">{item.icon}</span>
          <span>{item.label}</span>
          {item.badge > 0 && (
            <Badge className="ml-2">{item.badge}</Badge>
          )}
        </Link>
      ))}

      {/* Dropdown Menus */}
      {dropdownMenus.map((menu, index) => (
        <DropdownMenu key={index}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                menu.items.some(item => isActiveItem(item.path))
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="mr-2">{menu.icon}</span>
              <span>{menu.label}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{menu.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menu.items.map((item, itemIndex) => (
              <DropdownMenuItem key={itemIndex} asChild>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center w-full",
                    isActiveItem(item.path) ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </>
  );

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">digiurban</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLinks />
          </nav>

          {/* User menu and mobile menu */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            
            <NotificationsSheet 
              open={notificationsOpen} 
              onOpenChange={setNotificationsOpen} 
            />

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name || "Cidadão"}</span>
                      <span className="text-xs text-muted-foreground">Cidadão</span>
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/citizen/profile">
                      <User className="mr-2" size={16} />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/citizen/settings">
                      <Settings className="mr-2" size={16} />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2" size={16} />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-lg font-semibold">Menu</h2>
                    </div>
                    
                    <div className="flex flex-col py-4 space-y-1 flex-grow">
                      {directNavItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm rounded-md",
                            isActiveItem(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.label}</span>
                          {item.badge > 0 && (
                            <Badge className="ml-2">{item.badge}</Badge>
                          )}
                        </Link>
                      ))}

                      {/* Mobile Dropdown Categories */}
                      {dropdownMenus.map((menu, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center px-4 py-2 text-sm font-medium">
                            <span className="mr-3">{menu.icon}</span>
                            <span>{menu.label}</span>
                          </div>
                          <div className="pl-9 space-y-1">
                            {menu.items.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                to={item.path}
                                className={cn(
                                  "flex items-center px-4 py-2 text-sm rounded-md",
                                  isActiveItem(item.path)
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-700 hover:bg-gray-100"
                                )}
                              >
                                <span className="mr-2">{item.icon}</span>
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
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
