
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

// Import our new component pieces
import { AppointmentHeader } from "./appointment-drawer/AppointmentHeader";
import { AppointmentDateTime } from "./appointment-drawer/AppointmentDateTime";
import { RequesterInfo } from "./appointment-drawer/RequesterInfo";
import { AppointmentDescription } from "./appointment-drawer/AppointmentDescription";
import { AdminNotes } from "./appointment-drawer/AdminNotes";
import { AppointmentActions } from "./appointment-drawer/AppointmentActions";

interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onComplete?: (id: string) => Promise<void>;
}

export function AppointmentDrawer({
  isOpen,
  onClose,
  appointment,
  onApprove,
  onReject,
  onComplete,
}: AppointmentDrawerProps) {
  if (!appointment) return null;

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

          <div className="px-4 py-2 space-y-4">
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
            <AdminNotes notes={appointment.adminNotes} />
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
