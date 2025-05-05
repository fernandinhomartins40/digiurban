
import { useState, useEffect } from "react";
import { AdminUser, AdminPermission } from "@/types/auth";

// Sample role templates for dropdown selection
export const ROLE_TEMPLATES = [
  { id: "1", name: "Administrador de Departamento" },
  { id: "2", name: "Servidor Regular" },
  { id: "3", name: "Acesso Mínimo" },
];

// Sample permissions for each role template
export const TEMPLATE_PERMISSIONS = {
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

interface UseUserFormProps {
  user?: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function useUserForm({
  user,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: UseUserFormProps) {
  const isEditing = !!user;
  
  const [formData, setFormData] = useState({
    id: user?.id || "",
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset form when the dialog opens/closes or the user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: user?.id || "",
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
      setFormErrors({});
      setShowConfirmation(false);
    }
  }, [isOpen, user]);

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
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
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

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Form will stay open so user can correct errors
    }
  };

  return {
    formData,
    formErrors,
    showConfirmation,
    setShowConfirmation,
    handleInputChange,
    handleRoleChange,
    handlePermissionsChange,
    handleApplyTemplate,
    handleRoleTemplateChange,
    handleSubmit
  };
}
