
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
import { getTeachers } from "@/services/education/teachers";
import { Teacher, PaginatedResponse } from "@/types/education";
import TeacherDialog from "./dialogs/TeacherDialog";
import TeacherDetailDialog from "./dialogs/TeacherDetailDialog";

export default function TeachersTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [registrationNumberFilter, setRegistrationNumberFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page,
        pageSize,
        name: nameFilter || undefined,
      };
      
      if (isActiveFilter !== "all") {
        const isActiveValue = isActiveFilter === "true";
        filters.isActive = isActiveValue;
      }
      
      const result: PaginatedResponse<Teacher> = await getTeachers(filters);
      
      setTeachers(result.data);
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os professores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, pageSize]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchTeachers();
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setRegistrationNumberFilter("");
    setIsActiveFilter("all");
    setPage(1);
    fetchTeachers();
  };

  const handleTeacherCreated = () => {
    fetchTeachers();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Professor cadastrado com sucesso",
    });
  };

  const handleTeacherUpdated = () => {
    fetchTeachers();
    setDialogOpen(false);
    setEditingTeacher(null);
    toast({
      title: "Sucesso",
      description: "Professor atualizado com sucesso",
    });
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setDialogOpen(true);
  };

  const openDetailDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDetailDialogOpen(true);
  };

  const formatHiringDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Professores da Rede Municipal</h2>
        <Button onClick={() => {
          setEditingTeacher(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Professor
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
              <label className="text-sm font-medium">Nome do Professor</label>
              <Input 
                placeholder="Nome do professor" 
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
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
      ) : teachers.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Data de Contratação</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Áreas de Ensino</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.registrationNumber}</TableCell>
                    <TableCell>{formatHiringDate(teacher.hiringDate)}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>
                      {teacher.teachingAreas.slice(0, 2).map((area, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">{area}</Badge>
                      ))}
                      {teacher.teachingAreas.length > 2 && 
                        <Badge variant="outline">+{teacher.teachingAreas.length - 2}</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {teacher.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openDetailDialog(teacher)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(teacher)}>
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
          <h3 className="mt-2 text-lg font-medium">Nenhum professor encontrado</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos professores com os critérios especificados.
          </p>
        </div>
      )}

      <TeacherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacher={editingTeacher}
        onCreated={handleTeacherCreated}
        onUpdated={handleTeacherUpdated}
      />

      <TeacherDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        teacher={selectedTeacher}
      />
    </div>
  );
}
