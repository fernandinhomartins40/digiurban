import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getEnrollments } from "@/services/education/enrollment";
import { getSchools } from "@/services/education/schools";
import { Enrollment, School } from "@/types/education";
import { format } from "date-fns";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import EnrollmentDialog from "./dialogs/EnrollmentDialog";
import EnrollmentDetailDialog from "./dialogs/EnrollmentDetailDialog";

export default function PendingEnrollmentsTab() {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [protocolNumber, setProtocolNumber] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchSchools();
    fetchEnrollments();
  }, [page]);

  const fetchSchools = async () => {
    try {
      const result = await getSchools();
      setSchools(result.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de escolas",
        variant: "destructive",
      });
    }
  };

  const fetchEnrollments = async (params = {}) => {
    setLoading(true);
    try {
      const result = await getEnrollments({ 
        status: "pending",
        schoolYear: currentYear,
        page,
        pageSize: itemsPerPage,
        ...params
      });
      
      setEnrollments(result.data);
      setTotalItems(result.count);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as matrículas pendentes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params: Record<string, any> = {
      status: "pending",
      page: 1,
      schoolYear: currentYear
    };
    
    if (selectedSchoolId) {
      params.schoolId = selectedSchoolId;
    }
    
    if (protocolNumber) {
      // This would need a backend endpoint to search by protocol number
      // For now, we'll just filter client-side after fetching
    }
    
    fetchEnrollments(params);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedSchoolId("");
    setProtocolNumber("");
    fetchEnrollments({ status: "pending", page: 1, schoolYear: currentYear });
    setPage(1);
  };

  const handleCreateEnrollment = () => {
    setCreateDialogOpen(true);
  };

  const handleViewDetails = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDetailDialogOpen(true);
  };

  const handleEnrollmentSaved = () => {
    setCreateDialogOpen(false);
    fetchEnrollments({ status: "pending", page, schoolYear: currentYear });
  };

  const handleEnrollmentUpdated = () => {
    setDetailDialogOpen(false);
    fetchEnrollments({ status: "pending", page, schoolYear: currentYear });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="school">Escola</Label>
          <Select
            value={selectedSchoolId}
            onValueChange={setSelectedSchoolId}
          >
            <SelectTrigger id="school">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="protocol">Nº do Protocolo</Label>
          <div className="flex gap-2">
            <Input 
              id="protocol"
              placeholder="MATR-2023-000000"
              value={protocolNumber}
              onChange={(e) => setProtocolNumber(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar Filtros
        </Button>
        <Button onClick={handleCreateEnrollment}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Escola Solicitada</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Necessidades Especiais</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando matrículas...
                </TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Nenhuma matrícula pendente encontrada.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.protocolNumber}</TableCell>
                  <TableCell>
                    {enrollment.studentName || enrollment.studentId}
                  </TableCell>
                  <TableCell>
                    {enrollment.requestedSchoolName || enrollment.requestedSchoolId}
                  </TableCell>
                  <TableCell>{format(new Date(enrollment.requestDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {enrollment.specialRequest ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Sim
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Não
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(enrollment)}>
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent 
        currentPage={page} 
        totalCount={totalItems} 
        pageSize={itemsPerPage} 
        onPageChange={setPage}
      />

      <EnrollmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSaved={handleEnrollmentSaved}
      />

      <EnrollmentDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        enrollmentId={selectedEnrollment?.id}
        onUpdated={handleEnrollmentUpdated}
      />
    </div>
  );
}
