
import React from "react";
import { ObrasLayout } from "./components/ObrasLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, Clock, CheckCircle, AlertCircle, BarChart3, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for ongoing works
const obrasAndamentoMock = [
  {
    id: 1,
    nome: "Revitalização da Praça Central",
    tipo: "Infraestrutura Urbana",
    inicio: "2025-01-15",
    previsaoTermino: "2025-07-20",
    status: "em_andamento",
    progresso: 65,
    responsavel: "Sec. Infraestrutura"
  },
  {
    id: 2,
    nome: "Pavimentação da Rua das Flores",
    tipo: "Pavimentação",
    inicio: "2025-03-10",
    previsaoTermino: "2025-06-15",
    status: "em_andamento",
    progresso: 40,
    responsavel: "Sec. Obras"
  },
  {
    id: 3,
    nome: "Reforma da Escola Municipal",
    tipo: "Educação",
    inicio: "2025-02-20",
    previsaoTermino: "2025-05-30",
    status: "atrasada",
    progresso: 25,
    responsavel: "Sec. Educação"
  },
];

// Mock data for recently completed works
const obrasConcluidas = [
  {
    id: 101,
    nome: "Instalação de Semáforos na Av. Principal",
    tipo: "Trânsito",
    concluida: "2025-04-25",
    responsavel: "Sec. Mobilidade"
  },
  {
    id: 102,
    nome: "Reforma da UBS Centro",
    tipo: "Saúde",
    concluida: "2025-04-20",
    responsavel: "Sec. Saúde"
  }
];

export default function ObrasPublicasIndex() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Em andamento</Badge>;
      case 'atrasada':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Atrasada</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Concluída</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <ObrasLayout title="Obras Públicas" description="Gestão e monitoramento de obras municipais">
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Construction size={16} /> Total de Obras
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} /> Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">14</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} /> Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} /> Atrasadas
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Obras em andamento */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Obras em Andamento</h2>
            <Button variant="outline" className="gap-1" asChild>
              <Link to="/admin/obras/pequenas">
                Ver todas <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Obra</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Previsão de Término</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obrasAndamentoMock.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="font-medium">{obra.nome}</TableCell>
                    <TableCell>{obra.tipo}</TableCell>
                    <TableCell>{new Date(obra.inicio).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(obra.previsaoTermino).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${obra.progresso}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{obra.progresso}%</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(obra.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Obras recentemente concluídas */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Obras Recentemente Concluídas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obrasConcluidas.map((obra) => (
              <Card key={obra.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{obra.nome}</CardTitle>
                    {getStatusBadge("concluida")}
                  </div>
                  <p className="text-muted-foreground text-sm">{obra.tipo}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Concluída em:</span> {new Date(obra.concluida).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Responsável:</span> {obra.responsavel}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Gráfico de desempenho */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 size={18} /> Desempenho de Obras
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Gráfico de desempenho de obras por categoria e status.</p>
              <p className="text-sm">(Visualização de exemplo)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ObrasLayout>
  );
}
