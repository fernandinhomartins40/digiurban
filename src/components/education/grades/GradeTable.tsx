
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StudentGrade } from "@/services/education/grades";

interface GradeTableProps {
  grades: StudentGrade[];
  editable?: boolean;
  onSave?: (updatedGrades: StudentGrade[]) => void;
}

export function GradeTable({ grades, editable = false, onSave }: GradeTableProps) {
  const [editableGrades, setEditableGrades] = useState<StudentGrade[]>(grades);
  const [editing, setEditing] = useState(false);

  const handleGradeChange = (id: string, value: string) => {
    if (!editing) return;
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    
    setEditableGrades(prev => 
      prev.map(grade => 
        grade.id === id ? { ...grade, grade: Math.min(10, Math.max(0, numericValue)) } : grade
      )
    );
  };

  const handleAbsenceChange = (id: string, value: string) => {
    if (!editing) return;
    
    const numericValue = parseInt(value);
    if (isNaN(numericValue)) return;
    
    setEditableGrades(prev => 
      prev.map(grade => 
        grade.id === id ? { ...grade, absence_days: Math.max(0, numericValue) } : grade
      )
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableGrades);
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditableGrades(grades);
    setEditing(false);
  };

  // Group grades by student name for better organization
  const studentGroups = editableGrades.reduce((acc, grade) => {
    if (!acc[grade.student_name || grade.student_id]) {
      acc[grade.student_name || grade.student_id] = [];
    }
    acc[grade.student_name || grade.student_id].push(grade);
    return acc;
  }, {} as Record<string, StudentGrade[]>);

  return (
    <div>
      {editable && (
        <div className="flex justify-end mb-4 space-x-2">
          {!editing ? (
            <Button onClick={handleEdit}>Editar Notas</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar Notas</Button>
            </>
          )}
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Aluno</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Período</TableHead>
              <TableHead className="text-center">Nota</TableHead>
              <TableHead className="text-center">Faltas</TableHead>
              <TableHead className="text-center">Freq. (%)</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(studentGroups).map(([studentName, studentGrades]) => (
              <React.Fragment key={studentName}>
                {studentGrades.map((grade, index) => (
                  <TableRow key={grade.id}>
                    {index === 0 ? (
                      <TableCell rowSpan={studentGrades.length} className="font-medium align-top border-r">
                        {studentName}
                      </TableCell>
                    ) : null}
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>{grade.period}</TableCell>
                    <TableCell className="text-center">
                      {editing && editable ? (
                        <Input 
                          type="number" 
                          min={0} 
                          max={10} 
                          step={0.1}
                          value={grade.grade} 
                          onChange={(e) => handleGradeChange(grade.id, e.target.value)}
                          className="w-16 mx-auto text-center"
                        />
                      ) : (
                        <Badge variant={grade.grade >= 7 ? "default" : "destructive"}>
                          {grade.grade.toFixed(1)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editing && editable ? (
                        <Input 
                          type="number" 
                          min={0}
                          value={grade.absence_days} 
                          onChange={(e) => handleAbsenceChange(grade.id, e.target.value)}
                          className="w-16 mx-auto text-center"
                        />
                      ) : (
                        grade.absence_days
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {grade.attendance_days ? 
                        (((grade.attendance_days - grade.absence_days) / grade.attendance_days) * 100).toFixed(0) : 
                        "N/A"
                      }%
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">
                      {grade.comments}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
