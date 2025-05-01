
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
import { PlusCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSpecialDiets } from "@/services/education/meals";
import { SpecialDiet } from "@/types/education";
import { getStudents } from "@/services/education/students";
import { Student } from "@/types/education";
import DietDialog from "./dialogs/DietDialog";
import { getSchools } from "@/services/education/schools";
import { School } from "@/types/education";
import PaginationComponent from "@/components/educacao/PaginationComponent";

export default function DietsTab() {
  const { toast } = useToast();
  const [diets, setDiets] = useState<SpecialDiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDiet, setEditDiet] = useState<SpecialDiet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Load students and schools when component mounts
  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  // Load diets when student selection changes
  useEffect(() => {
    if (selectedStudent) {
      fetchDiets(selectedStudent);
    } else {
      setDiets([]);
    }
  }, [selectedStudent, page]);

  const fetchStudents = async () => {
    try {
      const result = await getStudents();
      setStudents(result.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de alunos",
        variant: "destructive",
      });
    }
  };

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

  const fetchDiets = async (studentId: string) => {
    setLoading(true);
    try {
      const result = await getSpecialDiets(studentId);
      setDiets(result);
      setTotalItems(result.length);
    } catch (error) {
      console.error("Error fetching diets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as dietas especiais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiet = () => {
    setEditDiet(null);
    setDialogOpen(true);
  };

  const handleEditDiet = (diet: SpecialDiet) => {
    setEditDiet(diet);
    setDialogOpen(true);
  };

  const handleDietSaved = () => {
    setDialogOpen(false);
    if (selectedStudent) {
      fetchDiets(selectedStudent);
    }
  };

  const handleSearch = () => {
    // Filter students by name and then select the first one
    if (searchTerm) {
      const foundStudent = students.find(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (foundStudent) {
        setSelectedStudent(foundStudent.id);
      } else {
        toast({
          title: "Aluno não encontrado",
          description: "Nenhum aluno encontrado com esse nome",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Get school name by ID
  const getSchoolName = (schoolId: string): string => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : "Escola não encontrada";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Label htmlFor="student">Aluno</Label>
            <Select
              value={selectedStudent}
              onValueChange={setSelectedStudent}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Label htmlFor="search">Buscar Aluno</Label>
            <div className="flex gap-2">
              <Input 
                id="search" 
                placeholder="Nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <Button 
            onClick={handleCreateDiet} 
            disabled={!selectedStudent}
            className="ml-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Dieta Especial
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Dieta</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Restrições</TableHead>
              <TableHead>Documentação Médica</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando dietas especiais...
                </TableCell>
              </TableRow>
            ) : diets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  {selectedStudent 
                    ? "Nenhuma dieta especial encontrada para este aluno." 
                    : "Selecione um aluno para visualizar suas dietas especiais."
                  }
                </TableCell>
              </TableRow>
            ) : (
              diets
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((diet) => (
                <TableRow key={diet.id}>
                  <TableCell>{diet.dietType}</TableCell>
                  <TableCell>{getSchoolName(diet.schoolId)}</TableCell>
                  <TableCell>
                    {diet.restrictions.join(", ")}
                  </TableCell>
                  <TableCell>
                    {diet.medicalDocumentation ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Sim
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Não
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {diet.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inativa
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => handleEditDiet(diet)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {diets.length > 0 && (
        <PaginationComponent 
          currentPage={page} 
          totalItems={totalItems} 
          pageSize={itemsPerPage} 
          onPageChange={setPage}
        />
      )}

      <DietDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={students.find(s => s.id === selectedStudent)}
        schools={schools}
        diet={editDiet}
        onSaved={handleDietSaved}
      />
    </div>
  );
}
