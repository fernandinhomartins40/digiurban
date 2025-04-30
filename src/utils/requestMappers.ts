
import { PriorityLevel, RequestStatus } from "@/types/mayorOffice";

/**
 * Maps the request status code to a human-readable name
 */
export const mapStatusName = (status: string): string => {
  const statusMap: Record<string, string> = {
    open: "Aberta",
    in_progress: "Em Progresso",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return statusMap[status] || status;
};

/**
 * Maps the request priority code to a human-readable name
 */
export const mapPriorityName = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    low: "Baixa",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente",
  };
  return priorityMap[priority] || priority;
};

/**
 * Returns the appropriate Tailwind CSS class for priority level badge
 */
export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    normal: "bg-green-100 text-green-800",
    high: "bg-amber-100 text-amber-800",
    urgent: "bg-red-100 text-red-800",
  };
  return colorMap[priority] || "bg-gray-100 text-gray-800";
};

/**
 * Returns the appropriate Tailwind CSS class for status badge
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};
