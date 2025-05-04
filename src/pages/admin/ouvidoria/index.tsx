
import React from "react";
import { OuvidoriaLayout } from "./components/OuvidoriaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Clock, 
  ThumbsUp, 
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simulated metrics
const metrics = [
  { 
    title: "Total de Manifestações", 
    value: "387", 
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    change: 12,
    trend: "up"
  },
  { 
    title: "Manifestações Pendentes", 
    value: "42", 
    icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    change: -5,
    trend: "down"
  },
  { 
    title: "Tempo Médio de Resposta", 
    value: "3.2 dias", 
    icon: <Clock className="h-8 w-8 text-purple-500" />,
    change: -0.8,
    trend: "down"
  },
  { 
    title: "Índice de Satisfação", 
    value: "87%", 
    icon: <ThumbsUp className="h-8 w-8 text-green-500" />,
    change: 4,
    trend: "up"
  },
];

// Recent activity data
const recentActivities = [
  { 
    id: "MAN-2023-0175", 
    type: "Reclamação", 
    subject: "Problema com coleta de lixo na Rua das Flores", 
    department: "Serviços Urbanos", 
    status: "Encaminhada",
    date: "2023-04-28" 
  },
  { 
    id: "MAN-2023-0174", 
    type: "Elogio", 
    subject: "Atendimento de saúde na UBS Central", 
    department: "Saúde", 
    status: "Finalizada",
    date: "2023-04-27" 
  },
  { 
    id: "MAN-2023-0173", 
    type: "Sugestão", 
    subject: "Instalação de lixeiras na praça central", 
    department: "Serviços Urbanos", 
    status: "Em análise",
    date: "2023-04-27" 
  },
  { 
    id: "MAN-2023-0172", 
    type: "Denúncia", 
    subject: "Obra irregular em área de preservação", 
    department: "Meio Ambiente", 
    status: "Em andamento",
    date: "2023-04-26" 
  },
  { 
    id: "MAN-2023-0171", 
    type: "Solicitação", 
    subject: "Informações sobre alvará de funcionamento", 
    department: "Administração", 
    status: "Finalizada",
    date: "2023-04-26" 
  },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "Finalizada": return "bg-green-100 text-green-800";
    case "Em andamento": return "bg-blue-100 text-blue-800";
    case "Encaminhada": return "bg-purple-100 text-purple-800";
    case "Em análise": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getTypeColor = (type: string) => {
  switch(type) {
    case "Reclamação": return "bg-red-100 text-red-800";
    case "Elogio": return "bg-green-100 text-green-800";
    case "Sugestão": return "bg-blue-100 text-blue-800";
    case "Denúncia": return "bg-purple-100 text-purple-800";
    case "Solicitação": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function OuvidoriaIndex() {
  return (
    <OuvidoriaLayout>
      <div className="space-y-6">
        {/* Metrics Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {metric.trend === "up" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {metric.change > 0 ? "+" : ""}{metric.change}
                    {metric.title.includes("Tempo") ? " dias" : "%"}
                  </span>
                  <span className="ml-1">desde o último mês</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Assunto</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.id}</TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(activity.type)}`}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[300px] truncate">
                      {activity.subject}
                    </TableCell>
                    <TableCell>{activity.department}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Department Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Serviços Urbanos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Manifestações: 78</span>
                    <Badge variant="outline">3.7 dias</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Saúde</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Manifestações: 65</span>
                    <Badge variant="outline">2.9 dias</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Educação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Manifestações: 52</span>
                    <Badge variant="outline">4.1 dias</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </OuvidoriaLayout>
  );
}
