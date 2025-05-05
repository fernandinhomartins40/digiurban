
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  updateMayorAppointmentStatus,
  updateMayorAppointmentNotes
} from "@/services/mayorOffice/appointmentsService";
import { Appointment, AppointmentStatus } from "@/types/mayorOffice";

export function useAppointmentActions() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Handle appointment status change
  const handleStatusChange = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      setIsUpdatingStatus(true);
      
      const updatedAppointment = await updateMayorAppointmentStatus(appointmentId, status);
      
      if (!updatedAppointment) {
        throw new Error("Failed to update appointment status");
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      
      // Show success message
      const statusMessages = {
        approved: "Agendamento aprovado com sucesso",
        rejected: "Agendamento rejeitado com sucesso",
        completed: "Agendamento marcado como concluído",
        cancelled: "Agendamento cancelado com sucesso",
        pending: "Agendamento retornado para pendente"
      };
      
      toast({
        title: "Status atualizado",
        description: statusMessages[status] || "Status atualizado com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle appointment notes change
  const handleNotesChange = async (appointmentId: string, notes: string) => {
    try {
      setIsUpdatingNotes(true);
      
      const updatedAppointment = await updateMayorAppointmentNotes(appointmentId, notes);
      
      if (!updatedAppointment) {
        throw new Error("Failed to update appointment notes");
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["mayorAppointments"] });
      
      // Show success message
      toast({
        title: "Anotações atualizadas",
        description: "As anotações do agendamento foram atualizadas com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating appointment notes:", error);
      toast({
        title: "Erro ao atualizar anotações",
        description: "Não foi possível atualizar as anotações do agendamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  return {
    handleStatusChange,
    handleNotesChange,
    isUpdatingStatus,
    isUpdatingNotes
  };
}
