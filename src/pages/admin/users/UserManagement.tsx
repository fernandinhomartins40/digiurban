
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { UserPlus, MoreHorizontal, Edit, Trash2, AlertCircle } from "lucide-react";
import { AdminUser, AdminPermission } from "@/types/auth";

export default function UserManagement() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // This would come from an API in a real application
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@prefeitura.gov.br",
      role: "admin",
      department: "Gabinete",
      position: "Assessor",
      permissions: [
        { moduleId: "correio", create: true, read: true, update: true, delete: false },
        { moduleId: "financas", create: false, read: true, update: false, delete: false },
      ],
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria@prefeitura.gov.br",
      role: "admin",
      department: "Finanças",
      position: "Diretora",
      permissions: [
        { moduleId: "financas", create: true, read: true, update: true, delete: true },
      ],
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-01-15T00:00:00Z"
    }
  ]);

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
      permissions: modules.map(module => ({
        moduleId: module.id,
        create: false,
        read: false,
        update: false,
        delete: false
      }))
    });

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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // This would be an API call in a real application
      const newUser: AdminUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: "admin",
        department: formData.department,
        position: formData.position,
        permissions: formData.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUsers([...users, newUser]);
      setIsAddDialogOpen(false);
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
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input 
                  id="department" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange} 
                  required 
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
              <Button type="submit">Adicionar Usuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

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
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.position}</TableCell>
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
                      <DropdownMenuItem>
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
      
      <AddUserDialog />
    </div>
  );
}
