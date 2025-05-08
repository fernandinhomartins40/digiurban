
import { 
  RequestStatus,
  PriorityLevel,
  RequesterType
} from "@/types/requests";

export const mapStatusName = (status: RequestStatus): string => {
  const statusMap: Record<RequestStatus, string> = {
    'open': 'Aberta',
    'in_progress': 'Em Andamento',
    'completed': 'Concluída',
    'cancelled': 'Cancelada',
    'forwarded': 'Encaminhada'
  };
  
  return statusMap[status] || status;
};

export const mapPriorityName = (priority: PriorityLevel): string => {
  const priorityMap: Record<PriorityLevel, string> = {
    'low': 'Baixa',
    'normal': 'Normal',
    'high': 'Alta',
    'urgent': 'Urgente'
  };
  
  return priorityMap[priority] || priority;
};

export const mapRequesterTypeName = (requesterType: RequesterType): string => {
  const requesterTypeMap: Record<RequesterType, string> = {
    'citizen': 'Cidadão',
    'department': 'Departamento',
    'mayor': 'Gabinete'
  };
  
  return requesterTypeMap[requesterType] || requesterType;
};

export const getPriorityColor = (priority: PriorityLevel): string => {
  const priorityColorMap: Record<PriorityLevel, string> = {
    'low': 'bg-slate-100 text-slate-800',
    'normal': 'bg-blue-100 text-blue-800',
    'high': 'bg-amber-100 text-amber-800',
    'urgent': 'bg-red-100 text-red-800'
  };
  
  return priorityColorMap[priority] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status: RequestStatus): string => {
  const statusColorMap: Record<RequestStatus, string> = {
    'open': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'forwarded': 'bg-purple-100 text-purple-800'
  };
  
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};
