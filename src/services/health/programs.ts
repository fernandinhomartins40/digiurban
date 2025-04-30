
import { supabase } from "@/integrations/supabase/client";
import { HealthProgram, ProgramParticipant, ProgramActivity } from "@/types/health";

// Helper function to transform the database format (snake_case) to our interface format (camelCase)
function mapDbProgramToInterface(program: any): HealthProgram {
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    startDate: program.start_date,
    endDate: program.end_date || null,
    isActive: program.is_active,
    meetingFrequency: program.meeting_frequency || null,
    coordinatorId: program.coordinator_id,
    coordinatorName: program.coordinator_name,
    category: program.category,
    createdAt: program.created_at
  };
}

// Helper function to transform our interface format (camelCase) to the database format (snake_case)
function mapInterfaceProgramToDb(program: Partial<HealthProgram>): any {
  return {
    name: program.name,
    description: program.description,
    start_date: program.startDate,
    end_date: program.endDate || null,
    is_active: program.isActive,
    meeting_frequency: program.meetingFrequency || null,
    coordinator_id: program.coordinatorId,
    coordinator_name: program.coordinatorName,
    category: program.category
  };
}

// Helper function for participants
function mapDbParticipantToInterface(participant: any): ProgramParticipant {
  return {
    id: participant.id,
    programId: participant.program_id,
    patientId: participant.patient_id,
    patientName: participant.patient_name,
    joinDate: participant.join_date,
    exitDate: participant.exit_date || null,
    isActive: participant.is_active,
    notes: participant.notes || null,
    metrics: participant.metrics || null
  };
}

// Helper function to map interface participant to db format
function mapInterfaceParticipantToDb(participant: Partial<ProgramParticipant>): any {
  return {
    program_id: participant.programId,
    patient_id: participant.patientId,
    patient_name: participant.patientName,
    join_date: participant.joinDate,
    exit_date: participant.exitDate || null,
    is_active: participant.isActive,
    notes: participant.notes || null,
    metrics: participant.metrics || null
  };
}

// Helper function for activities
function mapDbActivityToInterface(activity: any): ProgramActivity {
  return {
    id: activity.id,
    programId: activity.program_id,
    title: activity.title,
    description: activity.description || null,
    date: activity.date,
    time: activity.time,
    location: activity.location,
    responsibleId: activity.responsible_id,
    responsibleName: activity.responsible_name,
    maxParticipants: activity.max_participants || null,
    actualParticipants: activity.actual_participants || null,
    status: activity.status
  };
}

// Helper function to map interface activity to db format
function mapInterfaceActivityToDb(activity: Partial<ProgramActivity>): any {
  return {
    program_id: activity.programId,
    title: activity.title,
    description: activity.description || null,
    date: activity.date,
    time: activity.time,
    location: activity.location,
    responsible_id: activity.responsibleId,
    responsible_name: activity.responsibleName,
    max_participants: activity.maxParticipants || null,
    actual_participants: activity.actualParticipants || null,
    status: activity.status
  };
}

