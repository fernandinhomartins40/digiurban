
import React from "react";
import { Coins, FileText, Receipt, ChartBar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancasIndex() {
  const modules = [
    {
      title: "Dashboard",
      description: "Visualize métricas e indicadores financeiros",
      icon: <ChartBar className="h-8 w-8 text-primary" />,
      href: "/admin/financas/dashboard",
    },
    {
      title: "Solicitação de Guias",
      description: "Emita guias de pagamento e boletos",
      icon: <Receipt className="h-8 w-8 text-primary" />,
      href: "/admin/financas/guias",
    },
    {
      title: "Consultar Débitos",
      description: "Consulte situação de débitos por contribuinte",
      icon: <Coins className="h-8 w-8 text-primary" />,
      href: "/admin/financas/debitos",
    },
    {
      title: "Certidões",
      description: "Emita e verifique certidões municipais",
      icon: <FileText className="h-8 w-8 text-primary" />,
      href: "/admin/financas/certidoes",
    },
  ];

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Finanças</h1>
        <p className="text-muted-foreground">
          Gerencie operações financeiras do município
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module) => (
          <Link to={module.href} key={module.title}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="mb-2">{module.icon}</div>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
