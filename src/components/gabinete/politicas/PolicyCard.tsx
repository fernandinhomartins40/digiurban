
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Target, ArrowRight } from "lucide-react";
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
import { PublicPolicy, PolicyStatus } from "@/types/mayorOffice";

interface PolicyCardProps {
  policy: PublicPolicy;
}

// Map status to display name
const mapStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: "Rascunho",
    active: "Ativa",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return statusMap[status] || status;
};

// Get status color
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    draft: "bg-amber-100 text-amber-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Calculate policy progress
const calculatePolicyProgress = (policy: PublicPolicy): number => {
  if (!policy.goals || policy.goals.length === 0) return 0;
  
  const completedGoals = policy.goals.filter(goal => goal.status === "completed").length;
  return Math.round((completedGoals / policy.goals.length) * 100);
};

export function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <Card key={policy.id} className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(policy.status)}>
            {mapStatusName(policy.status)}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {policy.department}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-1">{policy.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {policy.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(policy.startDate, "dd/MM/yyyy", { locale: ptBR })}
              {policy.endDate && ` até ${format(policy.endDate, "dd/MM/yyyy", { locale: ptBR })}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {policy.goals?.length || 0} metas definidas
            </span>
          </div>
          
          {policy.goals && policy.goals.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progresso</span>
                <span>{calculatePolicyProgress(policy)}%</span>
              </div>
              <Progress value={calculatePolicyProgress(policy)} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={`#policy-details-${policy.id}`}>
            Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
