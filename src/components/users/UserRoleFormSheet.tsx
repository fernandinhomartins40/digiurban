
import React from "react";
import { AdminPermission } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save } from "lucide-react";
import { UserPermissionsForm } from "./UserPermissionsForm";

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
}

interface UserRoleFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  currentTemplate: RoleTemplate | null;
}

export function UserRoleFormSheet({
  isOpen,
  onClose,
  onSubmit,
  currentTemplate
}: UserRoleFormSheetProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    permissions: [] as AdminPermission[],
  });

  // Reset form when template changes
  React.useEffect(() => {
    if (currentTemplate) {
      setFormData({
        name: currentTemplate.name,
        description: currentTemplate.description,
        permissions: [...currentTemplate.permissions]
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: []
      });
    }
  }, [currentTemplate, isOpen]);

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
    await onSubmit(formData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-2">
          <SheetTitle>
            {currentTemplate ? "Editar Função" : "Adicionar Nova Função"}
          </SheetTitle>
          <SheetDescription>
            {currentTemplate
              ? "Modifique as informações e permissões da função."
              : "Configure uma nova função predefinida com permissões específicas."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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

          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {currentTemplate ? "Salvar Alterações" : "Criar Função"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
