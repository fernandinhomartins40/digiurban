
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { TransportRequest } from "@/types/education";
import { updateTransportRequestStatus } from "@/services/education";
import { toast } from "@/hooks/use-toast";
import { Bus, Calendar, MapPin, User, School, CheckCircle, XCircle } from "lucide-react";

interface TransportRequestListProps {
  requests: TransportRequest[];
  onStatusChange: () => void;
}

export function TransportRequestList({ requests, onStatusChange }: TransportRequestListProps) {
  const [selectedRequest, setSelectedRequest] = React.useState<TransportRequest | null>(null);
  
  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateTransportRequestStatus(id, status);
      toast({
        title: status === 'approved' ? "Solicitação aprovada" : "Solicitação rejeitada",
        description: `A solicitação foi ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });
      setSelectedRequest(null);
      onStatusChange();
    } catch (error) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} request:`, error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Ocorreu um erro ao ${status === 'approved' ? 'aprovar' : 'rejeitar'} a solicitação.`,
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatRequestType = (type: string) => {
    switch(type) {
      case 'new_route': return 'Nova Rota';
      case 'route_change': return 'Alteração de Rota';
      case 'special_needs': return 'Necessidades Especiais';
      case 'complaint': return 'Reclamação';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <div className={`h-2 ${
            request.status === 'pending' ? 'bg-yellow-500' : 
            request.status === 'approved' ? 'bg-green-500' : 
            'bg-red-500'
          }`} />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Protocolo: {request.protocol_number}</h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{request.student_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <School className="h-4 w-4" />
                    <span>{request.school_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{request.pickup_address || request.pickup_location}</span>
                </div>
              </div>
              
              <div className="flex gap-2 self-end md:self-auto">
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                  Detalhes
                </Button>
                {request.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Protocolo:</div>
                <div className="col-span-3">{selectedRequest.protocol_number}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">{getStatusBadge(selectedRequest.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Aluno:</div>
                <div className="col-span-3">{selectedRequest.student_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Escola:</div>
                <div className="col-span-3">{selectedRequest.school_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Tipo:</div>
                <div className="col-span-3">{formatRequestType(selectedRequest.request_type)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Solicitante:</div>
                <div className="col-span-3">{selectedRequest.requester_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Contato:</div>
                <div className="col-span-3">{selectedRequest.requester_contact}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Embarque:</div>
                <div className="col-span-3">{selectedRequest.pickup_address || selectedRequest.pickup_location}</div>
              </div>
              {selectedRequest.return_location && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Retorno:</div>
                  <div className="col-span-3">{selectedRequest.return_location}</div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Data:</div>
                <div className="col-span-3">{formatDate(selectedRequest.created_at)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Descrição:</div>
                <div className="col-span-3">{selectedRequest.description}</div>
              </div>
              {selectedRequest.resolution_notes && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Resolução:</div>
                  <div className="col-span-3">{selectedRequest.resolution_notes}</div>
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedRequest.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
