
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
}

// Create authenticated Supabase client using the request
function createServerClient(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}

// Validate request and check if user is prefeito
async function validateRequest(supabase: any, userId: string) {
  // Get current user role
  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    return { valid: false, message: 'Unauthorized: User profile not found' };
  }

  // Only prefeito can perform admin operations
  if (profile.role !== 'prefeito') {
    return { valid: false, message: 'Unauthorized: Only prefeito can perform this operation' };
  }

  return { valid: true };
}

// Log admin operation
async function logOperation(supabase: any, operationType: string, performedBy: string, targetUserId: string | null, details: any = {}) {
  try {
    await supabase.from('admin_operations_log').insert({
      operation_type: operationType,
      performed_by: performedBy,
      target_user_id: targetUserId,
      details,
    });
  } catch (error) {
    console.error('Error logging operation:', error);
    // Non-blocking - continue even if logging fails
  }
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { operation, userId, userData } = await req.json();
    
    // Create Supabase client
    const supabase = createServerClient(req);

    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // Validate request
    const validation = await validateRequest(supabase, user.id);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.message }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;

    // Process different operations
    switch (operation) {
      case 'deleteUser':
        console.log(`Deleting user ${userId}`);
        // First fetch user info for logging purposes
        const { data: userToDelete } = await supabase
          .from('admin_profiles')
          .select('email, name')
          .eq('id', userId)
          .single();

        // Delete user from auth (this will cascade to profiles and permissions thanks to foreign key)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        
        if (deleteError) {
          throw deleteError;
        }

        // Log operation
        await logOperation(supabase, 'deleteUser', user.id, userId, { 
          deletedUserEmail: userToDelete?.email,
          deletedUserName: userToDelete?.name 
        });

        result = { success: true, message: 'User deleted successfully' };
        break;
        
      case 'resetPassword':
        console.log(`Resetting password for user ${userId}`);
        // Get user email
        const { data: userToReset } = await supabase
          .from('admin_profiles')
          .select('email')
          .eq('id', userId)
          .single();
          
        if (!userToReset?.email) {
          throw new Error('User not found or email not available');
        }

        // Reset password
        const { error: resetError } = await supabase.auth.admin.sendPasswordResetEmail(userToReset.email);
        
        if (resetError) {
          throw resetError;
        }

        // Log operation
        await logOperation(supabase, 'resetPassword', user.id, userId, { 
          userEmail: userToReset.email
        });

        result = { success: true, message: 'Password reset email sent' };
        break;

      case 'updateUser':
        console.log(`Updating user ${userData.id}`);
        // Extract permissions
        const { permissions, ...userDataWithoutPermissions } = userData;
        
        // Update profile
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .update({
            name: userData.name,
            email: userData.email,
            department: userData.department,
            position: userData.position,
            role: userData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);
          
        if (profileError) {
          throw profileError;
        }
        
        // Update permissions - first delete existing ones
        const { error: deletePermError } = await supabase
          .from('admin_permissions')
          .delete()
          .eq('admin_id', userData.id);
          
        if (deletePermError) {
          throw deletePermError;
        }
        
        // Then insert new permissions
        const permissionsToInsert = permissions.map((p: any) => ({
          admin_id: userData.id,
          module_id: p.moduleId,
          create_permission: p.create,
          read_permission: p.read,
          update_permission: p.update,
          delete_permission: p.delete
        }));
        
        const { error: insertPermError } = await supabase
          .from('admin_permissions')
          .insert(permissionsToInsert);
          
        if (insertPermError) {
          throw insertPermError;
        }

        // Log operation
        await logOperation(supabase, 'updateUser', user.id, userData.id, { 
          updatedFields: Object.keys(userDataWithoutPermissions)
        });

        result = { success: true, message: 'User updated successfully' };
        break;

      case 'createUser':
        console.log('Creating new user');
        const { password, confirmPassword, permissions, ...userMetadata } = userData;
        
        // Register the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            ...userMetadata,
            user_type: 'admin'
          }
        });
        
        if (authError) {
          throw authError;
        }
        
        if (!authData.user) {
          throw new Error('Error creating user: No user data returned');
        }
        
        // Add permissions
        for (const permission of permissions) {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .insert({
              admin_id: authData.user.id,
              module_id: permission.moduleId,
              create_permission: permission.create,
              read_permission: permission.read,
              update_permission: permission.update,
              delete_permission: permission.delete
            });
            
          if (permError) {
            throw permError;
          }
        }
        
        // Fetch the newly created user
        const { data: newUser, error: fetchError } = await supabase
          .from('admin_profiles')
          .select('*, admin_permissions(*)')
          .eq('id', authData.user.id)
          .single();
          
        if (fetchError) {
          throw fetchError;
        }

        // Log operation
        await logOperation(supabase, 'createUser', user.id, authData.user.id, { 
          email: userData.email,
          role: userData.role
        });

        // Transform user for response
        const transformedUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          position: newUser.position,
          permissions: newUser.admin_permissions.map((p: any) => ({
            moduleId: p.module_id,
            create: p.create_permission,
            read: p.read_permission,
            update: p.update_permission,
            delete: p.delete_permission
          })),
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at
        };

        result = { 
          success: true, 
          message: 'User created successfully', 
          user: transformedUser 
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
