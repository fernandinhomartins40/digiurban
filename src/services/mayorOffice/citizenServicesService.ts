
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Type definitions
type SearchCitizenServicesParams = {
  searchType: string;
  searchValue: string;
  serviceType?: string;
  dateRange?: string;
  status?: string;
};

type CitizenService = {
  id: string;
  type: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  date?: string;
  protocol?: string;
  citizen?: {
    id: string;
    name: string;
    cpf?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
};

type ServiceDetails = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  protocol?: string;
  date?: string;
  time?: string;
  duration?: number;
  department?: string;
  dueDate?: string;
  createdAt?: string;
  citizenName: string;
  citizenEmail?: string;
  citizenPhone?: string;
  citizenAddress?: string;
  notes?: string;
  benefitType?: string;
  programDetails?: {
    startDate: string;
    endDate?: string;
    status: string;
  };
};

// Get citizen by search criteria
async function getCitizen(searchType: string, searchValue: string) {
  try {
    let query = supabase.from('citizen_profiles').select('*');
    
    if (searchType === 'name') {
      query = query.ilike('name', `%${searchValue}%`);
    } else if (searchType === 'cpf') {
      query = query.eq('cpf', searchValue);
    } else if (searchType === 'id') {
      query = query.eq('id', searchValue);
    } else if (searchType === 'email') {
      query = query.eq('email', searchValue);
    }
    
    const { data, error } = await query.limit(1).single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching citizen:', error.message);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in getCitizen:', error.message);
    return null;
  }
}

