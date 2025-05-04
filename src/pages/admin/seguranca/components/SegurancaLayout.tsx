
import React, { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SegurancaLayoutProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function SegurancaLayout({ 
  title = "Segurança Pública", 
  description = "Gestão de segurança pública do município",
  children
}: SegurancaLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = [
    { name: "Visão Geral", path: "/admin/seguranca" },
    { name: "Ocorrências", path: "/admin/seguranca/ocorrencias" },
    { name: "Guarda Municipal", path: "/admin/seguranca/guarda" },
    { name: "Videomonitoramento", path: "/admin/seguranca/cameras" },
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
                className="flex-1"
                asChild
              >
                <Link to={route.path}>{route.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children || <Outlet />}
    </div>
  );
}
