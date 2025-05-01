
import React, { useState, useEffect } from "react";
import { Plus, Search, FilterX, Edit, FileText } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import { getStudents, getStudentCurrentEnrollment } from "@/services/education/students";
import { Student, PaginatedResponse } from "@/types/education";
import StudentDialog from "./dialogs/StudentDialog";
import StudentDetailDialog from "./dialogs/StudentDetailDialog";

export default function StudentsTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [registrationNumberFilter, setRegistrationNumberFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page,
        pageSize,
        name: nameFilter || undefined,
        registrationNumber: registrationNumberFilter || undefined,
      };
      
      if (isActiveFilter !== "all") {
        const isActiveValue = isActiveFilter === "true";
        filters.isActive = isActiveValue;
      }
      
      const result: PaginatedResponse<Student> = await getStudents(filters);
      
      setStudents(result.data);
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alunos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchStudents();
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setRegistrationNumberFilter("");
    setIsActiveFilter("all");
    setPage(1);
    fetchStudents();
  };

  const handleStudentCreated = () => {
    fetchStudents();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Aluno cadastrado com sucesso",
    });
  };

  const handleStudentUpdated = () => {
    fetchStudents();
    setDialogOpen(false);
    setEditingStudent(null);
    toast({
      title: "Sucesso",
      description: "Aluno atualizado com sucesso",
    });
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const openDetailDialog = (student: Student) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  const formatBirthDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Alunos da Rede Municipal</h2>
        <Button onClick={() => {
          setEditingStudent(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Aluno
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
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Matrícula</label>
              <Input 
                placeholder="Número de matrícula" 
                value={registrationNumberFilter}
                onChange={(e) => setRegistrationNumberFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={isActiveFilter} 
                onValueChange={(value: string) => {
                  setIsActiveFilter(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
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
      ) : students.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{formatBirthDate(student.birthDate)}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>{student.parentPhone}</TableCell>
                    <TableCell>
                      {student.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openDetailDialog(student)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
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
          <h3 className="mt-2 text-lg font-medium">Nenhum aluno encontrado</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos alunos com os critérios especificados.
          </p>
        </div>
      )}

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
        onCreated={handleStudentCreated}
        onUpdated={handleStudentUpdated}
      />

      <StudentDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        student={selectedStudent}
      />
    </div>
  );
}
