
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { EmergencyBenefit } from "@/types/assistance";
import { BenefitStatusBadge } from "./BenefitStatusBadge";

interface BenefitCardProps {
  benefit: EmergencyBenefit;
  onClick: () => void;
}

export function BenefitCard({ benefit, onClick }: BenefitCardProps) {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            {benefit.benefit_type || "Benefício Emergencial"}
          </CardTitle>
          <BenefitStatusBadge status={benefit.status} />
        </div>
        <CardDescription className="flex items-center gap-1">
          <span className="font-medium">{benefit.protocol_number}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Cidadão:</span> {benefit.citizen_name || 'Não especificado'}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Solicitado em: {formatDate(benefit.request_date)}</span>
          </div>
          {benefit.delivery_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Entregue em: {formatDate(benefit.delivery_date)}</span>
            </div>
          )}
          <div className="line-clamp-2">
            <span className="font-medium">Motivo:</span> {benefit.reason}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
