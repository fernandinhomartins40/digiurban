
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
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
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { UserPermissionsForm } from "./UserPermissionsForm";
import { AdminPermission } from "@/types/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
}

export function UserRolesManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<RoleTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as AdminPermission[],
  });

  // Sample role templates for now - in a real implementation, these would come from the database
  useEffect(() => {
    // Simulate loading role templates
    setIsLoading(false);
    setRoleTemplates([
      {
        id: "1",
        name: "Administrador de Departamento",
        description: "Acesso completo ao departamento específico",
        permissions: [
          { moduleId: "administracao", create: true, read: true, update: true, delete: true },
          { moduleId: "financas", create: false, read: true, update: false, delete: false },
          { moduleId: "correio", create: true, read: true, update: true, delete: true },
          { moduleId: "chat", create: true, read: true, update: true, delete: false },
        ]
      },
      {
        id: "2",
        name: "Servidor Regular",
        description: "Acesso de leitura à maioria dos módulos",
        permissions: [
          { moduleId: "administracao", create: false, read: true, update: false, delete: false },
          { moduleId: "financas", create: false, read: true, update: false, delete: false },
          { moduleId: "correio", create: true, read: true, update: true, delete: false },
          { moduleId: "chat", create: true, read: true, update: true, delete: false },
        ]
      },
      {
        id: "3",
        name: "Acesso Mínimo",
        description: "Apenas funcionalidades básicas",
        permissions: [
          { moduleId: "administracao", create: false, read: true, update: false, delete: false },
          { moduleId: "correio", create: false, read: true, update: false, delete: false },
          { moduleId: "chat", create: false, read: true, update: false, delete: false },
        ]
      }
    ]);
  }, []);

  const handleAddRole = () => {
    setCurrentTemplate(null);
    setFormData({
      name: "",
      description: "",
      permissions: []
    });
    setIsFormOpen(true);
  };

  const handleEditRole = (template: RoleTemplate) => {
    setCurrentTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      permissions: [...template.permissions]
    });
    setIsFormOpen(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta função? Esta ação não pode ser desfeita.")) {
      try {
        // In a real implementation, delete from the database
        setRoleTemplates(roleTemplates.filter(role => role.id !== id));
        toast({
          title: "Função excluída",
          description: "A função foi removida com sucesso."
        });
      } catch (error) {
        console.error("Error deleting role:", error);
        toast({
          title: "Erro ao excluir função",
          description: "Não foi possível excluir a função.",
          variant: "destructive"
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePermissionsChange = (permissions: AdminPermission[]) => {
    setFormData({
      ...formData,
      permissions
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para a função.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, save to the database
      if (currentTemplate) {
        // Update existing template
        setRoleTemplates(roleTemplates.map(role => 
          role.id === currentTemplate.id ? 
            { ...role, name: formData.name, description: formData.description, permissions: formData.permissions } : 
            role
        ));
        toast({
          title: "Função atualizada",
          description: "A função foi atualizada com sucesso."
        });
      } else {
        // Add new template
        const newRole: RoleTemplate = {
          id: Date.now().toString(), // Generate temp ID
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        };
        setRoleTemplates([...roleTemplates, newRole]);
        toast({
          title: "Função adicionada",
          description: "A nova função foi adicionada com sucesso."
        });
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving role:", error);
      toast({
        title: "Erro ao salvar função",
        description: "Não foi possível salvar a função.",
        variant: "destructive"
      });
    }
  };

  const countPermissions = (permissions: AdminPermission[]) => {
    const totalModules = permissions.length;
    const readCount = permissions.filter(p => p.read).length;
    const writeCount = permissions.filter(p => p.create || p.update).length;
    const deleteCount = permissions.filter(p => p.delete).length;
    
    return { totalModules, readCount, writeCount, deleteCount };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando funções...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Funções Predefinidas</CardTitle>
            <CardDescription>
              Crie e gerencie funções predefinidas com conjuntos específicos de permissões.
            </CardDescription>
          </div>
          <Button onClick={handleAddRole}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Função
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Função</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Nenhuma função predefinida encontrada. Adicione uma nova função.
                  </TableCell>
                </TableRow>
              ) : (
                roleTemplates.map((template) => {
                  const { totalModules, readCount, writeCount, deleteCount } = countPermissions(template.permissions);
                  
                  return (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-blue-50">
                            {readCount}/{totalModules} Leitura
                          </Badge>
                          <Badge variant="outline" className="bg-green-50">
                            {writeCount}/{totalModules} Escrita
                          </Badge>
                          <Badge variant="outline" className="bg-red-50">
                            {deleteCount}/{totalModules} Exclusão
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRole(template)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? "Editar Função" : "Adicionar Nova Função"}
            </DialogTitle>
            <DialogDescription>
              {currentTemplate
                ? "Modifique as informações e permissões da função."
                : "Configure uma nova função predefinida com permissões específicas."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Função</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Administrador Financeiro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o propósito e escopo desta função"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Permissões da Função</h3>
                <Alert>
                  <AlertDescription>
                    Configure as permissões padrão para esta função. Ao criar um usuário e atribuir esta função, 
                    estas permissões serão aplicadas automaticamente.
                  </AlertDescription>
                </Alert>
                <UserPermissionsForm
                  permissions={formData.permissions}
                  onPermissionsChange={handlePermissionsChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {currentTemplate ? "Salvar Alterações" : "Criar Função"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
