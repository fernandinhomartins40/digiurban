
import React, { useState } from "react";
import { Appointment } from "@/types/mayorOffice";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Pencil } from "lucide-react";

interface AppointmentNotesProps {
  appointment: Appointment;
  onSaveNotes: (notes: string) => Promise<void>;
  isUpdating?: boolean;
}

export function AppointmentNotes({ 
  appointment, 
  onSaveNotes,
  isUpdating = false 
}: AppointmentNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(appointment.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveNotes(notes);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing && !appointment.adminNotes) {
    return (
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1 text-xs"
        >
          <Pencil className="h-3 w-3" />
          Adicionar observações
        </Button>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Observações Administrativas</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)} 
            className="h-6 px-2"
          >
            <Pencil className="h-3 w-3 mr-1" />
            <span className="text-xs">Editar</span>
          </Button>
        </div>
        <div className="text-sm border rounded-md p-3 bg-muted/30">
          {appointment.adminNotes}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <div>
        <FormLabel htmlFor="admin-notes" className="text-sm font-medium">
          Observações Administrativas
        </FormLabel>
        <Textarea
          id="admin-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione observações sobre este agendamento..."
          className="mt-1 resize-none"
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setIsEditing(false);
            setNotes(appointment.adminNotes || "");
          }}
          disabled={isSaving || isUpdating}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          size="sm"
          disabled={isSaving || isUpdating}
        >
          {isSaving || isUpdating ? "Salvando..." : "Salvar observações"}
        </Button>
      </div>
    </form>
  );
}
