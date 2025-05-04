
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, FileText, Camera } from "lucide-react";

interface ServicosLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const ServicosLayout = ({ children, title, description }: ServicosLayoutProps) => {
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
            <Link to="/admin/servicos" className={currentPath === "/admin/servicos" ? "data-[state=active]" : ""}>
              <Wrench size={16} />
              Visão Geral
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="solicitacoes"
            className="flex gap-2 items-center"
            asChild
          >
            <Link 
              to="/admin/servicos/solicitacoes" 
              className={currentPath.includes("/admin/servicos/solicitacoes") ? "data-[state=active]" : ""}
            >
              <FileText size={16} />
              Solicitações
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="registros"
            className="flex gap-2 items-center"
            asChild
          >
            <Link 
              to="/admin/servicos/registros" 
              className={currentPath.includes("/admin/servicos/registros") ? "data-[state=active]" : ""}
            >
              <Camera size={16} />
              Registro Fotográfico
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 space-y-4">{children}</div>
    </div>
  );
};
