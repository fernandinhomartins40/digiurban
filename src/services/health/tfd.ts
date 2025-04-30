
import { supabase } from "@/integrations/supabase/client";
import { TFDReferral, TFDDocument, TFDTransport, TFDStatus } from "@/types/health";

// Helper function to transform database format to our interface format
function mapDbReferralToInterface(referral: any): TFDReferral {
  return {
    id: referral.id,
    protocolNumber: referral.protocol_number,
    patientId: referral.patient_id,
    patientName: referral.patient_name,
    patientCpf: referral.patient_cpf || undefined,
    specialty: referral.specialty,
    destinationCity: referral.destination_city,
    referralReason: referral.referral_reason,
    priority: referral.priority,
    status: referral.status,
    estimatedWaitTime: referral.estimated_wait_time || undefined,
    referredBy: referral.referred_by,
    referredAt: referral.referred_at,
    scheduledDate: referral.scheduled_date || undefined,
    transportId: referral.transport_id || undefined,
    observations: referral.observations || undefined
  };
}

// Helper function to transform our interface format to database format
function mapInterfaceReferralToDb(referral: Partial<TFDReferral>): any {
  const dbReferral: any = {
    patient_name: referral.patientName,
    patient_id: referral.patientId,
    patient_cpf: referral.patientCpf || null,
    specialty: referral.specialty,
    destination_city: referral.destinationCity,
    referral_reason: referral.referralReason,
    priority: referral.priority,
    status: referral.status,
    estimated_wait_time: referral.estimatedWaitTime || null,
    referred_by: referral.referredBy,
    scheduled_date: referral.scheduledDate || null,
    transport_id: referral.transportId || null,
    observations: referral.observations || null
  };
  
  return dbReferral;
}

// Helper function for documents
function mapDbDocumentToInterface(document: any): TFDDocument {
  return {
    id: document.id,
    referralId: document.referral_id,
    documentType: document.document_type,
    fileName: document.file_name,
    fileSize: document.file_size,
    fileType: document.file_type,
    filePath: document.file_path,
    uploadedAt: document.uploaded_at,
    uploadedBy: document.uploaded_by
  };
}

// Helper function for transports
function mapDbTransportToInterface(transport: any): TFDTransport {
  return {
    id: transport.id,
    vehicleId: transport.vehicle_id,
    vehicleDescription: transport.vehicle_description,
    driverId: transport.driver_id,
    driverName: transport.driver_name,
    departureDate: transport.departure_date,
    departureTime: transport.departure_time,
    returnDate: transport.return_date || undefined,
    returnTime: transport.return_time || undefined,
    capacity: transport.capacity,
    occupiedSeats: transport.occupied_seats,
    notes: transport.notes || undefined
  };
}

function mapInterfaceTransportToDb(transport: Partial<TFDTransport>): any {
  return {
    vehicle_id: transport.vehicleId,
    vehicle_description: transport.vehicleDescription,
    driver_id: transport.driverId,
    driver_name: transport.driverName,
    departure_date: transport.departureDate,
    departure_time: transport.departureTime,
    return_date: transport.returnDate || null,
    return_time: transport.returnTime || null,
    capacity: transport.capacity,
    occupied_seats: transport.occupiedSeats || 0,
    notes: transport.notes || null
  };
}

// Get all TFD referrals with pagination and filters
export async function getTFDReferrals(
  page = 1,
  pageSize = 10,
  filters: Partial<{
    patientName: string,
    status: TFDStatus,
    specialty: string,
    destinationCity: string,
    priority: string,
    startDate: string,
    endDate: string
  }> = {}
) {
  try {
    let query = supabase
      .from('tfd_referrals')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.patientName) {
      query = query.ilike('patient_name', `%${filters.patientName}%`);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.specialty) {
      query = query.eq('specialty', filters.specialty);
    }
    
    if (filters.destinationCity) {
      query = query.eq('destination_city', filters.destinationCity);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.startDate) {
      query = query.gte('referred_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('referred_at', filters.endDate);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('referred_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbReferralToInterface) : [];
    
    return {
      data: mappedData,
      count: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching TFD referrals:', error);
    return {
      data: [] as TFDReferral[],
      count: 0,
      page,
      pageSize
    };
  }
}

// Get a single TFD referral by id
export async function getTFDReferralById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tfd_referrals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Map database object to our interface format
    const mappedData = mapDbReferralToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching TFD referral:', error);
    return {
      data: null as TFDReferral | null,
      error
    };
  }
}

