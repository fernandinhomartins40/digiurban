
import React, { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TurismoLayoutProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function TurismoLayout({ 
  title = "Turismo", 
  description = "Gestão de atividades turísticas do município",
  children
}: TurismoLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const routes = [
    { name: "Visão Geral", path: "/admin/turismo" },
    { name: "Pontos Turísticos", path: "/admin/turismo/pontos" },
    { name: "Eventos", path: "/admin/turismo/eventos" },
    { name: "Promoções", path: "/admin/turismo/promocoes" },
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
