
import React, { useState, useEffect } from "react";
import { AdminUser, AdminPermission } from "@/types/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { UserPermissionsForm } from "./UserPermissionsForm";
import { PermissionTemplates } from "./PermissionTemplates";
import { supabase } from "@/integrations/supabase/client";

// Sample role templates for dropdown selection
const ROLE_TEMPLATES = [
  { id: "1", name: "Administrador de Departamento" },
  { id: "2", name: "Servidor Regular" },
  { id: "3", name: "Acesso Mínimo" },
];

// Sample permissions for each role template - in a real implementation, these would come from the database
const TEMPLATE_PERMISSIONS = {
  "1": [
    { moduleId: "administracao", create: true, read: true, update: true, delete: true },
    { moduleId: "financas", create: false, read: true, update: false, delete: false },
    { moduleId: "correio", create: true, read: true, update: true, delete: true },
    { moduleId: "chat", create: true, read: true, update: true, delete: false },
  ],
  "2": [
    { moduleId: "administracao", create: false, read: true, update: false, delete: false },
    { moduleId: "financas", create: false, read: true, update: false, delete: false },
    { moduleId: "correio", create: true, read: true, update: true, delete: false },
    { moduleId: "chat", create: true, read: true, update: true, delete: false },
  ],
  "3": [
    { moduleId: "administracao", create: false, read: true, update: false, delete: false },
    { moduleId: "correio", create: false, read: true, update: false, delete: false },
    { moduleId: "chat", create: false, read: true, update: false, delete: false },
  ]
};

interface UserFormSheetProps {
  user?: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

export function UserFormSheet({
  user,
  isOpen,
  onClose,
  onSubmit,
}: UserFormSheetProps) {
  const isEditing = !!user;
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    position: user?.position || "",
    role: user?.role || "admin",
    password: "",
    confirmPassword: "",
    permissions: user?.permissions || [],
    roleTemplateId: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        position: user.position || "",
        role: user.role || "admin",
        password: "",
        confirmPassword: "",
        permissions: user.permissions || [],
        roleTemplateId: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        position: "",
        role: "admin",
        password: "",
        confirmPassword: "",
        permissions: [],
        roleTemplateId: "",
      });
    }
    setFormErrors({});
    setShowConfirmation(false);
  }, [user, isOpen]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.email.trim()) errors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Email inválido";

    if (!isEditing) {
      if (!formData.password) errors.password = "Senha é obrigatória";
      else if (formData.password.length < 6)
        errors.password = "Senha deve ter pelo menos 6 caracteres";

      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "As senhas não coincidem";
    }

    if (!formData.department.trim()) errors.department = "Departamento é obrigatório";

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    if (value === "prefeito" && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    setFormData({
      ...formData,
      role: value as "admin" | "prefeito",
    });
  };

  const handlePermissionsChange = (permissions: AdminPermission[]) => {
    setFormData({
      ...formData,
      permissions,
    });
  };

  const handleApplyTemplate = (permissions: AdminPermission[]) => {
    setFormData({
      ...formData,
      permissions,
    });
  };

  const handleRoleTemplateChange = (templateId: string) => {
    if (!templateId) return;
    
    setFormData({
      ...formData,
      roleTemplateId: templateId,
      permissions: TEMPLATE_PERMISSIONS[templateId as keyof typeof TEMPLATE_PERMISSIONS] || [],
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
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-2">
          <SheetTitle>
            {isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Edite os dados e permissões do usuário"
              : "Cadastre um novo usuário e configure suas permissões no sistema"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500">{formErrors.name}</p>
              )}
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
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>

            {!isEditing && (
              <>
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
                  {formErrors.password && (
                    <p className="text-xs text-red-500">{formErrors.password}</p>
                  )}
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
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={formErrors.department ? "border-red-500" : ""}
              />
              {formErrors.department && (
                <p className="text-xs text-red-500">{formErrors.department}</p>
              )}
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

            <div className="space-y-2">
              <Label htmlFor="role">Função no Sistema</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="prefeito">Prefeito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showConfirmation && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>
                Você está prestes a conceder privilégios de Prefeito a este usuário.
                Esta ação dará acesso completo a todas as funcionalidades do sistema.
                Tem certeza que deseja continuar?
              </AlertDescription>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      role: "admin",
                    });
                    setShowConfirmation(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirmation(false)}
                >
                  Confirmar
                </Button>
              </div>
            </Alert>
          )}

          {formData.role === "admin" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Permissões</h3>
                <div className="flex gap-2">
                  <PermissionTemplates onApplyTemplate={handleApplyTemplate} />
                  
                  <Select 
                    value={formData.roleTemplateId} 
                    onValueChange={handleRoleTemplateChange}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Selecione uma função predefinida" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <UserPermissionsForm
                permissions={formData.permissions}
                onPermissionsChange={handlePermissionsChange}
              />
            </div>
          )}

          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
