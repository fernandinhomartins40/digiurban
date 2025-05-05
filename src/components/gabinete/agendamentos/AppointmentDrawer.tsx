
import React from "react";
import { Appointment } from "@/types/mayorOffice";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

// Import our component pieces
import { AppointmentHeader } from "./appointment-drawer/AppointmentHeader";
import { AppointmentDateTime } from "./appointment-drawer/AppointmentDateTime";
import { RequesterInfo } from "./appointment-drawer/RequesterInfo";
import { AppointmentDescription } from "./appointment-drawer/AppointmentDescription";
import { AdminNotes } from "./appointment-drawer/AdminNotes";
import { AppointmentActions } from "./appointment-drawer/AppointmentActions";
import { AppointmentNotes } from "./appointment-drawer/AppointmentNotes";

interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
  onUpdateNotes?: (id: string, notes: string) => Promise<void>;
  isUpdatingStatus?: boolean;
  isUpdatingNotes?: boolean;
}

export function AppointmentDrawer({
  isOpen,
  onClose,
  appointment,
  onApprove,
  onReject,
  onComplete,
  onUpdateNotes,
  isUpdatingStatus = false,
  isUpdatingNotes = false,
}: AppointmentDrawerProps) {
  if (!appointment) return null;

  const handleSaveNotes = async (notes: string) => {
    if (onUpdateNotes) {
      await onUpdateNotes(appointment.id, notes);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-xl font-semibold">
              Detalhes do Agendamento
            </DrawerTitle>
            <DrawerDescription>
              {appointment.protocol_number && `Protocolo: ${appointment.protocol_number}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Subject and Status Badges */}
            <AppointmentHeader appointment={appointment} />

            {/* Date and Time */}
            <AppointmentDateTime appointment={appointment} />

            <Separator />

            {/* Requester Information */}
            <RequesterInfo appointment={appointment} />

            <Separator />

            {/* Description */}
            <AppointmentDescription appointment={appointment} />

            {/* Admin Notes */}
            {appointment.adminNotes && <AdminNotes notes={appointment.adminNotes} />}

            {/* Notes Editing Form */}
            <AppointmentNotes 
              appointment={appointment} 
              onSaveNotes={handleSaveNotes} 
              isUpdating={isUpdatingNotes}
            />
          </div>

          <DrawerFooter className="sm:flex-row sm:justify-between gap-2">
            <AppointmentActions
              appointment={appointment}
              onApprove={onApprove}
              onReject={onReject}
              onComplete={onComplete}
              onClose={onClose}
            />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
