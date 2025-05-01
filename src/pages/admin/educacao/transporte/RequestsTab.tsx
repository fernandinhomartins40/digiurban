
import React, { useState, useEffect } from "react";
import { Plus, Edit, Search, FilterX, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransportRequests } from "@/services/education/transport";
import { TransportRequest, TransportRequestType, TransportRequestStatus } from "@/types/education";
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import RequestDialog from "./RequestDialog";

export default function RequestsTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<TransportRequest | null>(null);
  
  // Filters
  const [protocolFilter, setProtocolFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransportRequestType | "">("");
  const [statusFilter, setStatusFilter] = useState<TransportRequestStatus | "">("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      
      if (typeFilter) {
        filters.requestType = typeFilter;
      }
      
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      const result = await getTransportRequests(filters);
      
      // Filter by protocol number if provided (client-side filtering)
      let filteredRequests = [...result];
      if (protocolFilter && protocolFilter.trim() !== "") {
        filteredRequests = filteredRequests.filter(request => 
          request.protocolNumber.toLowerCase().includes(protocolFilter.toLowerCase())
        );
      }
      
      setRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching transport requests:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações de transporte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    fetchRequests();
  };

  const handleResetFilters = () => {
    setProtocolFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setPage(1);
    fetchRequests();
  };

  const handleRequestCreated = () => {
    fetchRequests();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Solicitação de transporte criada com sucesso",
    });
  };

  const handleRequestUpdated = () => {
    fetchRequests();
    setDialogOpen(false);
    setEditingRequest(null);
    toast({
      title: "Sucesso",
      description: "Solicitação de transporte atualizada com sucesso",
    });
  };

  const openEditDialog = (request: TransportRequest) => {
    setEditingRequest(request);
    setDialogOpen(true);
  };
  
  // Calculate paginated data
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRequests = requests.slice(start, end);
  const totalCount = requests.length;
  
  // Render request type badge
  const renderTypeLabel = (type: TransportRequestType) => {
    switch (type) {
      case 'new': return 'Nova Solicitação';
      case 'change': return 'Alteração';
      case 'complaint': return 'Reclamação';
      case 'cancellation': return 'Cancelamento';
      default: return type;
    }
  };
  
  // Render request type badge
  const renderTypeBadge = (type: TransportRequestType) => {
    switch (type) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Nova Solicitação</Badge>;
      case 'change':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Alteração</Badge>;
      case 'complaint':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">Reclamação</Badge>;
      case 'cancellation':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelamento</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  // Status badge renderer
  const renderStatusBadge = (status: TransportRequestStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-yellow-500" />
            <span className="text-yellow-700">Pendente</span>
          </div>
        );
      case 'in_analysis':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle size={14} className="text-blue-500" />
            <span className="text-blue-700">Em Análise</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-green-700">Aprovada</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1">
            <XCircle size={14} className="text-red-500" />
            <span className="text-red-700">Rejeitada</span>
          </div>
        );
      case 'resolved':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-green-700">Resolvida</span>
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Solicitações de Transporte</h2>
        <Button onClick={() => {
          setEditingRequest(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Protocolo</label>
              <Input 
                placeholder="Número de protocolo" 
                value={protocolFilter}
                onChange={(e) => setProtocolFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={typeFilter} 
                onValueChange={(value: TransportRequestType | "") => setTypeFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="new">Nova Solicitação</SelectItem>
                  <SelectItem value="change">Alteração</SelectItem>
                  <SelectItem value="complaint">Reclamação</SelectItem>
                  <SelectItem value="cancellation">Cancelamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={(value: TransportRequestStatus | "") => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_analysis">Em Análise</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="resolved">Resolvida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : paginatedRequests.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.protocolNumber}</TableCell>
                    <TableCell>{renderTypeBadge(request.requestType)}</TableCell>
                    <TableCell>{request.requesterName}</TableCell>
                    <TableCell>{request.requesterContact}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {renderStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(request)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <PaginationComponent
              currentPage={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h3 className="mt-2 text-lg font-medium">Nenhuma solicitação encontrada</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos solicitações de transporte com os critérios especificados.
          </p>
        </div>
      )}
      
      <RequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        request={editingRequest}
        onCreated={handleRequestCreated}
        onUpdated={handleRequestUpdated}
      />
    </div>
  );
}
