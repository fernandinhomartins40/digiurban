
import { RequestStatus, PriorityLevel, RequesterType } from "@/types/requests";

/**
 * Map the request status to a human-readable name
 */
export const mapStatusName = (status: RequestStatus): string => {
  switch (status) {
    case 'open':
      return 'Aberta';
    case 'in_progress':
      return 'Em Andamento';
    case 'completed':
      return 'Concluída';
    case 'cancelled':
      return 'Cancelada';
    case 'forwarded':
      return 'Encaminhada';
    default:
      return 'Desconhecido';
  }
};

/**
 * Map the request priority to a human-readable name
 */
export const mapPriorityName = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'low':
      return 'Baixa';
    case 'normal':
      return 'Normal';
    case 'high':
      return 'Alta';
    case 'urgent':
      return 'Urgente';
    default:
      return 'Normal';
  }
};

/**
 * Get CSS class for status badge
 */
export const getStatusColor = (status: RequestStatus): string => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'forwarded':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Get CSS class for priority badge
 */
export const getPriorityColor = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'low':
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    case 'normal':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'high':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  }
};

/**
 * Map requester type to human-readable name
 */
export const getRequesterTypeName = (requesterType: RequesterType): string => {
  switch (requesterType) {
    case 'citizen':
      return 'Cidadão';
    case 'department':
      return 'Departamento';
    case 'mayor':
      return 'Gabinete';
    default:
      return 'Desconhecido';
  }
};

// Aliases for backward compatibility
export const getStatusName = mapStatusName;
export const getPriorityName = mapPriorityName;
