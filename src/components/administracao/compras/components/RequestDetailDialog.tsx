
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { PurchaseRequest, PurchaseStatusHistory } from "@/services/administration/purchase";
import { fetchPurchaseHistory } from "@/services/administration/purchase/statusHistory";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/gabinete/solicitacoes/LoadingSpinner";
import { getStatusBadge, getStatusIcon } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

interface RequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PurchaseRequest | null;
}

export function RequestDetailDialog({
  open,
  onOpenChange,
  request
}: RequestDetailDialogProps) {
  const [history, setHistory] = useState<PurchaseStatusHistory[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  React.useEffect(() => {
    async function loadHistory() {
      if (request && open) {
        setLoadingDetails(true);
        try {
          const historyData = await fetchPurchaseHistory(request.id);
          setHistory(historyData);
        } catch (error) {
          console.error("Error fetching request details:", error);
        } finally {
          setLoadingDetails(false);
        }
      }
    }
    
    loadHistory();
  }, [request, open]);
  
  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("purchase_attachments")
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      console.error("Error downloading file:", error.message);
    }
  };

  if (!request) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Solicitação {request.protocolNumber}
          </DialogTitle>
        </DialogHeader>

        {loadingDetails ? (
          <div className="py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
                <p>{request.department}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Prioridade</h4>
                <div><PriorityBadge priority={request.priority} /></div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div>{getStatusBadge(request.status)}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data da Solicitação</h4>
                <p>{request.createdAt.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Justificativa</h4>
              <p className="text-gray-700">{request.justification}</p>
            </div>

            {request.items && request.items.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Itens Solicitados</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Est.</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {request.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.description || "-"}</td>
                          <td className="px-3 py-2">{item.quantity}</td>
                          <td className="px-3 py-2">{item.unit}</td>
                          <td className="px-3 py-2">
                            {item.estimatedPrice 
                              ? `R$ ${item.estimatedPrice.toFixed(2)}` 
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {request.attachments && request.attachments.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Anexos</h4>
                <div className="space-y-2">
                  {request.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between border rounded p-2">
                      <div>
                        <span className="text-sm">{attachment.fileName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(attachment.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadFile(attachment.filePath, attachment.fileName)}
                      >
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Histórico</h4>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">
                          Status alterado para {item.status}
                        </span>
                      </div>
                      {item.comments && (
                        <p className="text-sm text-gray-600 mt-1">{item.comments}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(item.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
