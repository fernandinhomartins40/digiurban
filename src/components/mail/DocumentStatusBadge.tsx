
import { Badge } from "@/components/ui/badge";
import { DocumentStatus } from "@/types/mail";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const statusStyles = {
    pending: {
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      text: "Pendente"
    },
    forwarded: {
      className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      text: "Encaminhado"
    },
    responded: {
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      text: "Respondido"
    },
    completed: {
      className: "bg-green-100 text-green-800 hover:bg-green-200",
      text: "Concluído"
    }
  };

  const { className, text } = statusStyles[status];

  return (
    <Badge variant="outline" className={className}>
      {text}
    </Badge>
  );
}
