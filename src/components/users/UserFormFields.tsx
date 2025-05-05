
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Define UserFormData type explicitly instead of importing
interface UserFormData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  role: string;
  password: string;
  confirmPassword: string;
  permissions: any[];
  roleTemplateId: string;
}

interface UserFormFieldsProps {
  formData: UserFormData;
  formErrors: Record<string, string>;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserFormFields({ 
  formData, 
  formErrors,
  isEditing,
  handleInputChange 
}: UserFormFieldsProps) {
  return (
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
    </div>
  );
}
