
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminPermission } from "@/types/auth";
import { UserPermissionsForm } from "./UserPermissionsForm";
import { PermissionTemplates } from "./PermissionTemplates";
import { ROLE_TEMPLATES } from "@/hooks/users/useUserForm";

interface UserPermissionsSectionProps {
  permissions: AdminPermission[];
  roleTemplateId: string;
  onPermissionsChange: (permissions: AdminPermission[]) => void;
  onApplyTemplate: (permissions: AdminPermission[]) => void;
  onRoleTemplateChange: (templateId: string) => void;
}

export function UserPermissionsSection({
  permissions,
  roleTemplateId,
  onPermissionsChange,
  onApplyTemplate,
  onRoleTemplateChange
}: UserPermissionsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Permissões</h3>
        <div className="flex gap-2">
          <PermissionTemplates onApplyTemplate={onApplyTemplate} />
          
          <Select 
            value={roleTemplateId} 
            onValueChange={onRoleTemplateChange}
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
        permissions={permissions}
        onPermissionsChange={onPermissionsChange}
      />
    </div>
  );
}
