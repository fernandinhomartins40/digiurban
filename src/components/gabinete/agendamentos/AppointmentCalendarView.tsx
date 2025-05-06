
import React, { useState, useEffect } from "react";
import { format, startOfMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { 
  Appointment, 
  AppointmentStatus 
} from "@/types/mayorOffice";
import { getMayorAppointments } from "@/services/mayorOffice/appointmentsService";
import { DailyAppointmentsList } from "./DailyAppointmentsList";

interface AppointmentCalendarViewProps {
  filterStatus?: AppointmentStatus | "all";
  searchTerm?: string;
  onAppointmentClick: (appointment: Appointment) => void;
}

export function AppointmentCalendarView({
  filterStatus = "all",
  searchTerm = "",
  onAppointmentClick
}: AppointmentCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch appointments for the current month
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getMayorAppointments(
          filterStatus === "all" ? undefined : filterStatus,
          searchTerm
        );
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments for calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filterStatus, searchTerm, currentMonth]);

  // Handle month change
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(startOfMonth(date));
    setSelectedDay(undefined);
  };

  // Group appointments by date for the calendar view
  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>(
    (acc, appointment) => {
      const dateKey = format(new Date(appointment.requestedDate), "yyyy-MM-dd");
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(appointment);
      return acc;
    },
    {}
  );

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: Date): Appointment[] => {
    const dateKey = format(day, "yyyy-MM-dd");
    return appointmentsByDate[dateKey] || [];
  };

  // Render calendar with appointment dots
  const renderCalendarCell = (day: Date) => {
    const dayAppointments = getAppointmentsForDay(day);
    if (dayAppointments.length === 0) return null;

    // Count appointments by status
    const statusCounts: Record<AppointmentStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0
    };

    dayAppointments.forEach(apt => {
      statusCounts[apt.status]++;
    });

    return (
      <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
        {statusCounts.pending > 0 && (
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
        )}
        {statusCounts.approved > 0 && (
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-green-500" />
        )}
        {statusCounts.completed > 0 && (
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        )}
        {statusCounts.rejected > 0 && (
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-red-500" />
        )}
        {statusCounts.cancelled > 0 && (
          <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-gray-500" />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando agenda...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="md:flex-1">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={handleMonthChange}
            selected={selectedDay}
            onSelect={setSelectedDay}
            locale={ptBR}
            modifiers={{
              hasAppointment: (date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                return !!appointmentsByDate[dateKey];
              }
            }}
            modifiersStyles={{
              hasAppointment: {
                fontWeight: "bold",
                textDecoration: "underline"
              }
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="flex flex-col items-center">
                  <span>{date.getDate()}</span>
                  {renderCalendarCell(date)}
                </div>
              )
            }}
            className="rounded-md border pointer-events-auto"
            disabled={(date) => {
              // Optional: Disable past days
              // return date < new Date();
              return false;
            }}
          />
        </CardContent>
      </Card>

      {selectedDay && (
        <Card className="md:flex-1">
          <CardContent className="pt-6">
            <DailyAppointmentsList 
              date={selectedDay} 
              appointments={getAppointmentsForDay(selectedDay)}
              onAppointmentClick={onAppointmentClick}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
