
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MealMenu } from "@/types/education";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MenuDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: MealMenu | null;
}

export function MenuDetailDialog({
  open,
  onOpenChange,
  menu,
}: MenuDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const formatShift = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Manhã";
      case "afternoon":
        return "Tarde";
      case "evening":
        return "Noite";
      case "all":
        return "Todos";
      default:
        return shift;
    }
  };

  const formatDayOfWeek = (day: number) => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return days[day % 7]; // Ensure we stay within array bounds
  };

  if (!menu) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cardápio</DialogTitle>
          <DialogDescription>Informações detalhadas do cardápio.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Carregando...</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{menu.name}</h3>
              {menu.isSpecialDiet && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Dieta Especial
                </Badge>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações gerais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dia da semana</p>
                  <p>{formatDayOfWeek(menu.dayOfWeek)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Turno</p>
                  <p>{formatShift(menu.shift)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Início da vigência</p>
                  <p>{format(new Date(menu.activeFrom), "dd/MM/yyyy")}</p>
                </div>
                {menu.activeUntil && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fim da vigência</p>
                    <p>{format(new Date(menu.activeUntil), "dd/MM/yyyy")}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>
                    {menu.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Inativo
                      </Badge>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Itens do cardápio</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1">
                  {menu.menuItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {menu.isSpecialDiet && menu.forDietaryRestrictions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Restrições alimentares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {menu.forDietaryRestrictions.map((restriction, idx) => (
                      <Badge key={idx} variant="outline">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
