
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AdminUser, CitizenUser } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches a user profile from Supabase based on user ID
 * @param userId The ID of the user to fetch the profile for
 * @param setUser Function to set the user state
 * @param setUserType Function to set the userType state
 * @returns Boolean indicating if a profile was found
 */
export const fetchUserProfile = async (
  userId: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setUserType: React.Dispatch<React.SetStateAction<"admin" | "citizen" | null>>
): Promise<boolean> => {
  console.log("Fetching user profile for ID:", userId);
  
  try {
    // Try to get admin profile
    const { data: adminProfile, error: adminError } = await supabase
      .from("admin_profiles")
      .select("*, admin_permissions(*)")
      .eq("id", userId)
      .maybeSingle();

    if (adminError) {
      console.error("Error fetching admin profile:", adminError);
      throw adminError;
    }

    if (adminProfile) {
      console.log("Admin profile found:", adminProfile);
      
      // Map permissions from the database format to our application format
      const permissions = adminProfile.admin_permissions?.map((permission: any) => ({
        moduleId: permission.module_id,
        create: permission.create_permission,
        read: permission.read_permission,
        update: permission.update_permission,
        delete: permission.delete_permission,
      })) || [];

      // Construct the admin user object with appropriate typing
      const adminUser: AdminUser = {
        id: adminProfile.id,
        email: adminProfile.email,
        name: adminProfile.name,
        role: adminProfile.role as UserRole,
        department: adminProfile.department || undefined,
        position: adminProfile.position || undefined,
        permissions,
        createdAt: adminProfile.created_at,
        updatedAt: adminProfile.updated_at,
      };
      
      setUser(adminUser);
      setUserType("admin");
      console.log("Auth state updated with admin user");
      return true;
    }

    // If not admin, try to get citizen profile
    const { data: citizenProfile, error: citizenError } = await supabase
      .from("citizen_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (citizenError) {
      console.error("Error fetching citizen profile:", citizenError);
      throw citizenError;
    }

    if (citizenProfile) {
      console.log("Citizen profile found:", citizenProfile);
      
      // Map database fields to our application structure
      const citizenUser: CitizenUser = {
        id: citizenProfile.id,
        email: citizenProfile.email,
        name: citizenProfile.name,
        cpf: citizenProfile.cpf || "",
        role: "citizen",
        address: {
          street: citizenProfile.street || "",
          number: citizenProfile.number || "",
          complement: citizenProfile.complement || undefined,
          neighborhood: citizenProfile.neighborhood || "",
          city: citizenProfile.city || "",
          state: citizenProfile.state || "",
          zipCode: citizenProfile.zipcode || "",
        },
        phone: citizenProfile.phone || "",
        createdAt: citizenProfile.created_at,
        updatedAt: citizenProfile.updated_at,
      };
      
      setUser(citizenUser);
      setUserType("citizen");
      console.log("Auth state updated with citizen user");
      return true;
    }

    console.warn("No profile found for user:", userId);
    
    // Attempt to create a profile based on user metadata
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const userType = userData.user.user_metadata?.user_type;
        
        if (userType === "admin") {
          console.log("Creating missing admin profile");
          const { error: createError } = await supabase.from("admin_profiles").insert({
            id: userId,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Admin User",
            role: userData.user.user_metadata?.role || "admin",
            department: userData.user.user_metadata?.department || "",
            position: userData.user.user_metadata?.position || "",
          });
          
          if (createError) {
            console.error("Failed to create admin profile:", createError);
            throw createError;
          }
          
          // Set minimal user object temporarily
          const adminUser: AdminUser = {
            id: userId,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Admin User",
            role: userData.user.user_metadata?.role as UserRole || "admin",
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setUser(adminUser);
          setUserType("admin");
          console.log("Created temporary admin user object");
          
          toast({
            title: "Perfil criado",
            description: "Seu perfil de administrador foi criado com sucesso"
          });
          
          return true;
          
        } else if (userType === "citizen") {
          console.log("Creating missing citizen profile");
          const { error: createError } = await supabase.from("citizen_profiles").insert({
            id: userId,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Citizen User",
            cpf: userData.user.user_metadata?.cpf || "",
            street: userData.user.user_metadata?.street || "",
            number: userData.user.user_metadata?.number || "",
            neighborhood: userData.user.user_metadata?.neighborhood || "",
            city: userData.user.user_metadata?.city || "",
            state: userData.user.user_metadata?.state || "",
            zipcode: userData.user.user_metadata?.zipcode || "",
            phone: userData.user.user_metadata?.phone || "",
          });
          
          if (createError) {
            console.error("Failed to create citizen profile:", createError);
            throw createError;
          }
          
          // Set minimal user object temporarily
          const citizenUser: CitizenUser = {
            id: userId,
            email: userData.user.email || "",
            name: userData.user.user_metadata?.name || "Citizen User",
            cpf: userData.user.user_metadata?.cpf || "",
            role: "citizen",
            address: {
              street: userData.user.user_metadata?.street || "",
              number: userData.user.user_metadata?.number || "",
              neighborhood: userData.user.user_metadata?.neighborhood || "",
              city: userData.user.user_metadata?.city || "",
              state: userData.user.user_metadata?.state || "",
              zipCode: userData.user.user_metadata?.zipcode || ""
            },
            phone: userData.user.user_metadata?.phone || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setUser(citizenUser);
          setUserType("citizen");
          console.log("Created temporary citizen user object");
          
          toast({
            title: "Perfil criado",
            description: "Seu perfil de cidadão foi criado com sucesso"
          });
          
          return true;
        }
      }
      
      console.error("Could not create profile: Insufficient user metadata");
      return false;
      
    } catch (createError) {
      console.error("Error creating profile:", createError);
      return false;
    }
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return false;
  }
};
