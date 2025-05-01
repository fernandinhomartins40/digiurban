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
import { PlusCircle, Search, Eye, Edit } from "lucide-react";
import { OccurrenceType, OccurrenceSeverity, Occurrence, OccurrencesRequestParams } from "@/types/education";
import { getStudents } from "@/services/education/students";
import { getSchools } from "@/services/education/schools";
import { Student, School } from "@/types/education";
import { format } from "date-fns";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import { DatePickerWithRange } from "./components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface OccurrencesListProps {
  occurrences: Occurrence[];
  loading: boolean;
  onSearch: (params: OccurrencesRequestParams) => void;
  onCreateOccurrence: () => void;
  onEditOccurrence: (occurrence: Occurrence) => void;
  onViewOccurrence: (occurrence: Occurrence) => void;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function OccurrencesList({ 
  occurrences, 
  loading, 
  onSearch, 
  onCreateOccurrence,
  onEditOccurrence,
  onViewOccurrence,
  totalItems,
  currentPage,
  onPageChange
}: OccurrencesListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedType, setSelectedType] = useState<OccurrenceType | "">("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  const fetchStudents = async () => {
    try {
      const result = await getStudents();
      setStudents(result.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      const result = await getSchools();
      setSchools(result.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleSearch = () => {
    const params: OccurrencesRequestParams = {};
    
    if (selectedStudentId) {
      params.studentId = selectedStudentId;
    }
    
    if (selectedSchoolId) {
      params.schoolId = selectedSchoolId;
    }
    
    if (selectedType) {
      params.occurrenceType = selectedType;
    }
    
    if (date?.from) {
      params.startDate = format(date.from, 'yyyy-MM-dd');
    }
    
    if (date?.to) {
      params.endDate = format(date.to, 'yyyy-MM-dd');
    }
    
    onSearch(params);
  };

  const handleClearFilters = () => {
    setSelectedStudentId("");
    setSelectedSchoolId("");
    setSelectedType("");
    setDate({
      from: undefined,
      to: undefined
    });
    onSearch({});
  };

  // Format occurrence type for display
  const formatOccurrenceType = (type: OccurrenceType): string => {
    const types = {
      discipline: "Disciplina",
      health: "Saúde",
      performance: "Desempenho",
      absence: "Ausência",
      achievement: "Conquista",
      other: "Outro"
    };
    return types[type] || type;
  };

  // Format severity for display
  const formatSeverity = (severity: OccurrenceSeverity | undefined): string => {
    if (!severity) return "Não especificada";
    
    const severities = {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    };
    return severities[severity] || severity;
  };

  // Get severity badge variant
  const getSeverityBadgeVariant = (severity: OccurrenceSeverity | undefined) => {
    if (!severity) return "bg-gray-50 text-gray-700 border-gray-200";
    
    switch (severity) {
      case 'low':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'medium':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'high':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="student">Aluno</Label>
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger id="student">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
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

        <div>
          <Label htmlFor="type">Tipo de Ocorrência</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as OccurrenceType | "")}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="discipline">Disciplina</SelectItem>
              <SelectItem value="health">Saúde</SelectItem>
              <SelectItem value="performance">Desempenho</SelectItem>
              <SelectItem value="absence">Ausência</SelectItem>
              <SelectItem value="achievement">Conquista</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Período</Label>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
        <div className="flex gap-2">
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>
        <Button onClick={onCreateOccurrence}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Ocorrência
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Severidade</TableHead>
              <TableHead>Notificação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Carregando ocorrências...
                </TableCell>
              </TableRow>
            ) : occurrences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhuma ocorrência encontrada.
                </TableCell>
              </TableRow>
            ) : (
              occurrences.map((occurrence) => (
                <TableRow key={occurrence.id}>
                  <TableCell>{format(new Date(occurrence.occurrenceDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <div className="font-medium">{occurrence.studentId}</div>
                  </TableCell>
                  <TableCell>{formatOccurrenceType(occurrence.occurrenceType)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{occurrence.subject || "—"}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityBadgeVariant(occurrence.severity)}>
                      {formatSeverity(occurrence.severity)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {occurrence.parentNotified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Notificado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onViewOccurrence(occurrence)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditOccurrence(occurrence)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent 
        currentPage={currentPage} 
        totalCount={totalItems} 
        pageSize={10} 
        onPageChange={onPageChange}
      />
    </div>
  );
}
