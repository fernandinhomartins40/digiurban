
import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CalendarCheck, CalendarDays, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { MonthlyCalendarView } from "@/components/education/calendar/MonthlyCalendarView";
import { CalendarEventList } from "@/components/education/calendar/CalendarEventList";
import { CalendarEventForm } from "@/components/education/calendar/CalendarEventForm";
import { CalendarEventDetailDialog } from "@/components/education/calendar/CalendarEventDetailDialog";
import { 
  fetchCalendarEvents, 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent,
  SchoolCalendarEvent 
} from "@/services/education/calendar";

export default function CalendarioPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("monthly");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<SchoolCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<SchoolCalendarEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState<boolean>(false);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load events for the current month
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await fetchCalendarEvents(
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading calendar events:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos do calendário.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [currentDate, toast]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle event form submission
  const handleCreateEvent = async (data: any) => {
    try {
      // Add user information
      const eventData = {
        ...data,
        created_by: "admin", // In a real app, this would be the current user
      };

      await createCalendarEvent(eventData);
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso.",
      });
      
      // Refresh events
      const updatedEvents = await fetchCalendarEvents(
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      setEvents(updatedEvents);
      
      // Close form
      setShowEventForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!selectedEvent) return;
    
    try {
      await updateCalendarEvent(selectedEvent.id, data);
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso.",
      });
      
      // Refresh events
      const updatedEvents = await fetchCalendarEvents(
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      setEvents(updatedEvents);
      
      // Close form
      setShowEventForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteCalendarEvent(eventId);
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso.",
      });
      
      // Refresh events
      const updatedEvents = await fetchCalendarEvents(
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      setEvents(updatedEvents);
      
      // Close detail dialog
      setShowEventDetail(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
    }
  };

  // Functions for handling event clicks
  const handleViewEvent = (event: SchoolCalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleEditEvent = (event: SchoolCalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setShowEventForm(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setShowEventForm(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // You could filter events for this date or show a form to create an event on this date
    setSelectedEvent(null);
    setIsEditing(false);
    
    // Pre-select the date in the form
    const newEvent = {
      start_date: date.toISOString(),
      school_year: date.getFullYear()
    };
    
    setSelectedEvent(newEvent as any);
    setShowEventForm(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendário Escolar</h2>
        <p className="text-muted-foreground">
          Gerencie eventos escolares e o calendário acadêmico.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Month navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab selection and add event button */}
        <div className="flex gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="monthly">
                <CalendarDays className="h-4 w-4 mr-2" />
                Mensal
              </TabsTrigger>
              <TabsTrigger value="list">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div>
        <TabsContent value="monthly" className="mt-0">
          <MonthlyCalendarView
            currentMonth={currentDate}
            events={events}
            onDateClick={handleDateSelect}
            onEventClick={handleViewEvent}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Eventos do Mês</CardTitle>
              <CardDescription>
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarEventList
                events={events}
                onViewEvent={handleViewEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os detalhes do evento no calendário escolar."
                : "Adicione um novo evento ao calendário escolar."}
            </DialogDescription>
          </DialogHeader>
          <CalendarEventForm 
            onSubmit={isEditing ? handleUpdateEvent : handleCreateEvent}
            initialData={selectedEvent || undefined}
            isEditing={isEditing}
            onCancel={() => setShowEventForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <CalendarEventDetailDialog
        event={selectedEvent}
        open={showEventDetail}
        onClose={() => setShowEventDetail(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
