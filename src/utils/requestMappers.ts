
import { RequestStatus, PriorityLevel, RequesterType } from "@/types/requests";

// Map status to display name
export const mapStatusName = (status: RequestStatus): string => {
  const statusMap: Record<RequestStatus, string> = {
    open: "Aberto",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
    forwarded: "Encaminhado"
  };
  
  return statusMap[status] || status;
};

// Map priority to display name
export const mapPriorityName = (priority: PriorityLevel): string => {
  const priorityMap: Record<PriorityLevel, string> = {
    low: "Baixa",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente"
  };
  
  return priorityMap[priority] || priority;
};

// Get CSS class for status badge
export const getStatusColor = (status: RequestStatus): string => {
  const colorMap: Record<RequestStatus, string> = {
    open: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    in_progress: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    forwarded: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  };
  
  return colorMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

// Get CSS class for priority badge
export const getPriorityColor = (priority: PriorityLevel): string => {
  const colorMap: Record<PriorityLevel, string> = {
    low: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    normal: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    high: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    urgent: "bg-red-100 text-red-800 hover:bg-red-200"
  };
  
  return colorMap[priority] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

// Convert RequesterType to a human-readable name
export const getRequesterTypeName = (type: RequesterType): string => {
  const typeMap: Record<RequesterType, string> = {
    citizen: "Cidadão",
    department: "Departamento",
    mayor: "Gabinete do Prefeito"
  };
  
  return typeMap[type] || "Desconhecido";
};
