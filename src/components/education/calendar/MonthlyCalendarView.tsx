
import React, { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SchoolCalendarEvent } from "@/services/education/calendar";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthlyCalendarViewProps {
  currentMonth: Date;
  events: SchoolCalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: SchoolCalendarEvent) => void;
  onChangeMonth: (newMonth: Date) => void;
}

export function MonthlyCalendarView({ 
  currentMonth, 
  events, 
  onDateClick,
  onEventClick,
  onChangeMonth
}: MonthlyCalendarViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Create days array for the calendar
  const daysInMonth = useMemo(() => {
    const daysInterval = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Create cells for the calendar
    const days = daysInterval.map(date => ({
      date,
      isCurrentMonth: true,
      events: events.filter(event => isSameDay(new Date(event.start_date), date))
    }));
    
    return days;
  }, [monthStart, monthEnd, events]);
  
  // Group days by weeks
  const calendarRows = useMemo(() => {
    const rows = [];
    let week = [];
    
    // Add days to weeks
    daysInMonth.forEach(day => {
      week.push(day);
      
      // If it's the last day of the week or the last day of the month, start a new week
      if (week.length === 7 || day.date.getTime() === monthEnd.getTime()) {
        rows.push(week);
        week = [];
      }
    });
    
    return rows;
  }, [daysInMonth, monthEnd]);

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onChangeMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onChangeMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px border-b">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/10">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px">
        {calendarRows.map((week, weekIndex) => (
          // Add empty cells for proper alignment if needed
          React.Children.toArray(
            week.map((day, dayIndex) => (
              <div
                className={cn(
                  "min-h-[100px] p-2 transition-colors",
                  day.isCurrentMonth ? "bg-white" : "bg-muted/20",
                  isToday(day.date) && "bg-muted/10",
                  onDateClick && "cursor-pointer hover:bg-muted/5"
                )}
                onClick={() => onDateClick && onDateClick(day.date)}
              >
                <div className="text-right mb-1">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full text-sm",
                      isToday(day.date) && "bg-primary text-primary-foreground"
                    )}
                  >
                    {format(day.date, "d")}
                  </span>
                </div>
                <div className="space-y-1">
                  {day.events.length > 0 && day.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs truncate cursor-pointer hover:opacity-80",
                        "border-l-2"
                      )}
                      style={{ 
                        backgroundColor: `${event.color}20` || "#f3f4f6",
                        borderLeftColor: event.color || "#6366f1" 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEventClick) onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1.5">
                      + {day.events.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ))}
      </div>
    </div>
  );
}
