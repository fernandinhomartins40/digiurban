import React from "react";
import { BarChart2, Calendar, FileText, ArrowRight } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Program, ProgramStatus, StrategicProgram } from "@/types/mayorOffice";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProgramCardProps {
  program: Program | StrategicProgram;
  onClick?: () => void;
}

// Format date if needed
const formatDateIfNeeded = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (e) {
    return typeof dateString === 'string' ? dateString : '';
  }
};

// Get program name
const getProgramName = (program: Program | StrategicProgram): string => {
  return 'name' in program ? program.name : program.title;
};

// Get program description
const getProgramDescription = (program: Program | StrategicProgram): string => {
  return program.description || '';
};

// Get program category
const getProgramCategory = (program: Program | StrategicProgram): string => {
  if ('category' in program) return program.category || '';
  return '';
};

// Map status to display name
const mapStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    planning: "Planejamento",
    in_progress: "Em andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return statusMap[status] || status;
};

// Get status color based on status
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    planning: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Get progress display color
const getProgressColor = (progress: number): string => {
  if (progress < 25) return "bg-red-500";
  if (progress < 50) return "bg-orange-500";
  if (progress < 75) return "bg-yellow-500";
  return "bg-green-500";
};

// Get program progress
const getProgramProgress = (program: Program | StrategicProgram): number => {
  if ('progress' in program) return program.progress || 0;
  if ('progressPercentage' in program) return program.progressPercentage;
  return 0;
};

// Get milestones count
const getMilestonesCount = (program: Program | StrategicProgram): number => {
  if ('milestones' in program && program.milestones) return program.milestones.length;
  return 0;
};

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const status = 'status' in program ? program.status : 'planning';
  const startDate = 'startDate' in program ? program.startDate : undefined;
  const endDate = 'endDate' in program ? program.endDate : undefined;
  const progress = getProgramProgress(program);
  
  return (
    <Card key={program.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(status)}>
            {mapStatusName(status)}
          </Badge>
          
          {getProgramCategory(program) && (
            <Badge variant="outline">{getProgramCategory(program)}</Badge>
          )}
        </div>
        <CardTitle className="mt-1 text-lg">{getProgramName(program)}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getProgramDescription(program)}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDateIfNeeded(startDate)}
              {endDate && ` até ${formatDateIfNeeded(endDate)}`}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{getMilestonesCount(program)} marcos definidos</span>
            </div>
            
            {program.budget && (
              <span className="text-sm font-medium">
                R$ {program.budget.toLocaleString('pt-BR')}
              </span>
            )}
          </div>
          
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={`h-2 ${getProgressColor(progress)}`} 
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          Ver detalhes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
