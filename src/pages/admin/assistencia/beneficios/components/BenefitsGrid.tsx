
// Update BenefitsGrid to accept Benefit type instead of EmergencyBenefit
import React from "react";
import { BenefitCard } from "./BenefitCard";
import { Card, CardContent } from "@/components/ui/card";
import { Benefit } from "../hooks/useBenefits";

interface BenefitsGridProps {
  benefits: Benefit[];
  isLoading: boolean;
}

export function BenefitsGrid({ benefits, isLoading }: BenefitsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[300px] animate-pulse bg-muted/30"></Card>
        ))}
      </div>
    );
  }

  if (benefits.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground">Nenhum benefício encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {benefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </div>
  );
}
