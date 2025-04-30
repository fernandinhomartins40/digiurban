
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { HealthProgram } from "@/types/health";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProgramCardProps {
  program: HealthProgram;
  onViewDetails: (program: HealthProgram) => void;
  onViewParticipants: (program: HealthProgram) => void;
}

export function ProgramCard({ program, onViewDetails, onViewParticipants }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${getCategoryColor(program.category)}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{program.name}</CardTitle>
          <Badge variant={program.isActive ? "default" : "secondary"}>
            {program.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {getCategoryName(program.category)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {program.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Início:</span>
            </div>
            <span className="font-medium">
              {format(new Date(program.startDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
          
          {program.meetingFrequency && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Frequência:</span>
              </div>
              <span className="font-medium">{program.meetingFrequency}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Coordenador:</span>
            </div>
            <span className="font-medium">{program.coordinatorName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewParticipants(program)}
        >
          Participantes
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails(program)}
        >
          Gerenciar
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to map category to a display name
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'hiperdia': 'Hiperdia',
    'saude_mental': 'Saúde Mental',
    'saude_mulher': 'Saúde da Mulher',
    'tabagismo': 'Tabagismo',
    'puericultura': 'Puericultura',
    'gestantes': 'Gestantes',
    'idosos': 'Idosos',
    'nutricao': 'Nutrição',
    'outros': 'Outros'
  };
  
  return categoryMap[category] || category;
}

// Helper function to map category to a color
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'hiperdia': 'bg-blue-500',
    'saude_mental': 'bg-purple-500',
    'saude_mulher': 'bg-pink-500',
    'tabagismo': 'bg-amber-500',
    'puericultura': 'bg-green-500',
    'gestantes': 'bg-red-500',
    'idosos': 'bg-teal-500',
    'nutricao': 'bg-emerald-500',
    'outros': 'bg-gray-500'
  };
  
  return colorMap[category] || 'bg-slate-500';
}
