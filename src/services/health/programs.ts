
import { supabase } from "@/integrations/supabase/client";
import { HealthProgram, ProgramParticipant, ProgramActivity } from "@/types/health";

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
    
    return {
      data: data as HealthProgram[],
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
    
    return {
      data: data as HealthProgram,
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
    const { data, error } = await supabase
      .from('health_programs')
      .insert([program])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: data as HealthProgram,
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
    const { data, error } = await supabase
      .from('health_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: data as HealthProgram,
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
    const { data, error } = await supabase
      .from('health_program_participants')
      .insert([participant])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: data as ProgramParticipant,
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
    
    return {
      data: data as ProgramParticipant[],
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
    
    const programs = data.map(item => item.health_programs) as HealthProgram[];
    
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
    const { data, error } = await supabase
      .from('health_program_activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: data as ProgramActivity,
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
    
    return {
      data: data as ProgramActivity[],
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
        absentParticipants.push(participant);
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
