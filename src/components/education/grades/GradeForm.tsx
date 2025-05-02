
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StudentGrade } from "@/services/education/grades";

interface GradeFormProps {
  classId?: string;
  subject?: string;
  period?: string;
  students: {
    id: string;
    name: string;
  }[];
  onSubmit: (grades: Omit<StudentGrade, 'id' | 'created_at' | 'updated_at'>[]) => void;
  onCancel: () => void;
}

export function GradeForm({
  classId,
  subject,
  period,
  students,
  onSubmit,
  onCancel
}: GradeFormProps) {
  // Form state
  const [selectedSubject, setSelectedSubject] = useState(subject || "");
  const [selectedPeriod, setSelectedPeriod] = useState(period || "");
  const [formState, setFormState] = useState(
    students.map(student => ({
      student_id: student.id,
      student_name: student.name,
      grade: 0,
      absence_days: 0,
      comments: "",
    }))
  );
  
  const handleGradeChange = (index: number, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    
    setFormState(prev => {
      const newState = [...prev];
      newState[index] = { 
        ...newState[index], 
        grade: Math.min(10, Math.max(0, numericValue)) 
      };
      return newState;
    });
  };
  
  const handleAbsenceChange = (index: number, value: string) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue)) return;
    
    setFormState(prev => {
      const newState = [...prev];
      newState[index] = { 
        ...newState[index], 
        absence_days: Math.max(0, numericValue) 
      };
      return newState;
    });
  };
  
  const handleCommentsChange = (index: number, value: string) => {
    setFormState(prev => {
      const newState = [...prev];
      newState[index] = { ...newState[index], comments: value };
      return newState;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedPeriod || !classId) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    // Prepare grades data for submission
    const gradesToSubmit = formState.map(studentGrade => ({
      student_id: studentGrade.student_id,
      student_name: studentGrade.student_name,
      class_id: classId,
      subject: selectedSubject,
      grade: studentGrade.grade,
      period: selectedPeriod,
      school_year: new Date().getFullYear(),
      absence_days: studentGrade.absence_days,
      attendance_days: 40, // Placeholder value
      comments: studentGrade.comments,
      created_by: "current-user-id", // Placeholder, should come from auth context
    }));
    
    onSubmit(gradesToSubmit);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lançamento de Notas</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                  <SelectItem value="Ciências">Ciências</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                  <SelectItem value="Inglês">Inglês</SelectItem>
                  <SelectItem value="Arte">Arte</SelectItem>
                  <SelectItem value="Educação Física">Educação Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1º Bimestre">1º Bimestre</SelectItem>
                  <SelectItem value="2º Bimestre">2º Bimestre</SelectItem>
                  <SelectItem value="3º Bimestre">3º Bimestre</SelectItem>
                  <SelectItem value="4º Bimestre">4º Bimestre</SelectItem>
                  <SelectItem value="Recuperação">Recuperação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Alunos</h3>
            <div className="space-y-6">
              {formState.map((student, index) => (
                <div key={student.student_id} className="grid grid-cols-12 gap-4 pb-4 border-b last:border-0">
                  <div className="col-span-6">
                    <Label>Aluno</Label>
                    <div className="font-medium mt-2">{student.student_name}</div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`grade-${student.student_id}`}>Nota</Label>
                    <Input
                      id={`grade-${student.student_id}`}
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={student.grade}
                      onChange={(e) => handleGradeChange(index, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`absence-${student.student_id}`}>Faltas</Label>
                    <Input
                      id={`absence-${student.student_id}`}
                      type="number"
                      min={0}
                      value={student.absence_days}
                      onChange={(e) => handleAbsenceChange(index, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-12">
                    <Label htmlFor={`comments-${student.student_id}`}>Observações</Label>
                    <Textarea
                      id={`comments-${student.student_id}`}
                      value={student.comments}
                      onChange={(e) => handleCommentsChange(index, e.target.value)}
                      className="mt-1"
                      placeholder="Observações sobre o desempenho do aluno"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Notas
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
