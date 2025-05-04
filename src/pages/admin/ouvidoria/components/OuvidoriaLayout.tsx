
import React, { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, BarChart, Phone } from "lucide-react";

interface OuvidoriaLayoutProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function OuvidoriaLayout({ 
  title = "Ouvidoria Municipal", 
  description = "Gestão de manifestações e atendimento ao cidadão",
  children
}: OuvidoriaLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = [
    { 
      name: "Painel de Controle", 
      path: "/admin/ouvidoria",
      icon: <BarChart className="h-4 w-4 mr-2" />
    },
    { 
      name: "Manifestações", 
      path: "/admin/ouvidoria/manifestacoes",
      icon: <MessageSquare className="h-4 w-4 mr-2" /> 
    },
    { 
      name: "Relatórios", 
      path: "/admin/ouvidoria/relatorios",
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    { 
      name: "Atendimento", 
      path: "/admin/ouvidoria/atendimento",
      icon: <Phone className="h-4 w-4 mr-2" />
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading title={title} description={description} />

        <Tabs defaultValue={currentPath} className="mt-6">
          <TabsList className="w-full max-w-3xl mb-6">
            {routes.map((route) => (
              <TabsTrigger
                key={route.path}
                value={route.path}
                className="flex-1 flex items-center justify-center"
                asChild
              >
                <Link to={route.path} className="flex items-center">
                  {route.icon}
                  {route.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children || <Outlet />}
    </div>
  );
}
