
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Predefined type for students with attendance data
interface StudentAttendance {
  student_id: string;
  student_name: string;
  present: boolean;
  justification?: string;
}

interface AttendanceSheetProps {
  classId: string;
  className?: string;
  students: {
    id: string;
    name: string;
  }[];
  onSave: (data: {
    classId: string;
    date: string;
    attendance: StudentAttendance[];
  }) => void;
}

export function AttendanceSheet({
  classId,
  className,
  students,
  onSave
}: AttendanceSheetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState<StudentAttendance[]>(
    students.map(student => ({
      student_id: student.id,
      student_name: student.name,
      present: true,
    }))
  );

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev =>
      prev.map(item =>
        item.student_id === studentId ? { ...item, present } : item
      )
    );
  };

  const handleJustificationChange = (studentId: string, justification: string) => {
    setAttendance(prev =>
      prev.map(item =>
        item.student_id === studentId ? { ...item, justification } : item
      )
    );
  };

  const handleSave = () => {
    if (!date) return;
    
    onSave({
      classId,
      date: format(date, 'yyyy-MM-dd'),
      attendance,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Chamada - {className || classId}</h3>
          <p className="text-sm text-muted-foreground">
            Registre a presença dos alunos
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm">Data:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-[200px]"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Salvar Chamada
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Presente</TableHead>
              <TableHead>Nome do Aluno</TableHead>
              <TableHead className="w-[300px]">Justificativa (se ausente)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((student) => (
              <TableRow key={student.student_id}>
                <TableCell>
                  <Checkbox
                    checked={student.present}
                    onCheckedChange={(checked) => 
                      handleAttendanceChange(student.student_id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {student.student_name}
                </TableCell>
                <TableCell>
                  {!student.present && (
                    <Input
                      placeholder="Motivo da ausência"
                      value={student.justification || ""}
                      onChange={(e) => handleJustificationChange(student.student_id, e.target.value)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Badge>
          Presentes: {attendance.filter(s => s.present).length} / {attendance.length}
        </Badge>
      </div>
    </div>
  );
}
