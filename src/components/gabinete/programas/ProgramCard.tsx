
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Target, FileText } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { StrategicProgram } from "@/types/mayorOffice";

interface ProgramCardProps {
  program: StrategicProgram;
}

// Map status to display name
const mapStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    planning: "Planejamento",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

// Get status color
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    planning: "bg-purple-100 text-purple-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    pending: "bg-amber-100 text-amber-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Format currency
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card key={program.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(program.status)}>
            {mapStatusName(program.status)}
          </Badge>
          <Badge variant="outline">
            Progresso: {program.progressPercentage}%
          </Badge>
        </div>
        <CardTitle className="mt-1">{program.title}</CardTitle>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground">Período</p>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {format(program.startDate, "dd/MM/yyyy", { locale: ptBR })}
                {program.endDate && (
                  <span> até {format(program.endDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                )}
              </p>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground">Orçamento</p>
            <p className="text-xl font-medium mt-1">
              {formatCurrency(program.budget)}
            </p>
            {program.spentAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                Executado: {formatCurrency(program.spentAmount)}
              </p>
            )}
          </div>
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground">Marcos</p>
            <div className="flex items-center mt-1">
              <Target className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {program.milestones?.length || 0} marcos definidos
              </p>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <p className="text-sm text-muted-foreground">Documentos</p>
            <div className="flex items-center mt-1">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {program.documents?.length || 0} documentos anexados
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Geral</span>
            <span>{program.progressPercentage}%</span>
          </div>
          <Progress value={program.progressPercentage} className="h-2" />
        </div>

        {program.milestones && program.milestones.length > 0 && (
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="milestones">
              <AccordionTrigger>Marcos e Etapas</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  {program.milestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge className={getStatusColor(milestone.status)}>
                          {mapStatusName(milestone.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Prazo: {format(milestone.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          Ver detalhes completos
        </Button>
      </CardFooter>
    </Card>
  );
}
