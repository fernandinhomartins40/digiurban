
import { supabase } from '@/integrations/supabase/client';
import { School, PaginatedResponse, SchoolsRequestParams } from '@/types/education';

// Helper function to map database format to interface format
function mapDbSchoolToInterface(school: any): School {
  return {
    id: school.id,
    name: school.name,
    inepCode: school.inep_code,
    type: school.type,
    address: school.address,
    neighborhood: school.neighborhood,
    city: school.city,
    state: school.state,
    zipCode: school.zip_code || undefined,
    phone: school.phone || undefined,
    email: school.email || undefined,
    directorName: school.director_name || undefined,
    directorContact: school.director_contact || undefined,
    viceDirectorName: school.vice_director_name || undefined,
    viceDirectorContact: school.vice_director_contact || undefined,
    pedagogicalCoordinator: school.pedagogical_coordinator || undefined,
    maxCapacity: school.max_capacity,
    currentStudents: school.current_students || 0,
    shifts: school.shifts,
    isActive: school.is_active,
    createdAt: school.created_at,
    updatedAt: school.updated_at
  };
}

// Helper function to map interface format to database format
function mapInterfaceSchoolToDb(school: Partial<School>): any {
  return {
    name: school.name,
    inep_code: school.inepCode,
    type: school.type,
    address: school.address,
    neighborhood: school.neighborhood,
    city: school.city,
    state: school.state,
    zip_code: school.zipCode || null,
    phone: school.phone || null,
    email: school.email || null,
    director_name: school.directorName || null,
    director_contact: school.directorContact || null,
    vice_director_name: school.viceDirectorName || null,
    vice_director_contact: school.viceDirectorContact || null,
    pedagogical_coordinator: school.pedagogicalCoordinator || null,
    max_capacity: school.maxCapacity,
    current_students: school.currentStudents || 0,
    shifts: school.shifts || [],
    is_active: school.isActive !== undefined ? school.isActive : true
  };
}

// Get schools with pagination and filters
export async function getSchools(
  params: SchoolsRequestParams = {}
): Promise<PaginatedResponse<School>> {
  try {
    const {
      page = 1,
      pageSize = 10,
      type,
      name,
      neighborhood,
      isActive,
    } = params;

    let query = supabase
      .from('education_schools')
      .select('*', { count: 'exact' });

    // Apply filters
    if (type) {
      query = query.eq('type', type);
    }

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    if (neighborhood) {
      query = query.ilike('neighborhood', `%${neighborhood}%`);
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order('name')
      .range(from, to);

    if (error) throw error;

    // Map database objects to interface format
    const mappedData = data ? data.map(mapDbSchoolToInterface) : [];

    return {
      data: mappedData,
      count: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return {
      data: [],
      count: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };
  }
}

// Get a single school by ID
export async function getSchoolById(id: string) {
  try {
    const { data, error } = await supabase
      .from('education_schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      data: data ? mapDbSchoolToInterface(data) : null,
      error: null
    };
  } catch (error) {
    console.error('Error fetching school:', error);
    return {
      data: null as School | null,
      error
    };
  }
}

// Create a new school
export async function createSchool(school: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const dbSchool = mapInterfaceSchoolToDb(school);

    const { data, error } = await supabase
      .from('education_schools')
      .insert([dbSchool])
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbSchoolToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error creating school:', error);
    return {
      data: null as School | null,
      error
    };
  }
}

// Update an existing school
export async function updateSchool(id: string, school: Partial<School>) {
  try {
    const dbSchool = mapInterfaceSchoolToDb(school);

    const { data, error } = await supabase
      .from('education_schools')
      .update(dbSchool)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: mapDbSchoolToInterface(data),
      error: null
    };
  } catch (error) {
    console.error('Error updating school:', error);
    return {
      data: null as School | null,
      error
    };
  }
}

// Get school statistics
export async function getSchoolStatistics(id: string) {
  try {
    // Get number of classes
    const { count: classesCount, error: classesError } = await supabase
      .from('education_classes')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', id);

    if (classesError) throw classesError;

    // Get number of teachers with this school
    const { count: teachersCount, error: teachersError } = await supabase
      .from('education_teacher_schools')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', id)
      .eq('is_active', true);

    if (teachersError) throw teachersError;

    return {
      data: {
        classesCount: classesCount || 0,
        teachersCount: teachersCount || 0,
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching school statistics:', error);
    return {
      data: {
        classesCount: 0,
        teachersCount: 0,
      },
      error
    };
  }
}
