
import React, { useState } from "react";
import { addDays, endOfMonth, format, getDay, startOfMonth, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SchoolCalendarEvent } from "@/services/education/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MonthlyCalendarViewProps {
  date: Date;
  events: SchoolCalendarEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: SchoolCalendarEvent) => void;
}

export function MonthlyCalendarView({
  date,
  events,
  onSelectDate,
  onSelectEvent
}: MonthlyCalendarViewProps) {
  // Get the start and end of the month
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  // Get the start day of the week (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);
  
  // Create calendar array with days before the month start
  const calendarDays: {
    date: Date;
    isCurrentMonth: boolean;
    events: SchoolCalendarEvent[];
  }[] = [];
  
  // Add days before the month start
  for (let i = startDay; i > 0; i--) {
    const day = subDays(monthStart, i);
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      events: []
    });
  }
  
  // Add days of the current month
  let currentDay = monthStart;
  while (currentDay <= monthEnd) {
    // Get events for this day
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start_date);
      return format(eventDate, 'yyyy-MM-dd') === format(currentDay, 'yyyy-MM-dd');
    });
    
    calendarDays.push({
      date: currentDay,
      isCurrentMonth: true,
      events: dayEvents
    });
    currentDay = addDays(currentDay, 1);
  }
  
  // Add days after the month end to complete the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const day = addDays(monthEnd, i);
    calendarDays.push({
      date: day,
      isCurrentMonth: false,
      events: []
    });
  }

  // Group days into weeks
  const weeks: typeof calendarDays[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {/* Header with weekday names */}
      <div className="grid grid-cols-7 text-center">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
          <div
            key={index}
            className="py-2 border-b font-medium text-sm text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-rows-6 h-[600px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 h-full">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "border-t border-l first:border-l-0 p-1",
                  weekIndex === 0 && "border-t-0",
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                )}
                onClick={() => onSelectDate(day.date)}
              >
                <div className="h-full flex flex-col">
                  <div
                    className={cn(
                      "text-right text-sm p-1 mb-1 font-medium",
                      !day.isCurrentMonth && "text-gray-400",
                      format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && 
                        "bg-primary text-primary-foreground rounded-md"
                    )}
                  >
                    {format(day.date, 'd')}
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-1 pr-2">
                      {day.events.map((event) => (
                        <div
                          key={event.id}
                          style={{ 
                            backgroundColor: event.color || "#e5e7eb",
                            borderLeft: `3px solid ${event.color || "#e5e7eb"}`
                          }}
                          className="px-2 py-1 rounded text-xs truncate cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(event);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
