
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Search, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MatriculaPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Matrícula Escolar</h1>
          <p className="text-muted-foreground">
            Gerenciamento de matrículas escolares
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
        </Button>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pendentes">
              Pendentes <Badge className="ml-2 bg-amber-500">12</Badge>
            </TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar matrícula..."
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <EnrollmentRow 
                    key={i}
                    protocol={`MATR-2025-${100000 + i}`}
                    student={`Aluno ${i + 1}`}
                    school={`Escola Municipal ${i % 2 === 0 ? 'João da Silva' : 'Maria Oliveira'}`}
                    date={new Date().toLocaleDateString()}
                    status="pending"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aprovadas">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <EnrollmentRow 
                    key={i}
                    protocol={`MATR-2025-${100100 + i}`}
                    student={`Aluno Aprovado ${i + 1}`}
                    school={`Escola Municipal ${i % 2 === 0 ? 'João da Silva' : 'Paulo Freire'}`}
                    date={new Date().toLocaleDateString()}
                    status="approved"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejeitadas">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas Rejeitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <EnrollmentRow 
                    key={i}
                    protocol={`MATR-2025-${100200 + i}`}
                    student={`Aluno Rejeitado ${i + 1}`}
                    school={`Escola Municipal ${i % 2 === 0 ? 'João da Silva' : 'Maria Oliveira'}`}
                    date={new Date().toLocaleDateString()}
                    status="rejected"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Matrículas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <EnrollmentRow 
                    key={i}
                    protocol={`MATR-2025-${100300 + i}`}
                    student={`Aluno ${i + 1}`}
                    school={`Escola Municipal ${i % 3 === 0 ? 'João da Silva' : i % 3 === 1 ? 'Maria Oliveira' : 'Paulo Freire'}`}
                    date={new Date().toLocaleDateString()}
                    status={i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected"}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EnrollmentRowProps {
  protocol: string;
  student: string;
  school: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EnrollmentRow = ({ protocol, student, school, date, status }: EnrollmentRowProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center
            ${status === 'pending' ? 'bg-amber-100' : status === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Clock className={`h-5 w-5
              ${status === 'pending' ? 'text-amber-600' : status === 'approved' ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        <div>
          <p className="font-medium">{student}</p>
          <p className="text-sm text-muted-foreground">{school}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">{protocol}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {date}
          </div>
        </div>
        
        <Badge className={`
          ${status === 'pending' ? 'bg-amber-500' : status === 'approved' ? 'bg-green-500' : 'bg-red-500'}
        `}>
          {status === 'pending' ? 'Pendente' : status === 'approved' ? 'Aprovada' : 'Rejeitada'}
        </Badge>
        
        <Button variant="outline" size="sm">Detalhes</Button>
        
        {status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">Aprovar</Button>
            <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">Rejeitar</Button>
          </div>
        )}
      </div>
    </div>
  );
};
