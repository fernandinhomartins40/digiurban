
import React from "react";
import { MeioAmbienteLayout } from "./components/MeioAmbienteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  FileCheck, 
  FileWarning, 
  Leaf,
  Megaphone,
  Settings2,
  TreeDeciduous,
  Waves
} from "lucide-react";

// Mock data for dashboard cards
const environmentalMetrics = [
  {
    title: "Licenças Ativas",
    value: 248,
    icon: <FileCheck size={24} className="text-green-600" />,
    change: "+12% desde o último mês",
    status: "increase"
  },
  {
    title: "Licenças Pendentes",
    value: 36,
    icon: <FileWarning size={24} className="text-amber-600" />,
    change: "-5% desde o último mês",
    status: "decrease"
  },
  {
    title: "Denúncias Abertas",
    value: 18,
    icon: <AlertTriangle size={24} className="text-red-600" />,
    change: "+3% desde o último mês",
    status: "increase"
  },
  {
    title: "Campanhas Ativas",
    value: 7,
    icon: <Megaphone size={24} className="text-blue-600" />,
    change: "Sem alterações desde o último mês",
    status: "neutral"
  },
];

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    type: "licença",
    title: "Licença de Operação - Indústria Química Beta",
    date: "2025-05-03",
    status: "aprovada"
  },
  {
    id: 2,
    type: "denúncia",
    title: "Descarte irregular de resíduos - Rio Verde",
    date: "2025-05-02",
    status: "investigação"
  },
  {
    id: 3,
    type: "campanha",
    title: "Semana da Água - Escolas Municipais",
    date: "2025-05-01",
    status: "ativa"
  },
  {
    id: 4,
    type: "licença",
    title: "Autorização de Supressão Vegetal - Loteamento Flores",
    date: "2025-04-30",
    status: "análise"
  },
  {
    id: 5,
    type: "denúncia",
    title: "Poluição sonora - Fábrica Norte",
    date: "2025-04-29",
    status: "concluída"
  }
];

// Mock data for environmental quality
const environmentalQuality = [
  {
    id: 1,
    name: "Qualidade do Ar",
    status: "bom",
    icon: <Leaf size={20} />,
    value: 87
  },
  {
    id: 2,
    name: "Qualidade da Água",
    status: "adequada",
    icon: <Waves size={20} />,
    value: 76
  },
  {
    id: 3,
    name: "Áreas Preservadas",
    status: "estável",
    icon: <TreeDeciduous size={20} />,
    value: 92
  },
  {
    id: 4,
    name: "Controle de Emissões",
    status: "adequado",
    icon: <Settings2 size={20} />,
    value: 81
  }
];

export default function MeioAmbienteIndex() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "aprovada":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprovada</Badge>;
      case "análise":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Análise</Badge>;
      case "investigação":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Em Investigação</Badge>;
      case "ativa":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Ativa</Badge>;
      case "concluída":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Concluída</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "licença":
        return <FileCheck size={16} className="text-green-600" />;
      case "denúncia":
        return <AlertTriangle size={16} className="text-amber-600" />;
      case "campanha":
        return <Megaphone size={16} className="text-blue-600" />;
      default:
        return <Leaf size={16} />;
    }
  };

  return (
    <MeioAmbienteLayout>
      <div className="space-y-6">
        {/* Metrics overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {environmentalMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Environmental quality indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Indicadores de Qualidade Ambiental</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {environmentalQuality.map((indicator) => (
                <div key={indicator.id} className="flex flex-col items-center p-4 border rounded-md bg-green-50">
                  <div className="mb-2">{indicator.icon}</div>
                  <h3 className="font-medium">{indicator.name}</h3>
                  <div className="mt-2 text-2xl font-bold text-green-700">{indicator.value}%</div>
                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-300">
                    {indicator.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MeioAmbienteLayout>
  );
}
