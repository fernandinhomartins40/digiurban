
import React from "react";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Appointment } from "@/types/mayorOffice";

interface AppointmentHeaderProps {
  appointment: Appointment;
}

export function AppointmentHeader({ appointment }: AppointmentHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{appointment.subject}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <StatusBadge status={appointment.status} />
        {appointment.priority && <PriorityBadge priority={appointment.priority} />}
      </div>
      <Separator className="my-3" />
    </div>
  );
}
