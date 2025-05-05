
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UserRoleFormSheet } from "./UserRoleFormSheet";
import { RoleTemplatesTable } from "./RoleTemplatesTable";
import { RolesLoadingState } from "./RolesLoadingState";
import { RoleTemplate } from "./types";

export function UserRolesManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<RoleTemplate | null>(null);

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
    setIsFormOpen(true);
  };

  const handleEditRole = (template: RoleTemplate) => {
    setCurrentTemplate(template);
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

  const handleSubmit = async (formData: any) => {
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

  if (isLoading) {
    return <RolesLoadingState />;
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
          <RoleTemplatesTable 
            roleTemplates={roleTemplates} 
            onEdit={handleEditRole} 
            onDelete={handleDeleteRole} 
          />
        </CardContent>
      </Card>

      <UserRoleFormSheet
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        currentTemplate={currentTemplate}
      />
    </div>
  );
}
