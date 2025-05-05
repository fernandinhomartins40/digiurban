
import { RequestStatus, PriorityLevel, RequesterType } from "@/types/requests";

export function getStatusName(status: RequestStatus): string {
  switch (status) {
    case "open":
      return "Aberto";
    case "in_progress":
      return "Em Andamento";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    case "forwarded":
      return "Encaminhado";
    default:
      return status;
  }
}

export function getPriorityName(priority: PriorityLevel): string {
  switch (priority) {
    case "low":
      return "Baixa";
    case "normal":
      return "Normal";
    case "high":
      return "Alta";
    case "urgent":
      return "Urgente";
    default:
      return priority;
  }
}

export function getRequesterTypeName(type: RequesterType): string {
  switch (type) {
    case "citizen":
      return "Cidadão";
    case "department":
      return "Departamento";
    case "mayor":
      return "Gabinete";
    default:
      return type;
  }
}

export function getStatusColor(status: RequestStatus): string {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "in_progress":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "forwarded":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

export function getPriorityColor(priority: PriorityLevel): string {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "normal":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "high":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "urgent":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}
