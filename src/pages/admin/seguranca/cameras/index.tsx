
import React from "react";
import { SegurancaLayout } from "../components/SegurancaLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Circle, Locate, MapPin, Video } from "lucide-react";

// Mock data for cameras
const camerasMock = [
  {
    id: 1,
    nome: "CAM-001",
    local: "Praça Central",
    bairro: "Centro",
    status: "online",
    tipo: "fixa",
    ultimoIncidente: "2025-05-02T14:30:00",
    cobertura: "Área de grande circulação"
  },
  {
    id: 2,
    nome: "CAM-002",
    local: "Av. Principal, 800",
    bairro: "Centro",
    status: "online",
    tipo: "rotativa",
    ultimoIncidente: null,
    cobertura: "Esquina com área comercial"
  },
  {
    id: 3,
    nome: "CAM-003",
    local: "Escola Municipal João Paulo",
    bairro: "Vila Nova",
    status: "offline",
    tipo: "fixa",
    ultimoIncidente: "2025-05-01T23:15:00",
    cobertura: "Entrada principal da escola"
  },
  {
    id: 4,
    nome: "CAM-004",
    local: "Terminal Rodoviário",
    bairro: "Centro",
    status: "online",
    tipo: "rotativa",
    ultimoIncidente: null,
    cobertura: "Pátio de embarque e desembarque"
  },
  {
    id: 5,
    nome: "CAM-005",
    local: "Parque Municipal",
    bairro: "Jardim América",
    status: "manutencao",
    tipo: "fixa",
    ultimoIncidente: null,
    cobertura: "Playground e áreas recreativas"
  },
  {
    id: 6,
    nome: "CAM-006",
    local: "Hospital Municipal",
    bairro: "Vila Nova",
    status: "online",
    tipo: "rotativa",
    ultimoIncidente: "2025-05-03T08:45:00",
    cobertura: "Entrada principal e estacionamento"
  },
];

// Mock data for alertas (alerts)
const alertasMock = [
  {
    id: 1,
    camera: "CAM-001",
    tipo: "Movimento Suspeito",
    horario: "2025-05-04T10:15:00",
    local: "Praça Central",
    status: "pendente"
  },
  {
    id: 2,
    camera: "CAM-006",
    tipo: "Aglomeração",
    horario: "2025-05-03T22:30:00",
    local: "Hospital Municipal",
    status: "verificado"
  },
  {
    id: 3,
    camera: "CAM-003",
    tipo: "Invasão de Propriedade",
    horario: "2025-05-01T23:15:00",
    local: "Escola Municipal João Paulo",
    status: "confirmado"
  }
];

export default function CamerasMonitoramentoIndex() {
  const [selectedTipo, setSelectedTipo] = React.useState("");
  const [selectedBairro, setSelectedBairro] = React.useState("");

  const filteredCameras = camerasMock.filter(camera => {
    return (
      (selectedTipo === "" || camera.tipo === selectedTipo) &&
      (selectedBairro === "" || camera.bairro === selectedBairro)
    );
  });

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle size={12} className="fill-green-500 text-green-500" />;
      case 'offline':
        return <Circle size={12} className="fill-red-500 text-red-500" />;
      case 'manutencao':
        return <Circle size={12} className="fill-amber-500 text-amber-500" />;
      default:
        return <Circle size={12} className="fill-gray-500 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return "Online";
      case 'offline': return "Offline";
      case 'manutencao': return "Em manutenção";
      default: return "Desconhecido";
    }
  };

  const getAlertaStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pendente</Badge>;
      case 'verificado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Verificado</Badge>;
      case 'confirmado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Confirmado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Dummy component to simulate camera feed
  const CameraFeed = ({ camera }: { camera: typeof camerasMock[0] }) => {
    return (
      <div className="relative border rounded overflow-hidden bg-gray-900 aspect-video">
        {camera.status === 'online' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {getStatusIndicator(camera.status)}
              <span>{camera.nome}</span>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded">
              <MapPin size={12} />
              <span>{camera.local}</span>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded">
              <span className="animate-pulse">AO VIVO</span>
            </div>
            <Video className="opacity-30 h-16 w-16" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-800">
            <Camera className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-white text-sm">{camera.nome}</p>
              <p className="text-gray-400 text-xs">{getStatusText(camera.status)}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <SegurancaLayout title="Videomonitoramento" description="Sistema de câmeras de segurança do município">
      <div className="space-y-6">
        {/* Filters and stats */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Circle size={12} className="fill-green-500 text-green-500" />
              <span className="text-sm">Online: {camerasMock.filter(c => c.status === 'online').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle size={12} className="fill-red-500 text-red-500" />
              <span className="text-sm">Offline: {camerasMock.filter(c => c.status === 'offline').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle size={12} className="fill-amber-500 text-amber-500" />
              <span className="text-sm">Em manutenção: {camerasMock.filter(c => c.status === 'manutencao').length}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="fixa">Câmera fixa</SelectItem>
                <SelectItem value="rotativa">Câmera rotativa</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedBairro} onValueChange={setSelectedBairro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os bairros</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Vila Nova">Vila Nova</SelectItem>
                <SelectItem value="Jardim América">Jardim América</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Locate className="mr-2 h-4 w-4" />
              Ver no Mapa
            </Button>
          </div>
        </div>
        
        {/* Camera grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCameras.map(camera => (
            <Card key={camera.id} className="overflow-hidden">
              <CameraFeed camera={camera} />
              <CardFooter className="p-2 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  {getStatusIndicator(camera.status)}
                  <span className="text-sm font-medium">{getStatusText(camera.status)}</span>
                </div>
                <Button variant="ghost" size="sm">Detalhes</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredCameras.length === 0 && (
          <div className="text-center py-8">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma câmera encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há câmeras correspondentes aos filtros selecionados.
            </p>
          </div>
        )}
        
        {/* Alertas recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertasMock.map(alerta => (
                <div key={alerta.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded">
                      <Camera className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{alerta.tipo}</p>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{alerta.camera} - {alerta.local}</span>
                        <span>{new Date(alerta.horario).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getAlertaStatusBadge(alerta.status)}
                    <Button variant="ghost" size="sm">Ver</Button>
                  </div>
                </div>
              ))}
              {alertasMock.length === 0 && (
                <p className="text-center text-muted-foreground py-2">
                  Não há alertas recentes para exibir.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SegurancaLayout>
  );
}
