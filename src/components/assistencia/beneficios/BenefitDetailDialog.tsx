
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { EmergencyBenefit, BenefitAttachment } from "@/types/assistance";
import { getBenefitAttachments } from "@/services/assistance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BenefitDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: EmergencyBenefit | null;
}

export default function BenefitDetailDialog({
  isOpen,
  onClose,
  benefit,
}: BenefitDetailDialogProps) {
  const [attachments, setAttachments] = useState<BenefitAttachment[]>([]);

  useEffect(() => {
    if (benefit) {
      fetchAttachments();
    }
  }, [benefit]);

  const fetchAttachments = async () => {
    if (benefit) {
      try {
        const data = await getBenefitAttachments(benefit.id);
        setAttachments(data);
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    }
  };

  if (!benefit) {
    return null;
  }

  const getBenefitStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800",
      },
      approved: {
        label: "Aprovado",
        className: "bg-green-100 text-green-800",
      },
      delivering: {
        label: "Em Entrega",
        className: "bg-blue-100 text-blue-800",
      },
      completed: {
        label: "Concluído",
        className: "bg-slate-100 text-slate-800",
      },
      rejected: {
        label: "Rejeitado",
        className: "bg-red-100 text-red-800",
      },
    };

    const status_info = statusMap[status] || {
      label: status,
      className: "bg-slate-100 text-slate-800",
    };

    return <Badge className={status_info.className}>{status_info.label}</Badge>;
  };

  const getBenefitTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      basic_basket: "Cesta Básica",
      hygiene_kit: "Kit de Higiene",
      blanket: "Cobertor",
      mattress: "Colchão",
      clothing: "Roupa",
      emergency_housing: "Moradia Emergencial",
      other: "Outro",
    };

    return typeMap[type] || type;
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Benefício</DialogTitle>
          <DialogDescription>
            Protocolo: {benefit.protocol_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Data da Solicitação
              </h3>
              <p>
                {format(new Date(benefit.request_date), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p>{getBenefitStatusBadge(benefit.status)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tipo de Benefício
              </h3>
              <p>{getBenefitTypeLabel(benefit.benefit_type)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                ID do Cidadão
              </h3>
              <p>{benefit.citizen_id}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Motivo da Solicitação
            </h3>
            <p className="mt-1 whitespace-pre-wrap">{benefit.reason}</p>
          </div>

          {benefit.comments && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Observações</h3>
              <p className="mt-1 whitespace-pre-wrap">{benefit.comments}</p>
            </div>
          )}

          {benefit.status === "completed" && benefit.delivery_date && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dados da Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Data de Entrega
                    </h4>
                    <p>
                      {format(new Date(benefit.delivery_date), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  {benefit.responsible_id && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Responsável pela Entrega
                      </h4>
                      <p>{benefit.responsible_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Anexos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {attachments.map((attachment) => (
                    <Card key={attachment.id}>
                      <CardHeader className="p-3">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <CardTitle className="text-sm truncate">
                            {attachment.file_name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {formatBytes(attachment.file_size)}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <a
                              href={`${process.env.SUPABASE_URL}/storage/v1/object/public/tfd_documents/${attachment.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-full w-full items-center justify-center"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
