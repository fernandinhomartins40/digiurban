
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
import { PublicPolicy, PolicyStatus, Policy } from "@/types/mayorOffice";

interface PolicyCardProps {
  policy: Policy | PublicPolicy;
  onClick?: () => void;
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

// Get policy name
const getPolicyName = (policy: Policy | PublicPolicy): string => {
  return 'name' in policy ? policy.name : policy.title;
};

// Get policy department/category
const getPolicyDepartment = (policy: Policy | PublicPolicy): string => {
  if ('department' in policy) return policy.department;
  if ('category' in policy) return policy.category || '';
  return '';
};

// Get policy description
const getPolicyDescription = (policy: Policy | PublicPolicy): string => {
  return policy.description || '';
};

// Get policy progress
const getPolicyProgress = (policy: Policy | PublicPolicy): number => {
  return policy.progress || 0;
};

// Get policy goals count
const getPolicyGoalsCount = (policy: Policy | PublicPolicy): number => {
  if ('goals' in policy && policy.goals) return policy.goals.length;
  if ('key_objectives' in policy && policy.key_objectives) return policy.key_objectives.length;
  return 0;
};

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

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  const status = 'status' in policy ? policy.status : 'draft';
  const startDate = 'startDate' in policy ? policy.startDate : undefined;
  const endDate = 'endDate' in policy ? policy.endDate : undefined;
  
  return (
    <Card key={policy.id} className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(status)}>
            {mapStatusName(status)}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {getPolicyDepartment(policy)}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-1">{getPolicyName(policy)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {getPolicyDescription(policy)}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDateIfNeeded(startDate)}
              {endDate && ` até ${formatDateIfNeeded(endDate)}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {getPolicyGoalsCount(policy)} metas definidas
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progresso</span>
              <span>{getPolicyProgress(policy)}%</span>
            </div>
            <Progress value={getPolicyProgress(policy)} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
          Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
