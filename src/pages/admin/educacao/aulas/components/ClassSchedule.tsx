
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleSlot {
  subject?: string;
  teacher?: string;
  room?: string;
  time?: string;
  color?: string;
}

interface WeekSchedule {
  [key: string]: {
    [key: string]: ScheduleSlot;
  };
}

export function ClassSchedule() {
  const [selectedClass, setSelectedClass] = useState("5A");
  
  // Mock schedule data
  const schedules: Record<string, WeekSchedule> = {
    "5A": {
      "Segunda": {
        "07:30-08:20": { subject: "Matemática", teacher: "Maria Santos", room: "201", color: "bg-blue-100 border-blue-500" },
        "08:20-09:10": { subject: "Matemática", teacher: "Maria Santos", room: "201", color: "bg-blue-100 border-blue-500" },
        "09:10-10:00": { subject: "Português", teacher: "João Silva", room: "201", color: "bg-red-100 border-red-500" },
        "10:20-11:10": { subject: "Ciências", teacher: "Ana Ferreira", room: "203", color: "bg-green-100 border-green-500" },
        "11:10-12:00": { subject: "Ciências", teacher: "Ana Ferreira", room: "203", color: "bg-green-100 border-green-500" },
      },
      "Terça": {
        "07:30-08:20": { subject: "História", teacher: "Carlos Oliveira", room: "201", color: "bg-yellow-100 border-yellow-500" },
        "08:20-09:10": { subject: "História", teacher: "Carlos Oliveira", room: "201", color: "bg-yellow-100 border-yellow-500" },
        "09:10-10:00": { subject: "Geografia", teacher: "Luisa Mendes", room: "201", color: "bg-purple-100 border-purple-500" },
        "10:20-11:10": { subject: "Geografia", teacher: "Luisa Mendes", room: "201", color: "bg-purple-100 border-purple-500" },
        "11:10-12:00": { subject: "Inglês", teacher: "Fernanda Lima", room: "202", color: "bg-pink-100 border-pink-500" },
      },
      "Quarta": {
        "07:30-08:20": { subject: "Português", teacher: "João Silva", room: "201", color: "bg-red-100 border-red-500" },
        "08:20-09:10": { subject: "Português", teacher: "João Silva", room: "201", color: "bg-red-100 border-red-500" },
        "09:10-10:00": { subject: "Matemática", teacher: "Maria Santos", room: "201", color: "bg-blue-100 border-blue-500" },
        "10:20-11:10": { subject: "Ed. Física", teacher: "Roberto Almeida", room: "Quadra", color: "bg-orange-100 border-orange-500" },
        "11:10-12:00": { subject: "Ed. Física", teacher: "Roberto Almeida", room: "Quadra", color: "bg-orange-100 border-orange-500" },
      },
      "Quinta": {
        "07:30-08:20": { subject: "Artes", teacher: "Paula Soares", room: "204", color: "bg-indigo-100 border-indigo-500" },
        "08:20-09:10": { subject: "Artes", teacher: "Paula Soares", room: "204", color: "bg-indigo-100 border-indigo-500" },
        "09:10-10:00": { subject: "Português", teacher: "João Silva", room: "201", color: "bg-red-100 border-red-500" },
        "10:20-11:10": { subject: "Matemática", teacher: "Maria Santos", room: "201", color: "bg-blue-100 border-blue-500" },
        "11:10-12:00": { subject: "Matemática", teacher: "Maria Santos", room: "201", color: "bg-blue-100 border-blue-500" },
      },
      "Sexta": {
        "07:30-08:20": { subject: "Ciências", teacher: "Ana Ferreira", room: "203", color: "bg-green-100 border-green-500" },
        "08:20-09:10": { subject: "Ciências", teacher: "Ana Ferreira", room: "203", color: "bg-green-100 border-green-500" },
        "09:10-10:00": { subject: "História", teacher: "Carlos Oliveira", room: "201", color: "bg-yellow-100 border-yellow-500" },
        "10:20-11:10": { subject: "Geografia", teacher: "Luisa Mendes", room: "201", color: "bg-purple-100 border-purple-500" },
        "11:10-12:00": { subject: "Inglês", teacher: "Fernanda Lima", room: "202", color: "bg-pink-100 border-pink-500" },
      },
    },
    "6B": {
      "Segunda": {
        "07:30-08:20": { subject: "Geografia", teacher: "Luisa Mendes", room: "301", color: "bg-purple-100 border-purple-500" },
        "08:20-09:10": { subject: "Geografia", teacher: "Luisa Mendes", room: "301", color: "bg-purple-100 border-purple-500" },
        "09:10-10:00": { subject: "Matemática", teacher: "Rodrigo Pereira", room: "301", color: "bg-blue-100 border-blue-500" },
        "10:20-11:10": { subject: "Português", teacher: "Beatriz Costa", room: "301", color: "bg-red-100 border-red-500" },
        "11:10-12:00": { subject: "Português", teacher: "Beatriz Costa", room: "301", color: "bg-red-100 border-red-500" },
      },
      // Additional data for 6B would be added similarly
    }
  };
  
  const timeSlots = ["07:30-08:20", "08:20-09:10", "09:10-10:00", "10:20-11:10", "11:10-12:00"];
  const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  
  const schedule = schedules[selectedClass] || {};
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5A">5º Ano A</SelectItem>
              <SelectItem value="6B">6º Ano B</SelectItem>
              <SelectItem value="7C">7º Ano C</SelectItem>
              <SelectItem value="8A">8º Ano A</SelectItem>
              <SelectItem value="9B">9º Ano B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Maternal</Badge>
          <Badge variant="outline">Fundamental I</Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary">Fundamental II</Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-md border">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 bg-muted">
            <div className="p-3 text-center font-medium border-r"></div>
            {weekdays.map(day => (
              <div key={day} className="p-3 text-center font-medium border-r">{day}</div>
            ))}
          </div>
          
          {timeSlots.map((time, i) => (
            <div key={time} className={`grid grid-cols-6 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <div className="p-2 text-center text-sm border-r border-t">{time}</div>
              {weekdays.map((day) => {
                const slot = schedule[day]?.[time];
                return (
                  <div key={`${day}-${time}`} className="p-2 border-r border-t">
                    {slot ? (
                      <Card className={`${slot.color} border-l-4 h-full`}>
                        <CardContent className="p-2">
                          <div className="font-medium">{slot.subject}</div>
                          <div className="text-xs text-muted-foreground">{slot.teacher}</div>
                          <div className="text-xs mt-1">Sala: {slot.room}</div>
                        </CardContent>
                      </Card>
                    ) : <div className="h-[70px]"></div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
