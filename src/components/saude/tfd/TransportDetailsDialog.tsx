
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Truck } from "lucide-react";
import { TFDTransport } from "@/types/health";
import { formatDate } from "@/lib/utils";
import { PassengerList } from "./PassengerList";

interface TransportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transport?: TFDTransport;
}

export function TransportDetailsDialog({ open, onOpenChange, transport }: TransportDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details");

  const getStatusColor = (departureDate: string) => {
    const now = new Date();
    const departure = new Date(departureDate);
    
    if (departure < now) return "bg-green-100 text-green-800"; // Past date - completed
    if (departure.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return "bg-amber-100 text-amber-800"; // Within 24h - confirmed
    }
    return "bg-blue-100 text-blue-800"; // Future date - scheduled
  };

  if (!transport) return null;

  const statusColor = getStatusColor(transport.departureDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Transporte</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="passengers">Passageiros</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{transport.vehicleDescription}</h3>
              <Badge className={statusColor}>
                {transport.departureDate < new Date().toISOString().split('T')[0] ? "Concluído" : 
                 new Date(transport.departureDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 ? "Confirmado" : "Agendado"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Veículo</p>
                  <p className="text-sm text-muted-foreground">{transport.vehicleDescription}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Motorista</p>
                  <p className="text-sm text-muted-foreground">{transport.driverName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Saída</p>
                  <p className="text-sm text-muted-foreground">{new Date(transport.departureDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Hora de Saída</p>
                  <p className="text-sm text-muted-foreground">{transport.departureTime}</p>
                </div>
              </div>
              
              {transport.returnDate && (
                <>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data de Retorno</p>
                      <p className="text-sm text-muted-foreground">{new Date(transport.returnDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  {transport.returnTime && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Hora de Retorno</p>
                        <p className="text-sm text-muted-foreground">{transport.returnTime}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Capacidade</p>
                  <p className="text-lg">{transport.capacity} lugares</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ocupação</p>
                  <p className="text-lg">{transport.occupiedSeats} passageiros</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{width: `${Math.min(100, (transport.occupiedSeats / transport.capacity) * 100)}%`}}
                ></div>
              </div>
            </div>
            
            {transport.notes && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium">Observações</p>
                <p className="text-sm mt-1">{transport.notes}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="passengers" className="py-4">
            <PassengerList transportId={transport.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
