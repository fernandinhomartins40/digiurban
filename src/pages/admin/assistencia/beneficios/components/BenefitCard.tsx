
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BenefitStatusBadge } from "./BenefitStatusBadge";
import { Eye, Calendar } from "lucide-react";
import { Benefit } from "../hooks/useBenefits";

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <BenefitStatusBadge status={benefit.status} />
          <span className="text-sm text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(benefit.lastUpdate)}
          </span>
        </div>
        <h3 className="text-lg font-semibold mt-2">{benefit.category}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {benefit.beneficiaryName}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">CPF:</span>
            <span>{benefit.beneficiaryCpf}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span>{formatCurrency(benefit.value)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Início:</span>
            <span>{formatDate(benefit.startDate)}</span>
          </div>
          {benefit.endDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Término:</span>
              <span>{formatDate(benefit.endDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