// Search for services provided to a citizen
export async function searchCitizenServices(params: SearchCitizenServicesParams): Promise<CitizenService[]> {
  try {
    const { searchType, searchValue, serviceType, dateRange, status } = params;
    
    // First, find the citizen
    const citizen = await getCitizen(searchType, searchValue);
    
    if (!citizen) {
      toast({
        title: 'Cidadão não encontrado',
        description: 'Não foi possível encontrar o cidadão com os dados fornecidos.',
        variant: 'destructive',
      });
      return [];
    }
    
    const citizenId = citizen.id;
    const services: CitizenService[] = [];
    
    // Helper function to apply date filters
    const applyDateFilter = (query: any) => {
      if (dateRange === 'last7days') {
        return query.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      } else if (dateRange === 'last30days') {
        return query.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      } else if (dateRange === 'last90days') {
        return query.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());
      } else if (dateRange === 'lastYear') {
        return query.gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());
      }
      return query;
    };
    
    // Get appointments
    if (!serviceType || serviceType === 'all' || serviceType === 'appointment') {
      let query = supabase.from('mayor_appointments')
        .select('*')
        .eq('requester_id', citizenId);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      query = applyDateFilter(query);
      
      const { data: appointments, error } = await query;
      
      if (error) {
        console.error('Error fetching appointments:', error.message);
      } else if (appointments && appointments.length > 0) {
        appointments.forEach(appointment => {
          services.push({
            id: appointment.id,
            type: 'appointment',
            title: appointment.subject,
            description: appointment.description,
            status: appointment.status,
            priority: appointment.priority,
            date: appointment.requested_date,
            protocol: `AGP-${appointment.id.substring(0, 8)}`,
            citizen: {
              id: citizen.id,
              name: citizen.name,
              cpf: citizen.cpf,
              email: citizen.email,
              phone: citizen.phone,
            },
          });
        });
      }
    }
    
    // Get direct requests
    if (!serviceType || serviceType === 'all' || serviceType === 'direct_request') {
      let query = supabase.from('mayor_direct_requests')
        .select('*')
        .eq('requester_id', citizenId);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      query = applyDateFilter(query);
      
      const { data: requests, error } = await query;
      
      if (error) {
        console.error('Error fetching direct requests:', error.message);
      } else if (requests && requests.length > 0) {
        requests.forEach(request => {
          services.push({
            id: request.id,
            type: 'direct_request',
            title: request.title,
            description: request.description,
            status: request.status,
            priority: request.priority,
            date: request.created_at,
            protocol: request.protocol_number,
            citizen: {
              id: citizen.id,
              name: citizen.name,
              cpf: citizen.cpf,
              email: citizen.email,
              phone: citizen.phone,
            },
          });
        });
      }
    }
    
    // Get emergency benefits
    if (!serviceType || serviceType === 'all' || serviceType === 'benefit') {
      let query = supabase.from('emergency_benefits')
        .select('*')
        .eq('citizen_id', citizenId);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      query = applyDateFilter(query);
      
      const { data: benefits, error } = await query;
      
      if (error) {
        console.error('Error fetching benefits:', error.message);
      } else if (benefits && benefits.length > 0) {
        benefits.forEach(benefit => {
          services.push({
            id: benefit.id,
            type: 'benefit',
            title: `Benefício: ${benefit.benefit_type}`,
            description: benefit.reason,
            status: benefit.status,
            date: benefit.request_date,
            protocol: benefit.protocol_number,
            citizen: {
              id: citizen.id,
              name: citizen.name,
              cpf: citizen.cpf,
              email: citizen.email,
              phone: citizen.phone,
            },
          });
        });
      }
    }
    
    // Get social program participation
    if (!serviceType || serviceType === 'all' || serviceType === 'program') {
      let query = supabase.from('program_beneficiaries')
        .select(`
          *,
          social_programs (*)
        `)
        .eq('citizen_id', citizenId);
      
      if (status && status !== 'all') {
        if (status === 'active') {
          query = query.eq('is_active', true);
        } else if (status === 'inactive') {
          query = query.eq('is_active', false);
        }
      }
      
      query = applyDateFilter(query);
      
      const { data: programs, error } = await query;
      
      if (error) {
        console.error('Error fetching program participation:', error.message);
      } else if (programs && programs.length > 0) {
        programs.forEach(program => {
          if (program.social_programs) {
            services.push({
              id: program.id,
              type: 'program',
              title: `Programa: ${program.social_programs.name}`,
              description: program.social_programs.description,
              status: program.is_active ? 'active' : 'inactive',
              date: program.entry_date,
              citizen: {
                id: citizen.id,
                name: citizen.name,
                cpf: citizen.cpf,
                email: citizen.email,
                phone: citizen.phone,
              },
            });
          }
        });
      }
    }
    
    // Sort services by date (most recent first)
    services.sort((a, b) => {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });
    
    return services;
  } catch (error: any) {
    console.error('Error searching citizen services:', error.message);
    toast({
      title: 'Erro na busca',
      description: error.message,
      variant: 'destructive',
    });
    return [];
  }
}

