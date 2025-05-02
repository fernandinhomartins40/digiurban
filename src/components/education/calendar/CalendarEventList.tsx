
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SchoolCalendarEvent, getEventTypeInfo, formatEventDate } from "@/services/education/calendar";
import { Calendar, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarEventListProps {
  events: SchoolCalendarEvent[];
  onViewEvent: (event: SchoolCalendarEvent) => void;
  onEditEvent?: (event: SchoolCalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export function CalendarEventList({
  events,
  onViewEvent,
  onEditEvent,
  onDeleteEvent
}: CalendarEventListProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum evento encontrado para o período selecionado.</p>
            </CardContent>
          </Card>
        ) : (
          events.map(event => (
            <Card key={event.id} className="overflow-hidden">
              <div
                className="h-2"
                style={{ backgroundColor: event.color || getEventTypeInfo(event.event_type).color }}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <Badge variant="outline">{getEventTypeInfo(event.event_type).label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatEventDate(event.start_date, event.end_date, event.all_day)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewEvent(event)}
                  >
                    Detalhes
                  </Button>
                  {onEditEvent && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditEvent(event)}
                    >
                      Editar
                    </Button>
                  )}
                  {onDeleteEvent && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