// Get all health programs with pagination and filters
export async function getHealthPrograms(
  page = 1,
  pageSize = 10,
  filters: Partial<{
    name: string,
    category: string,
    isActive: boolean,
    coordinatorId: string
  }> = {}
) {
  try {
    let query = supabase
      .from('health_programs')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    
    if (filters.coordinatorId) {
      query = query.eq('coordinator_id', filters.coordinatorId);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbProgramToInterface) : [];
    
    return {
      data: mappedData,
      count: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching health programs:', error);
    return {
      data: [] as HealthProgram[],
      count: 0,
      page,
      pageSize
    };
  }
}

// Get a single health program by id
export async function getHealthProgramById(id: string) {
  try {
    const { data, error } = await supabase
      .from('health_programs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map database object to our interface format
    const mappedData = mapDbProgramToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching health program:', error);
    return {
      data: null as HealthProgram | null,
      error
    };
  }
}

// Create a new health program
export async function createHealthProgram(program: Omit<HealthProgram, 'id' | 'createdAt'>) {
  try {
    // Map our interface format to database format
    const dbProgram = mapInterfaceProgramToDb(program);
    
    const { data, error } = await supabase
      .from('health_programs')
      .insert([dbProgram])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbProgramToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error creating health program:', error);
    return {
      data: null as HealthProgram | null,
      error
    };
  }
}

// Update a health program
export async function updateHealthProgram(id: string, updates: Partial<HealthProgram>) {
  try {
    // Map our interface format to database format
    const dbUpdates = mapInterfaceProgramToDb(updates);
    
    const { data, error } = await supabase
      .from('health_programs')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbProgramToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error updating health program:', error);
    return {
      data: null as HealthProgram | null,
      error
    };
  }
}

// Register a participant to a program
export async function registerProgramParticipant(participant: Omit<ProgramParticipant, 'id'>) {
  try {
    // Map our interface format to database format
    const dbParticipant = mapInterfaceParticipantToDb(participant);
    
    const { data, error } = await supabase
      .from('health_program_participants')
      .insert([dbParticipant])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbParticipantToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error registering program participant:', error);
    return {
      data: null as ProgramParticipant | null,
      error
    };
  }
}

// Get participants for a program
export async function getProgramParticipants(programId: string) {
  try {
    const { data, error } = await supabase
      .from('health_program_participants')
      .select('*')
      .eq('program_id', programId)
      .order('join_date', { ascending: false });
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbParticipantToInterface) : [];
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching program participants:', error);
    return {
      data: [] as ProgramParticipant[],
      error
    };
  }
}

// Get programs for a participant
export async function getParticipantPrograms(patientId: string) {
  try {
    const { data, error } = await supabase
      .from('health_program_participants')
      .select(`
        *,
        health_programs:program_id (*)
      `)
      .eq('patient_id', patientId);
    
    if (error) throw error;
    
    // Map and extract the programs
    const programs = data.map(item => mapDbProgramToInterface(item.health_programs));
    
    return {
      data: programs,
      error: null
    };
  } catch (error) {
    console.error('Error fetching participant programs:', error);
    return {
      data: [] as HealthProgram[],
      error
    };
  }
}

// Create a program activity
export async function createProgramActivity(activity: Omit<ProgramActivity, 'id'>) {
  try {
    // Map our interface format to database format
    const dbActivity = mapInterfaceActivityToDb(activity);
    
    const { data, error } = await supabase
      .from('health_program_activities')
      .insert([dbActivity])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbActivityToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error creating program activity:', error);
    return {
      data: null as ProgramActivity | null,
      error
    };
  }
}

// Get activities for a program
export async function getProgramActivities(programId: string) {
  try {
    const { data, error } = await supabase
      .from('health_program_activities')
      .select('*')
      .eq('program_id', programId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbActivityToInterface) : [];
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching program activities:', error);
    return {
      data: [] as ProgramActivity[],
      error
    };
  }
}

// Record participant attendance in an activity
export async function recordProgramAttendance(activityId: string, participantIds: string[]) {
  try {
    // First, create array of attendance records
    const attendanceRecords = participantIds.map(participantId => ({
      activity_id: activityId,
      participant_id: participantId,
      attended: true
    }));
    
    const { error } = await supabase
      .from('health_program_attendance')
      .upsert(attendanceRecords, { 
        onConflict: 'activity_id,participant_id',
        ignoreDuplicates: false
      });
    
    if (error) throw error;
    
    // Update actual_participants count
    await supabase
      .from('health_program_activities')
      .update({ actual_participants: participantIds.length })
      .eq('id', activityId);
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error recording attendance:', error);
    return {
      success: false,
      error
    };
  }
}

// Get participants who have missed activities
export async function getAbsentParticipants(programId: string, threshold: number = 2) {
  try {
    // This is a more complex query that might require a custom SQL function
    // Here's a simplified approach that gets participants who have missed activities
    const { data: activities, error: activitiesError } = await supabase
      .from('health_program_activities')
      .select('id')
      .eq('program_id', programId)
      .eq('status', 'completed');
    
    if (activitiesError) throw activitiesError;
    
    // Get all participants of the program
    const { data: participants, error: participantsError } = await supabase
      .from('health_program_participants')
      .select('*')
      .eq('program_id', programId)
      .eq('is_active', true);
    
    if (participantsError) throw participantsError;
    
    // For each participant, count absences
    const activityIds = activities.map(a => a.id);
    
    // If no completed activities, return empty array
    if (activityIds.length === 0) {
      return {
        data: [],
        error: null
      };
    }
    
    const absentParticipants = [];
    
    for (const participant of participants) {
      const { data: attendance, error: attendanceError } = await supabase
        .from('health_program_attendance')
        .select('*')
        .eq('participant_id', participant.id)
        .in('activity_id', activityIds)
        .eq('attended', true);
      
      if (attendanceError) throw attendanceError;
      
      // If attended activities is less than total - threshold, they're considered absent
      if (attendance.length <= activityIds.length - threshold) {
        absentParticipants.push(mapDbParticipantToInterface(participant));
      }
    }
    
    return {
      data: absentParticipants as ProgramParticipant[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching absent participants:', error);
    return {
      data: [] as ProgramParticipant[],
      error
    };
  }
}
