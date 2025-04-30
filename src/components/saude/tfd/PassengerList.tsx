
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, Plus } from "lucide-react";
import { getTFDReferrals, assignTFDReferralToTransport } from "@/services/health";
import { TFDReferral } from "@/types/health";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PassengerListProps {
  transportId: string;
}

export function PassengerList({ transportId }: PassengerListProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [passengers, setPassengers] = useState<TFDReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [availableReferrals, setAvailableReferrals] = useState<TFDReferral[]>([]);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  useEffect(() => {
    loadPassengers();
  }, [transportId]);

  const loadPassengers = async () => {
    // This would fetch the passengers assigned to this transport
    // For now, we'll just generate some mock data
    setLoading(true);
    setTimeout(() => {
      setPassengers([
        {
          id: "1",
          protocolNumber: "TFD-2023-0001",
          patientId: "user-1", // Added patientId
          patientName: "Maria Silva",
          patientCpf: "123.456.789-00",
          specialty: "Cardiologia",
          destinationCity: "São Paulo",
          referralReason: "Consulta com especialista",
          priority: "normal",
          status: "scheduled",
          referredBy: "Dr. Carlos Santos",
          referredAt: "2023-05-01T10:00:00Z",
        },
        {
          id: "2",
          protocolNumber: "TFD-2023-0002",
          patientId: "user-2", // Added patientId
          patientName: "João Santos",
          patientCpf: "987.654.321-00",
          specialty: "Neurologia",
          destinationCity: "São Paulo",
          referralReason: "Exame especializado",
          priority: "high",
          status: "scheduled",
          referredBy: "Dra. Ana Lima",
          referredAt: "2023-05-02T14:30:00Z",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const loadAvailableReferrals = async () => {
    try {
      // This would fetch authorized referrals that haven't been assigned to a transport
      const result = await getTFDReferrals(1, 100, { status: "authorized" });
      setAvailableReferrals(result.data || []);
    } catch (error) {
      console.error("Error loading available referrals:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os encaminhamentos disponíveis.",
        variant: "destructive",
      });
    }
  };

  const handleAddPassenger = async () => {
    if (!selectedReferralId) return;

    try {
      await assignTFDReferralToTransport(selectedReferralId, transportId);
      toast({
        title: "Passageiro adicionado",
        description: "O paciente foi adicionado ao transporte com sucesso.",
      });
      setAddDialogOpen(false);
      loadPassengers();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o paciente ao transporte.",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    loadAvailableReferrals();
    setAddDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Passageiros</h3>
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar Paciente
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : passengers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passengers.map((passenger) => (
              <TableRow key={passenger.id}>
                <TableCell className="font-mono text-sm">{passenger.protocolNumber}</TableCell>
                <TableCell>{passenger.patientName}</TableCell>
                <TableCell>{passenger.specialty}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">Detalhes</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>Nenhum passageiro foi adicionado</p>
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Paciente ao Transporte</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {availableReferrals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Selecionar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-mono text-sm">{referral.protocolNumber}</TableCell>
                      <TableCell>{referral.patientName}</TableCell>
                      <TableCell>{referral.specialty}</TableCell>
                      <TableCell>
                        <input 
                          type="radio" 
                          name="selectedReferral" 
                          checked={selectedReferralId === referral.id}
                          onChange={() => setSelectedReferralId(referral.id)}
                          className="rounded text-primary focus:ring-primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum encaminhamento disponível para adicionar</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPassenger} disabled={!selectedReferralId}>
              Adicionar ao Transporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
