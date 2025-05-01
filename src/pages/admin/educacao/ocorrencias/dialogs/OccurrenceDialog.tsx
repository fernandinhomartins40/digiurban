
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createOccurrence, updateOccurrence } from "@/services/education/occurrences";
import { Occurrence, OccurrenceType, OccurrenceSeverity } from "@/types/education";
import { getStudents } from "@/services/education/students";
import { getSchools } from "@/services/education/schools";
import { Student, School, Class } from "@/types/education";
import { getClassesBySchool } from "@/services/education/classes";
import { cn } from "@/lib/utils";

interface OccurrenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  occurrence: Occurrence | null;
  onSaved: () => void;
}

export default function OccurrenceDialog({
  open,
  onOpenChange,
  occurrence,
  onSaved,
}: OccurrenceDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  // Form fields
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const [occurrenceType, setOccurrenceType] = useState<OccurrenceType>("discipline");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<OccurrenceSeverity>("medium");
  const [occurrenceDate, setOccurrenceDate] = useState<Date | undefined>(new Date());
  const [reportedByName, setReportedByName] = useState("");
  const [resolution, setResolution] = useState("");
  
  const isEditing = !!occurrence;

  // Load data when component mounts
  useEffect(() => {
    if (open) {
      fetchStudents();
      fetchSchools();
      
      // If editing, populate form with occurrence data
      if (isEditing && occurrence) {
        setSelectedStudentId(occurrence.studentId);
        setSelectedSchoolId(occurrence.schoolId);
        setSelectedClassId(occurrence.classId);
        setOccurrenceType(occurrence.occurrenceType);
        setSubject(occurrence.subject || "");
        setDescription(occurrence.description);
        setSeverity(occurrence.severity || "medium");
        setOccurrenceDate(occurrence.occurrenceDate ? new Date(occurrence.occurrenceDate) : new Date());
        setReportedByName(occurrence.reportedByName);
        setResolution(occurrence.resolution || "");
        
        // Load classes for the selected school
        if (occurrence.schoolId) {
          fetchClasses(occurrence.schoolId);
        }
      } else {
        // Reset form for new occurrence
        resetForm();
      }
    }
  }, [open, occurrence]);

  // Load classes when school selection changes
  useEffect(() => {
    if (selectedSchoolId) {
      fetchClasses(selectedSchoolId);
    } else {
      setClasses([]);
      setSelectedClassId(undefined);
    }
  }, [selectedSchoolId]);

  const fetchStudents = async () => {
    setDataLoading(true);
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
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSchools = async () => {
    setDataLoading(true);
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
    } finally {
      setDataLoading(false);
    }
  };

  const fetchClasses = async (schoolId: string) => {
    setDataLoading(true);
    try {
      const result = await getClassesBySchool(schoolId);
      setClasses(result.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de turmas",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudentId("");
    setSelectedSchoolId("");
    setSelectedClassId(undefined);
    setOccurrenceType("discipline");
    setSubject("");
    setDescription("");
    setSeverity("medium");
    setOccurrenceDate(new Date());
    setReportedByName("");
    setResolution("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudentId) {
      toast({
        title: "Erro",
        description: "Selecione um aluno",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSchoolId) {
      toast({
        title: "Erro",
        description: "Selecione uma escola",
        variant: "destructive",
      });
      return;
    }
    
    if (!occurrenceDate) {
      toast({
        title: "Erro",
        description: "Informe a data da ocorrência",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const occurrenceData = {
        studentId: selectedStudentId,
        schoolId: selectedSchoolId,
        classId: selectedClassId,
        occurrenceType,
        subject: subject || undefined,
        description,
        severity,
        reportedBy: "", // Will be populated by backend with current user ID
        reportedByName,
        occurrenceDate: occurrenceDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        resolution: resolution || undefined,
        resolvedBy: undefined,
        resolutionDate: undefined,
        parentNotified: false,
        parentNotificationDate: undefined
      };

      if (isEditing && occurrence) {
        // For updates, we only need to pass the fields that changed
        const updateData = {
          subject: subject || undefined,
          description,
          severity,
          resolution: resolution || undefined
        };
        
        await updateOccurrence(occurrence.id, updateData);
        toast({
          title: "Ocorrência atualizada",
          description: "As informações foram salvas com sucesso",
        });
      } else {
        await createOccurrence(occurrenceData);
        toast({
          title: "Ocorrência registrada",
          description: "A ocorrência foi registrada com sucesso",
        });
      }
      
      onSaved();
    } catch (error) {
      console.error("Error saving occurrence:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a ocorrência",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ocorrência" : "Nova Ocorrência"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Aluno*</Label>
              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={isEditing || dataLoading}
                required
              >
                <SelectTrigger id="studentId">
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

            <div className="space-y-2">
              <Label htmlFor="schoolId">Escola*</Label>
              <Select 
                value={selectedSchoolId} 
                onValueChange={setSelectedSchoolId}
                disabled={isEditing || dataLoading}
                required
              >
                <SelectTrigger id="schoolId">
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Turma</Label>
              <Select 
                value={selectedClassId} 
                onValueChange={setSelectedClassId}
                disabled={!selectedSchoolId || isEditing || dataLoading}
              >
                <SelectTrigger id="classId">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occurrenceDate">Data da Ocorrência*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !occurrenceDate && "text-muted-foreground"
                    )}
                    disabled={isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {occurrenceDate ? format(occurrenceDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={occurrenceDate}
                    onSelect={setOccurrenceDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occurrenceType">Tipo de Ocorrência*</Label>
              <Select 
                value={occurrenceType} 
                onValueChange={(value) => setOccurrenceType(value as OccurrenceType)}
                disabled={isEditing}
                required
              >
                <SelectTrigger id="occurrenceType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discipline">Disciplina</SelectItem>
                  <SelectItem value="health">Saúde</SelectItem>
                  <SelectItem value="performance">Desempenho</SelectItem>
                  <SelectItem value="absence">Ausência</SelectItem>
                  <SelectItem value="achievement">Conquista</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severidade*</Label>
              <Select 
                value={severity} 
                onValueChange={(value) => setSeverity(value as OccurrenceSeverity)}
                required
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto da ocorrência"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportedByName">Reportado por*</Label>
            <Input
              id="reportedByName"
              value={reportedByName}
              onChange={(e) => setReportedByName(e.target.value)}
              placeholder="Nome de quem reportou a ocorrência"
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution">Resolução</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder="Descrição da resolução ou medidas tomadas"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>{isEditing ? "Atualizar" : "Registrar"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
