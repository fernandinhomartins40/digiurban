
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";
import { NewReferralDialog } from "@/components/saude/tfd/NewReferralDialog";
import { ReferralDetailsDialog } from "@/components/saude/tfd/ReferralDetailsDialog";
import { NewTransportDialog } from "@/components/saude/tfd/NewTransportDialog";
import { TransportDetailsDialog } from "@/components/saude/tfd/TransportDetailsDialog";
import { TFDReferral, TFDTransport } from "@/types/health";

export default function TFDPage() {
  const [newReferralOpen, setNewReferralOpen] = useState(false);
  const [referralDetailsOpen, setReferralDetailsOpen] = useState(false);
  const [newTransportOpen, setNewTransportOpen] = useState(false);
  const [transportDetailsOpen, setTransportDetailsOpen] = useState(false);
  const [selectedReferralId, setSelectedReferralId] = useState<string | undefined>();
  const [selectedTransport, setSelectedTransport] = useState<TFDTransport | undefined>();
  
  // Mock data for passengers dialog
  const mockTransport: TFDTransport = {
    id: "trans-1",
    vehicleId: "van-1",
    vehicleDescription: "Van - São Paulo",
    driverId: "driver-1",
    driverName: "Carlos Silva",
    departureDate: "2023-05-10",
    departureTime: "06:00",
    capacity: 12,
    occupiedSeats: 8
  };
  
  const handleReferralDetails = (referralId: string) => {
    setSelectedReferralId(referralId);
    setReferralDetailsOpen(true);
  };
  
  const handleTransportDetails = (transport: TFDTransport) => {
    setSelectedTransport(transport);
    setTransportDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Encaminhamentos TFD</h1>
          <p className="text-muted-foreground">
            Tratamento Fora do Domicílio - Gerenciamento de encaminhamentos e transportes.
          </p>
        </div>
        <Button onClick={() => setNewReferralOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Encaminhamento
        </Button>
      </div>

      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="referrals">Encaminhamentos</TabsTrigger>
          <TabsTrigger value="transport">Transportes</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="referrals" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar paciente"
                  className="pl-8 h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os status</option>
                <option value="referred">Encaminhado</option>
                <option value="authorized">Autorizado</option>
                <option value="scheduled">Agendado</option>
                <option value="in-transport">Em transporte</option>
                <option value="completed">Finalizado</option>
                <option value="canceled">Cancelado</option>
              </select>
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todas as especialidades</option>
                <option value="cardio">Cardiologia</option>
                <option value="neuro">Neurologia</option>
                <option value="onco">Oncologia</option>
              </select>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left p-3 text-sm font-medium">Protocolo</th>
                  <th className="text-left p-3 text-sm font-medium">Paciente</th>
                  <th className="text-left p-3 text-sm font-medium">Especialidade</th>
                  <th className="text-left p-3 text-sm font-medium">Destino</th>
                  <th className="text-center p-3 text-sm font-medium">Status</th>
                  <th className="text-center p-3 text-sm font-medium">Prioridade</th>
                  <th className="text-center p-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm font-mono">
                      TFD-{2023}-{String(i).padStart(4, '0')}
                    </td>
                    <td className="p-3">
                      {["Maria Silva", "João Santos", "Ana Oliveira", "Carlos Lima", "Beatriz Souza"][i - 1]}
                    </td>
                    <td className="p-3 text-sm">
                      {["Cardiologia", "Neurologia", "Oncologia", "Ortopedia", "Oftalmologia"][i - 1]}
                    </td>
                    <td className="p-3 text-sm">
                      {["São Paulo", "Rio de Janeiro", "Campinas", "Ribeirão Preto", "Belo Horizonte"][i - 1]}
                    </td>
                    <td className="p-3">
                      <div className={`px-2 py-1 text-xs rounded-full text-center ${
                        i === 1 ? "bg-blue-100 text-blue-800" :
                        i === 2 ? "bg-amber-100 text-amber-800" :
                        i === 3 ? "bg-green-100 text-green-800" :
                        i === 4 ? "bg-purple-100 text-purple-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {["Encaminhado", "Autorizado", "Agendado", "Em transporte", "Finalizado"][i - 1]}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className={`px-2 py-1 text-xs rounded-full inline-block ${
                        i === 1 || i === 4 ? "bg-red-100 text-red-800" :
                        i === 2 ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {i === 1 || i === 4 ? "Urgente" : i === 2 ? "Alta" : "Normal"}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" onClick={() => handleReferralDetails(`ref-${i}`)}>
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="transport" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <input
                type="date"
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Todos os veículos</option>
                <option value="van-1">Van 1</option>
                <option value="van-2">Van 2</option>
                <option value="ambulancia">Ambulância</option>
              </select>
            </div>
            <Button onClick={() => setNewTransportOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Transporte
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        className="h-5 w-5 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {["Agendado", "Confirmado", "Concluído"][i - 1]}
                    </div>
                  </div>
                  <h3 className="font-medium">{["Van - São Paulo", "Ambulância - Campinas", "Van - Ribeirão Preto"][i - 1]}</h3>
                  <p className="text-sm text-muted-foreground">
                    {["10/05/2023", "15/05/2023", "20/05/2023"][i - 1]} - Saída: {["06:00", "07:30", "05:00"][i - 1]}
                  </p>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Motorista:</span>
                      <span>{["Carlos Silva", "Roberto Alves", "Marcos Santos"][i - 1]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Capacidade:</span>
                      <span>{[12, 1, 12][i - 1]} lugares</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Ocupação:</span>
                      <span>{[8, 1, 10][i - 1]} pacientes</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => handleTransportDetails({
                        ...mockTransport,
                        id: `trans-${i}`,
                        vehicleDescription: ["Van - São Paulo", "Ambulância - Campinas", "Van - Ribeirão Preto"][i - 1],
                        driverName: ["Carlos Silva", "Roberto Alves", "Marcos Santos"][i - 1],
                        departureDate: ["2023-05-10", "2023-05-15", "2023-05-20"][i - 1],
                        departureTime: ["06:00", "07:30", "05:00"][i - 1],
                        capacity: [12, 1, 12][i - 1],
                        occupiedSeats: [8, 1, 10][i - 1]
                      })}
                    >
                      Passageiros
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleTransportDetails({
                        ...mockTransport,
                        id: `trans-${i}`,
                        vehicleDescription: ["Van - São Paulo", "Ambulância - Campinas", "Van - Ribeirão Preto"][i - 1],
                        driverName: ["Carlos Silva", "Roberto Alves", "Marcos Santos"][i - 1],
                        departureDate: ["2023-05-10", "2023-05-15", "2023-05-20"][i - 1],
                        departureTime: ["06:00", "07:30", "05:00"][i - 1],
                        capacity: [12, 1, 12][i - 1],
                        occupiedSeats: [8, 1, 10][i - 1]
                      })}
                    >
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Selecione esta aba para ver relatórios de TFD.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <NewReferralDialog open={newReferralOpen} onOpenChange={setNewReferralOpen} />
      <ReferralDetailsDialog open={referralDetailsOpen} onOpenChange={setReferralDetailsOpen} referralId={selectedReferralId} />
      <NewTransportDialog open={newTransportOpen} onOpenChange={setNewTransportOpen} />
      <TransportDetailsDialog open={transportDetailsOpen} onOpenChange={setTransportDetailsOpen} transport={selectedTransport} />
    </div>
  );
}
