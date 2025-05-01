
import { PriorityLevel, RequestStatus } from "@/types/mayorOffice";

// Map status to display name
export const mapStatusName = (status: RequestStatus): string => {
  const statusMap: Record<RequestStatus, string> = {
    open: "Aberta",
    in_progress: "Em Progresso",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return statusMap[status] || status;
};

// Map priority to display name
export const mapPriorityName = (priority: PriorityLevel): string => {
  const priorityMap: Record<PriorityLevel, string> = {
    low: "Baixa",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente",
  };
  return priorityMap[priority] || priority;
};

// Get status color class for Tailwind
export const getStatusColor = (status: RequestStatus): string => {
  const colorMap: Record<RequestStatus, string> = {
    open: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Get priority color class for Tailwind
export const getPriorityColor = (priority: PriorityLevel): string => {
  const colorMap: Record<PriorityLevel, string> = {
    low: "bg-green-100 text-green-800",
    normal: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };
  return colorMap[priority] || "bg-gray-100 text-gray-800";
};
