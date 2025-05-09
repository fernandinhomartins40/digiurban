
import { PurchaseRequest, Supplier, Contract, ContractItem } from "@/types/administration";

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

// Helper function to map supplier from database
export function mapSupplierFromDb(supplier: any): Supplier {
  return {
    id: supplier.id,
    name: supplier.name,
    cnpj: supplier.cnpj,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    city: supplier.city,
    state: supplier.state,
    isActive: supplier.is_active,
    createdAt: new Date(supplier.created_at),
    updatedAt: new Date(supplier.updated_at),
  };
}

// Helper function to map contract from database
export function mapContractFromDb(contract: any): Contract {
  return {
    id: contract.id,
    contractNumber: contract.contract_number,
    supplierId: contract.supplier_id,
    supplierName: contract.supplierName || contract.supplier_name,
    description: contract.description,
    startDate: new Date(contract.start_date),
    endDate: new Date(contract.end_date),
    totalValue: contract.total_value,
    status: contract.status,
    createdAt: new Date(contract.created_at),
    updatedAt: new Date(contract.updated_at),
    items: contract.items ? contract.items.map(mapContractItemFromDb) : undefined,
  };
}

// Helper function to map contract item from database
export function mapContractItemFromDb(item: any): ContractItem {
  return {
    id: item.id,
    contractId: item.contract_id,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    quantityUsed: item.quantity_used,
    unit: item.unit,
    unitPrice: item.unit_price,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
}
