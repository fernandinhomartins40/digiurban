
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { createEnrollment } from "@/services/education/enrollment";
import { getStudents } from "@/services/education/students";
import { getSchools } from "@/services/education/schools";
import { Student, School, EnrollmentStatus } from "@/types/education";
import { checkStudentEnrollment } from "@/services/education/enrollment";
import { cn } from "@/lib/utils";

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export default function EnrollmentDialog({
  open,
  onOpenChange,
  onSaved,
}: EnrollmentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [validating, setValidating] = useState(false);
  
  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [requestDate, setRequestDate] = useState<Date>(new Date());
  const [specialRequest, setSpecialRequest] = useState("");
  const [hasSpecialRequest, setHasSpecialRequest] = useState(false);
  const [notes, setNotes] = useState("");
  const currentYear = new Date().getFullYear();

  // Student validation
  const [studentAlreadyEnrolled, setStudentAlreadyEnrolled] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStudents();
      fetchSchools();
      resetForm();
    }
  }, [open]);

  // Check if student is already enrolled when a student is selected
  useEffect(() => {
    if (selectedStudentId) {
      validateStudentEnrollment();
    } else {
      setStudentAlreadyEnrolled(false);
    }
  }, [selectedStudentId]);

  const fetchStudents = async () => {
    try {
      const result = await getStudents({ isActive: true });
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
      const result = await getSchools({ isActive: true });
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

  const validateStudentEnrollment = async () => {
    if (!selectedStudentId) return;
    
    setValidating(true);
    try {
      const isEnrolled = await checkStudentEnrollment(selectedStudentId, currentYear);
      setStudentAlreadyEnrolled(isEnrolled);
      
      if (isEnrolled) {
        toast({
          title: "Aluno já matriculado",
          description: `Este aluno já possui uma matrícula para o ano letivo ${currentYear}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking student enrollment:", error);
    } finally {
      setValidating(false);
    }
  };

  const resetForm = () => {
    setSelectedStudentId("");
    setSelectedSchoolId("");
    setRequestDate(new Date());
    setSpecialRequest("");
    setHasSpecialRequest(false);
    setNotes("");
    setStudentAlreadyEnrolled(false);
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
    
    if (studentAlreadyEnrolled) {
      toast({
        title: "Erro",
        description: `Este aluno já possui uma matrícula para o ano letivo ${currentYear}.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const enrollmentData = {
        studentId: selectedStudentId,
        requestedSchoolId: selectedSchoolId,
        schoolYear: currentYear,
        status: "pending" as EnrollmentStatus,
        requestDate: requestDate.toISOString(),
        specialRequest: hasSpecialRequest ? specialRequest : undefined,
        notes: notes || undefined
      };

      await createEnrollment(enrollmentData);
      toast({
        title: "Matrícula solicitada",
        description: "A solicitação de matrícula foi registrada com sucesso",
      });
      
      onSaved();
    } catch (error) {
      console.error("Error creating enrollment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a solicitação de matrícula",
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
          <DialogTitle>Nova Solicitação de Matrícula</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Aluno*</Label>
            <Select 
              value={selectedStudentId} 
              onValueChange={setSelectedStudentId}
              disabled={validating}
              required
            >
              <SelectTrigger id="studentId">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.registrationNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {studentAlreadyEnrolled && (
              <p className="text-sm text-red-500">
                Este aluno já possui uma matrícula para o ano letivo {currentYear}.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolId">Escola Solicitada*</Label>
            <Select 
              value={selectedSchoolId} 
              onValueChange={setSelectedSchoolId}
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

          <div className="space-y-2">
            <Label htmlFor="requestDate">Data da Solicitação*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="requestDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !requestDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestDate ? format(requestDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={requestDate}
                  onSelect={(date) => date && setRequestDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasSpecialRequest"
                checked={hasSpecialRequest}
                onCheckedChange={setHasSpecialRequest}
              />
              <Label htmlFor="hasSpecialRequest">Possui necessidades especiais ou requerimentos específicos</Label>
            </div>
            
            {hasSpecialRequest && (
              <div className="pt-2">
                <Textarea
                  placeholder="Descreva as necessidades especiais ou requerimentos específicos"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais sobre a matrícula"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || validating || studentAlreadyEnrolled}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Solicitar Matrícula"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
