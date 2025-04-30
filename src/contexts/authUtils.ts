
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/auth";

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
      .single();

    if (adminError && adminError.code !== 'PGRST116') {
      console.error("Error fetching admin profile:", adminError);
    }

    if (adminProfile) {
      console.log("Admin profile found:", adminProfile);
      const permissions = adminProfile.admin_permissions?.map((permission: any) => ({
        moduleId: permission.module_id,
        create: permission.create_permission,
        read: permission.read_permission,
        update: permission.update_permission,
        delete: permission.delete_permission,
      })) || [];

      setUser({
        id: adminProfile.id,
        email: adminProfile.email,
        name: adminProfile.name,
        role: adminProfile.role as UserRole,
        department: adminProfile.department,
        position: adminProfile.position,
        permissions,
        createdAt: adminProfile.created_at,
        updatedAt: adminProfile.updated_at,
      });
      setUserType("admin");
      return true;
    }

    // If not admin, try to get citizen profile
    const { data: citizenProfile, error: citizenError } = await supabase
      .from("citizen_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (citizenError && citizenError.code !== 'PGRST116') {
      console.error("Error fetching citizen profile:", citizenError);
    }

    if (citizenProfile) {
      console.log("Citizen profile found:", citizenProfile);
      setUser({
        id: citizenProfile.id,
        email: citizenProfile.email,
        name: citizenProfile.name,
        cpf: citizenProfile.cpf,
        role: "citizen",
        address: {
          street: citizenProfile.street,
          number: citizenProfile.number,
          complement: citizenProfile.complement || "", // Added null check for complement
          neighborhood: citizenProfile.neighborhood,
          city: citizenProfile.city,
          state: citizenProfile.state,
          zipCode: citizenProfile.zipcode,
        },
        phone: citizenProfile.phone,
        createdAt: citizenProfile.created_at,
        updatedAt: citizenProfile.updated_at,
      });
      setUserType("citizen");
      return true;
    }

    // No profile found but user is authenticated in Supabase
    console.warn("User authenticated but no profile found. Will log out.", userId);
    return false;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return false;
  }
};
