
import { Badge } from "@/components/ui/badge";

type BenefitStatusProps = {
  status: string;
};

export function BenefitStatusBadge({ status }: BenefitStatusProps) {
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return "secondary";
      case 'approved': return "default";
      case 'rejected': return "destructive";
      case 'delivering': return "outline";
      case 'completed': return "outline";
      default: return "outline";
    }
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'delivering': return 'Em Entrega';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
