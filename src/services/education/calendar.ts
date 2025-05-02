
import { format, parseISO } from "date-fns";

export interface SchoolCalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  event_type: 'class' | 'holiday' | 'exam' | 'meeting' | 'event' | 'other';
  school_id?: string;
  school_year: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  all_day: boolean;
  location?: string;
  color?: string;
}

// Mock events data
const mockEvents: SchoolCalendarEvent[] = [
  {
    id: "1",
    title: "Início do Ano Letivo",
    description: "Primeiro dia de aula para todos os alunos",
    start_date: "2025-02-03T08:00:00",
    event_type: "class",
    school_year: 2025,
    created_by: "admin",
    created_at: "2025-01-15T10:30:00",
    updated_at: "2025-01-15T10:30:00",
    all_day: true,
    color: "#4ade80" // Green
  },
  {
    id: "2",
    title: "Feriado - Carnaval",
    start_date: "2025-02-25T00:00:00",
    end_date: "2025-02-26T23:59:59",
    event_type: "holiday",
    school_year: 2025,
    created_by: "admin",
    created_at: "2025-01-15T10:35:00",
    updated_at: "2025-01-15T10:35:00",
    all_day: true,
    color: "#f87171" // Red
  },
  {
    id: "3",
    title: "Avaliação Bimestral - Matemática",
    description: "Avaliação do primeiro bimestre",
    start_date: "2025-04-15T08:00:00",
    end_date: "2025-04-15T10:00:00",
    event_type: "exam",
    school_year: 2025,
    created_by: "teacher1",
    created_at: "2025-02-10T14:20:00",
    updated_at: "2025-02-10T14:20:00",
    all_day: false,
    location: "Sala 101",
    color: "#60a5fa" // Blue
  },
  {
    id: "4",
    title: "Reunião de Pais e Mestres",
    description: "Discussão sobre o desempenho dos alunos no primeiro bimestre",
    start_date: "2025-04-20T19:00:00",
    end_date: "2025-04-20T21:00:00",
    event_type: "meeting",
    school_year: 2025,
    created_by: "admin",
    created_at: "2025-03-01T11:45:00",
    updated_at: "2025-03-01T11:45:00",
    all_day: false,
    location: "Auditório",
    color: "#a78bfa" // Purple
  },
  {
    id: "5",
    title: "Feira de Ciências",
    description: "Exposição de projetos científicos desenvolvidos pelos alunos",
    start_date: "2025-05-10T09:00:00",
    end_date: "2025-05-10T16:00:00",
    event_type: "event",
    school_year: 2025,
    created_by: "teacher2",
    created_at: "2025-03-15T09:20:00",
    updated_at: "2025-03-15T09:20:00",
    all_day: true,
    location: "Quadra Poliesportiva",
    color: "#fbbf24" // Amber
  }
];

// Get events for a specific month and year
export async function fetchCalendarEvents(month?: number, year?: number, schoolId?: string): Promise<SchoolCalendarEvent[]> {
  // In a real implementation, we would filter by month and year
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredEvents = [...mockEvents];
      
      if (month !== undefined && year !== undefined) {
        filteredEvents = mockEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
      }
      
      if (schoolId) {
        filteredEvents = filteredEvents.filter(event => 
          !event.school_id || event.school_id === schoolId
        );
      }
      
      resolve(filteredEvents);
    }, 500);
  });
}

// Get a specific event by ID
export async function fetchCalendarEventById(eventId: string): Promise<SchoolCalendarEvent | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === eventId);
      resolve(event || null);
    }, 300);
  });
}

// Create a new calendar event
export async function createCalendarEvent(event: Omit<SchoolCalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<SchoolCalendarEvent> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = (mockEvents.length + 1).toString();
      const timestamp = new Date().toISOString();
      
      const newEvent: SchoolCalendarEvent = {
        ...event,
        id: newId,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // In a real implementation, we would add to the database
      mockEvents.push(newEvent);
      
      resolve(newEvent);
    }, 500);
  });
}

// Update an existing calendar event
export async function updateCalendarEvent(eventId: string, updates: Partial<SchoolCalendarEvent>): Promise<SchoolCalendarEvent | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        resolve(null);
        return;
      }
      
      const updatedEvent: SchoolCalendarEvent = {
        ...mockEvents[eventIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // In a real implementation, we would update the database
      mockEvents[eventIndex] = updatedEvent;
      
      resolve(updatedEvent);
    }, 500);
  });
}

// Delete a calendar event
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex === -1) {
        resolve(false);
        return;
      }
      
      // In a real implementation, we would remove from the database
      mockEvents.splice(eventIndex, 1);
      
      resolve(true);
    }, 500);
  });
}

// Helper function to get event type display name and color
export function getEventTypeInfo(eventType: SchoolCalendarEvent['event_type']) {
  switch (eventType) {
    case 'class':
      return { label: 'Aula', color: '#4ade80' }; // Green
    case 'holiday':
      return { label: 'Feriado', color: '#f87171' }; // Red
    case 'exam':
      return { label: 'Avaliação', color: '#60a5fa' }; // Blue
    case 'meeting':
      return { label: 'Reunião', color: '#a78bfa' }; // Purple
    case 'event':
      return { label: 'Evento', color: '#fbbf24' }; // Amber
    default:
      return { label: 'Outro', color: '#94a3b8' }; // Slate
  }
}

// Format the event date for display
export function formatEventDate(startDate: string, endDate?: string, allDay: boolean = false): string {
  const start = parseISO(startDate);
  
  if (allDay) {
    return format(start, 'dd/MM/yyyy');
  }
  
  const formattedStart = format(start, 'dd/MM/yyyy HH:mm');
  
  if (endDate) {
    const end = parseISO(endDate);
    const formattedEnd = format(end, 'dd/MM/yyyy HH:mm');
    return `${formattedStart} - ${formattedEnd}`;
  }
  
  return formattedStart;
}
