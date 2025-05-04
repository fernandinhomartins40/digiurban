import React from "react";
import { SegurancaLayout } from "../components/SegurancaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Shield, User } from "lucide-react";

// Mock data for guarda municipal
const guardaMock = [
  { 
    id: 1, 
    nome: "João Silva",
    matricula: "GM00123",
    cargo: "Inspetor",
    status: "em_serviço",
    equipe: "Alfa",
    setor: "Centro"
  },
  { 
    id: 2, 
    nome: "Maria Oliveira",
    matricula: "GM00145",
    cargo: "Guarda Municipal",
    status: "em_serviço",
    equipe: "Beta",
    setor: "Jardim América"
  },
  { 
    id: 3, 
    nome: "Pedro Santos",
    matricula: "GM00156",
    cargo: "Guarda Municipal",
    status: "folga",
    equipe: "Alfa",
    setor: "-"
  },
  { 
    id: 4, 
    nome: "Ana Pereira",
    matricula: "GM00189",
    cargo: "Guarda Municipal",
    status: "em_serviço",
    equipe: "Gama",
    setor: "Vila Nova"
  },
  { 
    id: 5, 
    nome: "Carlos Ferreira",
    matricula: "GM00201",
    cargo: "Inspetor",
    status: "folga",
    equipe: "Beta",
    setor: "-"
  },
];

// Mock data for escalas de patrulhamento (patrol schedules)
const escalasMock = [
  {
    id: 1,
    equipe: "Alfa",
    setor: "Centro",
    horario: "07:00 - 19:00",
    guardas: 5,
    viaturas: 2
  },
  {
    id: 2,
    equipe: "Beta",
    setor: "Jardim América",
    horario: "19:00 - 07:00",
    guardas: 4,
    viaturas: 1
  },
  {
    id: 3,
    equipe: "Gama",
    setor: "Vila Nova",
    horario: "07:00 - 19:00",
    guardas: 3,
    viaturas: 1
  },
];

export default function GuardaMunicipalIndex() {
  const [selectedEquipe, setSelectedEquipe] = React.useState("");

  const filteredGuardas = guardaMock.filter(guarda => {
    return selectedEquipe === "" || guarda.equipe === selectedEquipe;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_serviço':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Em serviço</Badge>;
      case 'folga':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Folga</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <SegurancaLayout title="Guarda Municipal" description="Gestão do efetivo e operações da Guarda Municipal">
      <div className="space-y-6">
        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User size={16} /> Total de Efetivo
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">45</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield size={16} /> Em Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">28</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} /> Setores
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar size={16} /> Viaturas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Escalas de Patrulhamento */}
        <div>
          <h3 className="text-lg font-medium mb-2">Escalas de Patrulhamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {escalasMock.map(escala => (
              <Card key={escala.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between">
                    <span>Equipe {escala.equipe}</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Ativo</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>{escala.setor}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{escala.horario}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Guardas:</span> {escala.guardas}
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Viaturas:</span> {escala.viaturas}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Efetivo table */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Efetivo da Guarda Municipal</h3>
            <div className="flex gap-2">
              <Select value={selectedEquipe} onValueChange={setSelectedEquipe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as equipes</SelectItem>
                  <SelectItem value="Alfa">Equipe Alfa</SelectItem>
                  <SelectItem value="Beta">Equipe Beta</SelectItem>
                  <SelectItem value="Gama">Equipe Gama</SelectItem>
                </SelectContent>
              </Select>
              <Button>Novo Guarda</Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Setor Atual</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuardas.map(guarda => (
                  <TableRow key={guarda.id}>
                    <TableCell className="font-medium">{guarda.matricula}</TableCell>
                    <TableCell>{guarda.nome}</TableCell>
                    <TableCell>{guarda.cargo}</TableCell>
                    <TableCell>Equipe {guarda.equipe}</TableCell>
                    <TableCell>{guarda.setor}</TableCell>
                    <TableCell>{getStatusBadge(guarda.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </SegurancaLayout>
  );
}
