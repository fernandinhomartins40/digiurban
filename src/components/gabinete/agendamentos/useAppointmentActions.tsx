
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { 
  updateMayorAppointmentStatus, 
  updateMayorAppointmentNotes 
} from "@/services/mayorOffice/appointmentsService";
import { AppointmentStatus } from "@/types/mayorOffice";
import { useToast } from "@/hooks/use-toast";

export function useAppointmentActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: AppointmentStatus }) =>
      updateMayorAppointmentStatus(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    },
  });

  // Update appointment notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: ({ appointmentId, notes }: { appointmentId: string; notes: string }) =>
      updateMayorAppointmentNotes(appointmentId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      toast({
        title: "Observações atualizadas",
        description: "As observações do agendamento foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar as observações do agendamento.",
        variant: "destructive",
      });
    },
  });

  // Function to handle status changes
  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
    try {
      await updateStatusMutation.mutateAsync({ appointmentId, status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Function to handle notes changes
  const handleNotesChange = async (appointmentId: string, notes: string): Promise<void> => {
    try {
      await updateNotesMutation.mutateAsync({ appointmentId, notes });
    } catch (error) {
      console.error("Error updating appointment notes:", error);
    }
  };

  return {
    handleStatusChange,
    handleNotesChange,
    isUpdatingStatus: updateStatusMutation.isPending,
    isUpdatingNotes: updateNotesMutation.isPending
  };
}
