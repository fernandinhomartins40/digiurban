
import { PriorityLevel, RequestStatus, RequesterType } from "@/types/requests";

/**
 * Maps the status to a readable name
 */
export function mapStatusName(status: RequestStatus): string {
  const statusMap: Record<RequestStatus, string> = {
    open: "Aberto",
    in_progress: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
    forwarded: "Encaminhado"
  };
  return statusMap[status] || status;
}

/**
 * Maps the priority to a readable name
 */
export function mapPriorityName(priority: PriorityLevel): string {
  const priorityMap: Record<PriorityLevel, string> = {
    low: "Baixa",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente"
  };
  return priorityMap[priority] || priority;
}

/**
 * Gets the appropriate color class for a status
 */
export function getStatusColor(status: RequestStatus): string {
  const colorMap: Record<RequestStatus, string> = {
    open: "bg-yellow-500 hover:bg-yellow-600",
    in_progress: "bg-blue-500 hover:bg-blue-600",
    completed: "bg-green-500 hover:bg-green-600",
    cancelled: "bg-gray-500 hover:bg-gray-600",
    forwarded: "bg-purple-500 hover:bg-purple-600"
  };
  return colorMap[status] || "bg-gray-500 hover:bg-gray-600";
}

/**
 * Gets the appropriate color class for a priority
 */
export function getPriorityColor(priority: PriorityLevel): string {
  const colorMap: Record<PriorityLevel, string> = {
    low: "bg-blue-500 hover:bg-blue-600",
    normal: "bg-green-500 hover:bg-green-600",
    high: "bg-orange-500 hover:bg-orange-600",
    urgent: "bg-red-500 hover:bg-red-600"
  };
  return colorMap[priority] || "bg-gray-500 hover:bg-gray-600";
}

/**
 * Maps the requester type to a readable name
 */
export function mapRequesterTypeName(requesterType: RequesterType): string {
  const requesterTypeMap: Record<RequesterType, string> = {
    citizen: "Cidadão",
    department: "Departamento",
    mayor: "Gabinete"
  };
  return requesterTypeMap[requesterType] || requesterType;
}
