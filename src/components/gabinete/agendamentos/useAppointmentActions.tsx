
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateMayorAppointmentStatus } from "@/services/mayorOffice/appointmentsService";
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

  // Function to handle status changes
  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
    try {
      await updateStatusMutation.mutateAsync({ appointmentId, status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return {
    handleStatusChange,
    isUpdating: updateStatusMutation.isPending
  };
}
