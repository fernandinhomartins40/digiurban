
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserPlus, MoreHorizontal, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { AdminUser, AdminPermission } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export default function UserManagement() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Fetch admin users
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('admin_profiles')
          .select(`
            *,
            admin_permissions(*)
          `)
          .order('name');

        if (error) {
          throw error;
        }

        // Transform data to match our User type
        const transformedUsers: AdminUser[] = data.map((admin: any) => ({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          department: admin.department,
          position: admin.position,
          permissions: admin.admin_permissions.map((permission: any) => ({
            moduleId: permission.module_id,
            create: permission.create_permission,
            read: permission.read_permission,
            update: permission.update_permission,
            delete: permission.delete_permission,
          })),
          createdAt: admin.created_at,
          updatedAt: admin.updated_at
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários administrativos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUsers();
  }, []);

  // Check if user is allowed to manage users (only prefeito can)
  const isPrefeitoUser = user?.role === "prefeito";

  if (!isPrefeitoUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Somente o Prefeito tem acesso a este módulo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const modules = [
    { id: "correio", name: "Correio Interno" },
    { id: "administracao", name: "Administração" },
    { id: "financas", name: "Finanças" },
    { id: "educacao", name: "Educação" },
    { id: "saude", name: "Saúde" },
    { id: "assistencia", name: "Assistência Social" },
    { id: "obras", name: "Obras Públicas" },
    { id: "servicos", name: "Serviços Públicos" },
    { id: "meioambiente", name: "Meio Ambiente" },
  ];

  const AddUserDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      department: "",
      position: "",
      password: "",
      confirmPassword: "",
      permissions: modules.map(module => ({
        moduleId: module.id,
        create: false,
        read: false,
        update: false,
        delete: false
      }))
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const validateForm = () => {
      const errors: Record<string, string> = {};
      
      if (!formData.name.trim()) errors.name = "Nome é obrigatório";
      if (!formData.email.trim()) errors.email = "Email é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
        errors.email = "Email inválido";
      
      if (!formData.password) errors.password = "Senha é obrigatória";
      else if (formData.password.length < 6) 
        errors.password = "Senha deve ter pelo menos 6 caracteres";
      
      if (formData.password !== formData.confirmPassword) 
        errors.confirmPassword = "As senhas não coincidem";
        
      return errors;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

    const handlePermissionChange = (moduleId: string, action: keyof Omit<AdminPermission, 'moduleId'>, checked: boolean) => {
      setFormData({
        ...formData,
        permissions: formData.permissions.map(permission => 
          permission.moduleId === moduleId 
            ? { ...permission, [action]: checked } 
            : permission
        )
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        // 1. Register the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              user_type: 'admin',
              department: formData.department,
              position: formData.position,
              role: 'admin'
            }
          }
        });
        
        if (authError) throw authError;
        
        // 2. Add permissions (handled by trigger for basic user creation)
        for (const permission of formData.permissions) {
          const { error: permError } = await supabase
            .from('admin_permissions')
            .insert({
              admin_id: authData.user!.id,
              module_id: permission.moduleId,
              create_permission: permission.create,
              read_permission: permission.read,
              update_permission: permission.update,
              delete_permission: permission.delete
            });
            
          if (permError) throw permError;
        }
        
        // 3. Fetch the newly created user with permissions
        const { data: newUserData, error: fetchError } = await supabase
          .from('admin_profiles')
          .select('*, admin_permissions(*)')
          .eq('id', authData.user!.id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // 4. Transform and add to UI
        const newUser: AdminUser = {
          id: newUserData.id,
          name: newUserData.name,
          email: newUserData.email,
          role: newUserData.role,
          department: newUserData.department,
          position: newUserData.position,
          permissions: newUserData.admin_permissions.map((p: any) => ({
            moduleId: p.module_id,
            create: p.create_permission,
            read: p.read_permission,
            update: p.update_permission,
            delete: p.delete_permission
          })),
          createdAt: newUserData.created_at,
          updatedAt: newUserData.updated_at
        };
        
        setUsers([...users, newUser]);
        toast({
          title: "Usuário adicionado",
          description: "O usuário foi adicionado com sucesso."
        });
        setIsAddDialogOpen(false);
      } catch (error: any) {
        console.error("Error adding user:", error);
        toast({
          title: "Erro ao adicionar usuário",
          description: error.message || "Não foi possível adicionar o usuário.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Cadastre um novo usuário e configure suas permissões no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className={formErrors.password ? "border-red-500" : ""}
                />
                {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  className={formErrors.confirmPassword ? "border-red-500" : ""}
                />
                {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input 
                  id="department" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label>Permissões</Label>
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Módulo</TableHead>
                    <TableHead className="text-center">Visualizar</TableHead>
                    <TableHead className="text-center">Criar</TableHead>
                    <TableHead className="text-center">Editar</TableHead>
                    <TableHead className="text-center">Excluir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => {
                    const permission = formData.permissions.find(p => p.moduleId === module.id);
                    
                    return (
                      <TableRow key={module.id}>
                        <TableCell>{module.name}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={permission?.read || false} 
                            onCheckedChange={(checked) => 
                              handlePermissionChange(module.id, 'read', !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={permission?.create || false} 
                            onCheckedChange={(checked) => 
                              handlePermissionChange(module.id, 'create', !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={permission?.update || false} 
                            onCheckedChange={(checked) => 
                              handlePermissionChange(module.id, 'update', !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={permission?.delete || false} 
                            onCheckedChange={(checked) => 
                              handlePermissionChange(module.id, 'delete', !!checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user from auth (this will cascade to profiles and permissions due to foreign keys)
      // Note: In production, this would require admin privileges
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Update UI state
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso."
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao remover usuário",
        description: error.message || "Não foi possível remover o usuário.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema e suas permissões.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum usuário administrativo cadastrado.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || "-"}</TableCell>
                  <TableCell>{user.position || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <AddUserDialog />
    </div>
  );
}
