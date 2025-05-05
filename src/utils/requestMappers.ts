import { RequestStatus, PriorityLevel } from "@/types/requests";

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

// Alias for backward compatibility
export const getPriorityName = mapPriorityName;

// Other utility functions for request data transformations
