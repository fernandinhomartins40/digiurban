
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat, Map, MessageSquareText } from "lucide-react";

interface ObrasLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const ObrasLayout = ({ children, title, description }: ObrasLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-full space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-3xl mb-4">
          <TabsTrigger
            value="overview"
            className="flex gap-2 items-center"
            asChild
          >
            <Link to="/admin/obras" className={currentPath === "/admin/obras" ? "data-[state=active]" : ""}>
              <HardHat size={16} />
              Visão Geral
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="pequenas"
            className="flex gap-2 items-center"
            asChild
          >
            <Link 
              to="/admin/obras/pequenas" 
              className={currentPath.includes("/admin/obras/pequenas") ? "data-[state=active]" : ""}
            >
              <HardHat size={16} />
              Pequenas Obras
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="mapa"
            className="flex gap-2 items-center"
            asChild
          >
            <Link 
              to="/admin/obras/mapa" 
              className={currentPath.includes("/admin/obras/mapa") ? "data-[state=active]" : ""}
            >
              <Map size={16} />
              Mapa de Obras
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="flex gap-2 items-center"
            asChild
          >
            <Link 
              to="/admin/obras/feedback" 
              className={currentPath.includes("/admin/obras/feedback") ? "data-[state=active]" : ""}
            >
              <MessageSquareText size={16} />
              Feedback Cidadão
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 space-y-4">{children}</div>
    </div>
  );
};
