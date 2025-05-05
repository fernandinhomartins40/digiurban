
import React from "react";
import { AdminUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { UserFormFields } from "./UserFormFields";
import { UserRoleSelector } from "./UserRoleSelector";
import { UserPermissionsSection } from "./UserPermissionsSection";
import { useUserForm } from "@/hooks/users/useUserForm";

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
  const {
    formData,
    formErrors,
    isSubmitting,
    isEditing,
    showConfirmation,
    setShowConfirmation,
    handleInputChange,
    handleRoleChange,
    handlePermissionsChange,
    handleApplyTemplate,
    handleRoleTemplateChange,
    handleSubmit
  } = useUserForm({
    user,
    isOpen,
    onClose,
    onSubmit
  });

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
          <UserFormFields
            formData={formData}
            formErrors={formErrors}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
          />

          <UserRoleSelector
            role={formData.role}
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
            onRoleChange={handleRoleChange}
          />

          {formData.role === "admin" && (
            <UserPermissionsSection
              permissions={formData.permissions}
              roleTemplateId={formData.roleTemplateId}
              onPermissionsChange={handlePermissionsChange}
              onApplyTemplate={handleApplyTemplate}
              onRoleTemplateChange={handleRoleTemplateChange}
            />
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
