
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { SchoolCalendarEvent, getEventTypeInfo, formatEventDate } from "@/services/education/calendar";
import { formatDate } from "@/lib/utils";

interface CalendarEventDetailDialogProps {
  event: SchoolCalendarEvent | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (event: SchoolCalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function CalendarEventDetailDialog({
  event,
  open,
  onClose,
  onEdit,
  onDelete,
}: CalendarEventDetailDialogProps) {
  if (!event) return null;

  const eventTypeInfo = getEventTypeInfo(event.event_type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div
          className="h-2 -mx-6 -mt-6 mb-4 rounded-t-lg"
          style={{ backgroundColor: event.color || eventTypeInfo.color }}
        />
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Badge variant="outline">{eventTypeInfo.label}</Badge>
            <span className="text-xs text-muted-foreground">
              Ano letivo: {event.school_year}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {event.description && (
            <p className="text-sm">{event.description}</p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formatEventDate(event.start_date, event.end_date, event.all_day)}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Criado por: {event.created_by}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Criado em: {formatDate(event.created_at)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
              >
                Excluir
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(event);
                  onClose();
                }}
              >
                Editar
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
