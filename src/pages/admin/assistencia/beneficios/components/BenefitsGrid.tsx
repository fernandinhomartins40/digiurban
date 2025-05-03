
import React from 'react';
import { EmergencyBenefit } from '@/types/assistance';
import { BenefitCard } from './BenefitCard';
import { Card, CardContent } from '@/components/ui/card';
import { Package2 } from 'lucide-react';

interface BenefitsGridProps {
  benefits: EmergencyBenefit[];
  isLoading: boolean;
  onBenefitClick: (benefit: EmergencyBenefit) => void;
}

export function BenefitsGrid({ benefits, isLoading, onBenefitClick }: BenefitsGridProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <p>Carregando benefícios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (benefits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <Package2 className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum benefício encontrado</h3>
            <p className="text-muted-foreground mt-2">
              Não foram encontrados benefícios com os filtros selecionados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit) => (
        <BenefitCard
          key={benefit.id}
          benefit={benefit}
          onClick={() => onBenefitClick(benefit)}
        />
      ))}
    </div>
  );
}
