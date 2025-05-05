
import React, { useState } from "react";
import { AdminUser, AdminPermission } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface UserFormDialogProps {
  user?: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

export function UserFormDialog({
  user,
  isOpen,
  onClose,
  onSubmit,
}: UserFormDialogProps) {
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
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite os dados e permissões do usuário"
              : "Cadastre um novo usuário e configure suas permissões no sistema"}
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
                <PermissionTemplates onApplyTemplate={handleApplyTemplate} />
              </div>
              <UserPermissionsForm
                permissions={formData.permissions}
                onPermissionsChange={handlePermissionsChange}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Adicionar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
