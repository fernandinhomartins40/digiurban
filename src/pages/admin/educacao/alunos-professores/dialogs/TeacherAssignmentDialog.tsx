
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignTeacherToSchool, assignTeacherToClass } from "@/services/education/teachers";
import { getSchools } from "@/services/education/schools";
import { getClassesBySchool } from "@/services/education/classes";
import { Teacher, School, Class } from "@/types/education";
import { useToast } from "@/hooks/use-toast";

interface TeacherAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher;
  assignmentType: "school" | "class";
  onAssignmentCreated: () => void;
}

export default function TeacherAssignmentDialog({
  open,
  onOpenChange,
  teacher,
  assignmentType,
  onAssignmentCreated
}: TeacherAssignmentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  // School assignment form data
  const [schoolForm, setSchoolForm] = useState({
    schoolId: "",
    workload: 20,
    startDate: "",
    endDate: "",
    isActive: true
  });

  // Class assignment form data
  const [classForm, setClassForm] = useState({
    classId: "",
    subject: "",
    weeklyHours: 4,
    isActive: true
  });

  // Load schools and classes when dialog opens
  useEffect(() => {
    if (open) {
      fetchSchools();
      if (assignmentType === "class") {
        fetchAllClasses();
      }
    }
  }, [open, assignmentType]);

  // Filter classes by selected school
  useEffect(() => {
    if (selectedSchool) {
      const filtered = classes.filter(c => c.schoolId === selectedSchool);
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses([]);
    }
  }, [selectedSchool, classes]);

  const fetchSchools = async () => {
    setLoadingOptions(true);
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
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchAllClasses = async () => {
    setLoadingOptions(true);
    try {
      // Create an array to hold all fetched classes
      let allClasses: Class[] = [];
      
      // First fetch schools if needed
      if (schools.length === 0) {
        const schoolsResult = await getSchools({ isActive: true });
        
        // For each school, fetch its classes
        for (const school of schoolsResult.data) {
          const classesResult = await getClassesBySchool(school.id);
          if (classesResult.data) {
            allClasses = [...allClasses, ...classesResult.data];
          }
        }
      } else {
        // Use existing schools data
        for (const school of schools) {
          const classesResult = await getClassesBySchool(school.id);
          if (classesResult.data) {
            allClasses = [...allClasses, ...classesResult.data];
          }
        }
      }
      
      setClasses(allClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de turmas",
        variant: "destructive",
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSchoolFormChange = (field: string, value: any) => {
    setSchoolForm(prev => ({ ...prev, [field]: value }));
  };

  const handleClassFormChange = (field: string, value: any) => {
    setClassForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (assignmentType === "school") {
        await assignTeacherToSchool({
          teacherId: teacher.id,
          schoolId: schoolForm.schoolId,
          workload: schoolForm.workload,
          startDate: schoolForm.startDate,
          endDate: schoolForm.endDate || undefined,
          isActive: schoolForm.isActive,
        });
      } else {
        await assignTeacherToClass({
          teacherId: teacher.id,
          classId: classForm.classId,
          subject: classForm.subject,
          weeklyHours: classForm.weeklyHours,
          isActive: classForm.isActive,
        });
      }
      
      onAssignmentCreated();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Erro",
        description: `Não foi possível atribuir a ${assignmentType === "school" ? "escola" : "turma"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {assignmentType === "school" ? "Atribuir Escola" : "Atribuir Turma"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {assignmentType === "school" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="schoolId">Escola*</Label>
                <Select
                  value={schoolForm.schoolId}
                  onValueChange={(value) => handleSchoolFormChange("schoolId", value)}
                  disabled={loadingOptions}
                  required
                >
                  <SelectTrigger>
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
                <Label htmlFor="workload">Carga Horária (horas)*</Label>
                <Input
                  id="workload"
                  type="number"
                  value={schoolForm.workload}
                  onChange={(e) => handleSchoolFormChange("workload", parseInt(e.target.value, 10))}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início*</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={schoolForm.startDate}
                  onChange={(e) => handleSchoolFormChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término (opcional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={schoolForm.endDate}
                  onChange={(e) => handleSchoolFormChange("endDate", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="filterSchool">Filtrar por Escola</Label>
                <Select
                  value={selectedSchool}
                  onValueChange={setSelectedSchool}
                  disabled={loadingOptions}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as escolas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as escolas</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classId">Turma*</Label>
                <Select
                  value={classForm.classId}
                  onValueChange={(value) => handleClassFormChange("classId", value)}
                  disabled={loadingOptions}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedSchool ? filteredClasses : classes).map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name} ({classItem.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Disciplina*</Label>
                <Input
                  id="subject"
                  value={classForm.subject}
                  onChange={(e) => handleClassFormChange("subject", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyHours">Horas Semanais*</Label>
                <Input
                  id="weeklyHours"
                  type="number"
                  value={classForm.weeklyHours}
                  onChange={(e) => handleClassFormChange("weeklyHours", parseInt(e.target.value, 10))}
                  min={1}
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={assignmentType === "school" ? schoolForm.isActive : classForm.isActive}
              onCheckedChange={(checked) => {
                if (assignmentType === "school") {
                  handleSchoolFormChange("isActive", checked);
                } else {
                  handleClassFormChange("isActive", checked);
                }
              }}
            />
            <Label htmlFor="isActive">Ativo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || loadingOptions}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