// Create a new TFD referral
export async function createTFDReferral(referral: Omit<TFDReferral, 'id' | 'protocolNumber' | 'status' | 'referredAt'>) {
  try {
    // Map our interface format to database format
    const dbReferral = mapInterfaceReferralToDb({
      ...referral,
      status: 'referred',
    });
    
    const { data, error } = await supabase
      .from('tfd_referrals')
      .insert([dbReferral])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbReferralToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error creating TFD referral:', error);
    return {
      data: null as TFDReferral | null,
      error
    };
  }
}

// Update TFD referral status
export async function updateTFDReferralStatus(id: string, status: TFDStatus, observations?: string) {
  try {
    const updates: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (observations) {
      updates.observations = observations;
    }
    
    // If status is 'scheduled', we might want to require a scheduledDate
    
    const { data, error } = await supabase
      .from('tfd_referrals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbReferralToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error updating TFD referral status:', error);
    return {
      data: null as TFDReferral | null,
      error
    };
  }
}

// Upload a document for a TFD referral
export async function uploadTFDDocument(
  referralId: string,
  documentType: string,
  file: File,
  userId: string
) {
  try {
    // First, upload the file to storage
    const fileExt = file.name.split('.').pop();
    const filePath = `tfd/${referralId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: storageError } = await supabase.storage
      .from('tfd_documents')
      .upload(filePath, file);
    
    if (storageError) throw storageError;
    
    // Then create the document record
    const { data, error } = await supabase
      .from('tfd_documents')
      .insert([{
        referral_id: referralId,
        document_type: documentType,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: filePath,
        uploaded_by: userId
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbDocumentToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error uploading TFD document:', error);
    return {
      data: null as TFDDocument | null,
      error
    };
  }
}

// Get documents for a TFD referral
export async function getTFDDocuments(referralId: string) {
  try {
    const { data, error } = await supabase
      .from('tfd_documents')
      .select('*')
      .eq('referral_id', referralId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbDocumentToInterface) : [];
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching TFD documents:', error);
    return {
      data: [] as TFDDocument[],
      error
    };
  }
}

// Create a new TFD transport
export async function createTFDTransport(transport: Omit<TFDTransport, 'id'>) {
  try {
    // Map our interface format to database format
    const dbTransport = mapInterfaceTransportToDb(transport);
    
    const { data, error } = await supabase
      .from('tfd_transports')
      .insert([dbTransport])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map back to our interface format
    const mappedData = mapDbTransportToInterface(data);
    
    return {
      data: mappedData,
      error: null
    };
  } catch (error) {
    console.error('Error creating TFD transport:', error);
    return {
      data: null as TFDTransport | null,
      error
    };
  }
}

// Assign TFD referral to a transport
export async function assignTFDReferralToTransport(referralId: string, transportId: string) {
  try {
    // Update the referral with the transport ID
    const { error: referralError } = await supabase
      .from('tfd_referrals')
      .update({ 
        transport_id: transportId,
        status: 'in-transport',
        updated_at: new Date().toISOString()
      })
      .eq('id', referralId);
    
    if (referralError) throw referralError;
    
    // Increment the occupied_seats count in the transport
    const { data: transportData, error: transportError } = await supabase
      .from('tfd_transports')
      .select('occupied_seats')
      .eq('id', transportId)
      .single();
    
    if (transportError) throw transportError;
    
    const currentOccupiedSeats = transportData.occupied_seats || 0;
    
    const { error: updateError } = await supabase
      .from('tfd_transports')
      .update({ occupied_seats: currentOccupiedSeats + 1 })
      .eq('id', transportId);
    
    if (updateError) throw updateError;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error assigning TFD referral to transport:', error);
    return {
      success: false,
      error
    };
  }
}

// Get TFD transports with pagination and filters
export async function getTFDTransports(
  page = 1,
  pageSize = 10,
  filters: Partial<{
    departureDate: string,
    destinationCity: string,
    vehicleId: string
  }> = {}
) {
  try {
    let query = supabase
      .from('tfd_transports')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.departureDate) {
      query = query.eq('departure_date', filters.departureDate);
    }
    
    if (filters.vehicleId) {
      query = query.eq('vehicle_id', filters.vehicleId);
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('departure_date', { ascending: true })
      .order('departure_time', { ascending: true })
      .range(from, to);
    
    if (error) throw error;
    
    // Map database objects to our interface format
    const mappedData = data ? data.map(mapDbTransportToInterface) : [];
    
    return {
      data: mappedData,
      count: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching TFD transports:', error);
    return {
      data: [] as TFDTransport[],
      count: 0,
      page,
      pageSize
    };
  }
}

// Download a TFD document
export async function downloadTFDDocument(filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from('tfd_documents')
      .download(filePath);
    
    if (error) throw error;
    
    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error downloading TFD document:', error);
    return {
      data: null,
      error
    };
  }
}
