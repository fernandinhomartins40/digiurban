
import { PurchaseRequest } from "@/types/administration";

// Helper function to map purchase request data from database
export function mapPurchaseRequestFromDb(request: any): PurchaseRequest {
  return {
    id: request.id,
    protocolNumber: request.protocol_number,
    userId: request.user_id,
    department: request.department,
    justification: request.justification,
    status: request.status,
    priority: request.priority,
    assignedTo: request.assigned_to,
    createdAt: new Date(request.created_at),
    updatedAt: new Date(request.updated_at),
    items: request.items ? request.items.map((item: any) => ({
      id: item.id,
      requestId: item.request_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      description: item.description,
      estimatedPrice: item.estimated_price,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    })) : undefined,
    attachments: request.attachments ? request.attachments.map((attachment: any) => ({
      id: attachment.id,
      requestId: attachment.request_id,
      filePath: attachment.file_path,
      fileName: attachment.file_name,
      fileType: attachment.file_type,
      fileSize: attachment.file_size,
      createdAt: new Date(attachment.created_at),
    })) : undefined,
  };
}