// Get details for a specific service
export async function getServiceDetails(serviceType: string, serviceId: string): Promise<ServiceDetails | null> {
  try {
    let serviceDetails: ServiceDetails | null = null;
    
    switch (serviceType) {
      case 'appointment': {
        const { data, error } = await supabase
          .from('mayor_appointments')
          .select('*')
          .eq('id', serviceId)
          .single();
        
        if (error) throw error;
        if (!data) return null;
        
        // Get citizen information
        const { data: citizen } = await supabase
          .from('citizen_profiles')
          .select('*')
          .eq('id', data.requester_id || '')
          .single();
        
        serviceDetails = {
          id: data.id,
          title: data.subject,
          description: data.description,
          status: data.status,
          priority: data.priority,
          protocol: `AGP-${data.id.substring(0, 8)}`,
          date: data.requested_date,
          time: data.requested_time,
          duration: data.duration_minutes,
          createdAt: data.created_at,
          citizenName: data.requester_name || (citizen ? citizen.name : 'Não informado'),
          citizenEmail: data.requester_email || (citizen ? citizen.email : undefined),
          citizenPhone: data.requester_phone || (citizen ? citizen.phone : undefined),
          notes: data.admin_notes,
        };
        break;
      }
      
      case 'direct_request': {
        const { data, error } = await supabase
          .from('mayor_direct_requests')
          .select(`
            *,
            mayor_request_comments (*)
          `)
          .eq('id', serviceId)
          .single();
        
        if (error) throw error;
        if (!data) return null;
        
        // Get citizen information
        const { data: citizen } = await supabase
          .from('citizen_profiles')
          .select('*')
          .eq('id', data.requester_id || '')
          .single();
          
        // Compile comments
        let comments = '';
        if (data.mayor_request_comments && data.mayor_request_comments.length > 0) {
          comments = data.mayor_request_comments.map((c: any) => c.comment_text).join('\n\n');
        }
        
        serviceDetails = {
          id: data.id,
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          protocol: data.protocol_number,
          department: data.target_department,
          dueDate: data.due_date,
          createdAt: data.created_at,
          citizenName: citizen ? citizen.name : 'Não informado',
          citizenEmail: citizen ? citizen.email : undefined,
          citizenPhone: citizen ? citizen.phone : undefined,
          citizenAddress: citizen ? `${citizen.street}, ${citizen.number}, ${citizen.neighborhood}, ${citizen.city}/${citizen.state}` : undefined,
          notes: comments || undefined,
        };
        break;
      }
      
      case 'benefit': {
        const { data, error } = await supabase
          .from('emergency_benefits')
          .select(`
            *,
            benefit_attachments (*)
          `)
          .eq('id', serviceId)
          .single();
        
        if (error) throw error;
        if (!data) return null;
        
        // Get citizen information
        const { data: citizen } = await supabase
          .from('citizen_profiles')
          .select('*')
          .eq('id', data.citizen_id || '')
          .single();
        
        serviceDetails = {
          id: data.id,
          title: `Benefício: ${data.benefit_type}`,
          description: data.reason,
          status: data.status,
          protocol: data.protocol_number,
          date: data.request_date,
          createdAt: data.created_at,
          citizenName: citizen ? citizen.name : 'Não informado',
          citizenEmail: citizen ? citizen.email : undefined,
          citizenPhone: citizen ? citizen.phone : undefined,
          citizenAddress: citizen ? `${citizen.street}, ${citizen.number}, ${citizen.neighborhood}, ${citizen.city}/${citizen.state}` : undefined,
          notes: data.comments,
          benefitType: data.benefit_type,
        };
        break;
      }
      
      case 'program': {
        const { data, error } = await supabase
          .from('program_beneficiaries')
          .select(`
            *,
            social_programs (*)
          `)
          .eq('id', serviceId)
          .single();
        
        if (error) throw error;
        if (!data) return null;
        
        // Get citizen information
        const { data: citizen } = await supabase
          .from('citizen_profiles')
          .select('*')
          .eq('id', data.citizen_id || '')
          .single();
        
        serviceDetails = {
          id: data.id,
          title: `Programa: ${data.social_programs?.name || 'Desconhecido'}`,
          description: data.social_programs?.description,
          status: data.is_active ? 'active' : 'inactive',
          date: data.entry_date,
          createdAt: data.created_at,
          citizenName: citizen ? citizen.name : 'Não informado',
          citizenEmail: citizen ? citizen.email : undefined,
          citizenPhone: citizen ? citizen.phone : undefined,
          citizenAddress: citizen ? `${citizen.street}, ${citizen.number}, ${citizen.neighborhood}, ${citizen.city}/${citizen.state}` : undefined,
          notes: undefined,
          programDetails: data.social_programs ? {
            startDate: data.social_programs.start_date,
            endDate: data.social_programs.end_date,
            status: data.social_programs.is_active ? 'active' : 'inactive',
          } : undefined,
        };
        break;
      }
      
      default:
        return null;
    }
    
    return serviceDetails;
  } catch (error: any) {
    console.error(`Error fetching ${serviceType} details:`, error.message);
    toast({
      title: 'Erro ao carregar detalhes',
      description: error.message,
      variant: 'destructive',
    });
    return null;
  }
}
