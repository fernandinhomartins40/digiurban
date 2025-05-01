
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
import { getSpecialDietById } from "@/services/education/diets";
import { SpecialDiet } from "@/types/education";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DietDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dietId?: string;
}

export function DietDetailDialog({
  open,
  onOpenChange,
  dietId,
}: DietDetailDialogProps) {
  const { toast } = useToast();
  const [diet, setDiet] = useState<SpecialDiet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dietId && open) {
      loadDietDetails(dietId);
    }
  }, [dietId, open]);

  const loadDietDetails = async (id: string) => {
    setLoading(true);
    try {
      const result = await getSpecialDietById(id);
      setDiet(result);
    } catch (error) {
      console.error("Error loading diet details:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da dieta especial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Dieta Especial</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a dieta especial
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Carregando...</div>
        ) : !diet ? (
          <div className="py-10 text-center">Dieta não encontrada</div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações gerais</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de dieta</p>
                  <p className="font-medium">{diet.dietType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>
                    {diet.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Inativa
                      </Badge>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Data de início</p>
                  <p>{format(new Date(diet.startDate), "dd/MM/yyyy")}</p>
                </div>
                
                {diet.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de término</p>
                    <p>{format(new Date(diet.endDate), "dd/MM/yyyy")}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    Documentação médica
                  </p>
                  <p>
                    {diet.medicalDocumentation ? (
                      <Badge className="bg-green-100 text-green-800">Sim</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Não
                      </Badge>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Restrições alimentares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {diet.restrictions.map((restriction, idx) => (
                    <Badge key={idx} variant="outline">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {diet.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{diet.notes}</p>
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
