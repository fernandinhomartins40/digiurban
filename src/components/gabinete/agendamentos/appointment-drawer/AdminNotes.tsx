
import React from "react";
import { Appointment } from "@/types/mayorOffice";

interface AdminNotesProps {
  notes?: string;
}

export function AdminNotes({ notes }: AdminNotesProps) {
  if (!notes) return null;
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Observações Administrativas</h4>
      <div className="text-sm border rounded-md p-3 bg-muted/30">
        {notes}
      </div>
    </div>
  );
}
