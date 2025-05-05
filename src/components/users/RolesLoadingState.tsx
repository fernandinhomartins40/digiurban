
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function RolesLoadingState() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando funções...</span>
        </div>
      </CardContent>
    </Card>
  );
}
