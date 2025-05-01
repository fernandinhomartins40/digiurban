
import React, { useState, useEffect } from "react";
import { Plus, Edit, Search, FilterX, School, User } from "lucide-react";
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
import { getStudentTransports } from "@/services/education/transport";
import { StudentTransport, TransportStatus } from "@/types/education";
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import StudentTransportDialog from "./StudentTransportDialog";

export default function StudentTransportTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transports, setTransports] = useState<StudentTransport[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<StudentTransport | null>(null);
  
  // Filters
  const [studentNameFilter, setStudentNameFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransportStatus | "all">("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const fetchTransports = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      
      if (schoolFilter) {
        filters.schoolId = schoolFilter;
      }
      
      if (statusFilter && statusFilter !== "all") {
        filters.status = statusFilter;
      }
      
      const result = await getStudentTransports(filters);
      
      // Filter by student name if provided (client-side filtering since the API doesn't support it)
      let filteredTransports = [...result];
      if (studentNameFilter && studentNameFilter.trim() !== "") {
        filteredTransports = filteredTransports.filter(transport => 
          transport.studentInfo?.name.toLowerCase().includes(studentNameFilter.toLowerCase())
        );
      }
      
      setTransports(filteredTransports);
    } catch (error) {
      console.error("Error fetching student transports:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os transportes de alunos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    fetchTransports();
  };

  const handleResetFilters = () => {
    setStudentNameFilter("");
    setSchoolFilter("");
    setStatusFilter("all");
    setPage(1);
    fetchTransports();
  };

  const handleTransportCreated = () => {
    fetchTransports();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Transporte de aluno cadastrado com sucesso",
    });
  };

  const handleTransportUpdated = () => {
    fetchTransports();
    setDialogOpen(false);
    setEditingTransport(null);
    toast({
      title: "Sucesso",
      description: "Transporte de aluno atualizado com sucesso",
    });
  };

  const openEditDialog = (transport: StudentTransport) => {
    setEditingTransport(transport);
    setDialogOpen(true);
  };
  
  // Calculate paginated data
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedTransports = transports.slice(start, end);
  const totalCount = transports.length;
  
  // Status badge renderer
  const renderStatusBadge = (status: TransportStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Alunos no Transporte Escolar</h2>
        <Button onClick={() => {
          setEditingTransport(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Aluno
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
              <label className="text-sm font-medium">Nome do Aluno</label>
              <Input 
                placeholder="Nome do aluno" 
                value={studentNameFilter}
                onChange={(e) => setStudentNameFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Escola</label>
              <Input 
                placeholder="Nome ou ID da escola" 
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={(value: TransportStatus | "all") => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
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
      ) : paginatedTransports.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Aluno</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>Local de Embarque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransports.map((transport) => (
                  <TableRow key={transport.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <User size={16} className="text-muted-foreground" />
                      {transport.studentInfo?.name || "Aluno não identificado"}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <School size={16} className="text-muted-foreground" />
                      {transport.schoolInfo?.name || "Escola não identificada"}
                    </TableCell>
                    <TableCell>{transport.routeId}</TableCell>
                    <TableCell>{transport.pickupLocation}</TableCell>
                    <TableCell>
                      {renderStatusBadge(transport.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(transport)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
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
          <h3 className="mt-2 text-lg font-medium">Nenhum aluno no transporte encontrado</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos registros de alunos no transporte com os critérios especificados.
          </p>
        </div>
      )}
      
      <StudentTransportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transport={editingTransport}
        onCreated={handleTransportCreated}
        onUpdated={handleTransportUpdated}
      />
    </div>
  );
}
