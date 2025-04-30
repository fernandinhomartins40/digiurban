
export type UserRole = "prefeito" | "admin" | "citizen";

export type AdminPermission = {
  moduleId: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Alterado para usar UserRole para compatibilidade com Supabase
  department?: string;
  position?: string;
  permissions: AdminPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface CitizenUser {
  id: string;
  email: string;
  name: string;
  cpf: string;
  role: "citizen";
  address: {
    street: string;
    number: string;
    complement?: string; // Made complement optional since it doesn't exist in the database
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone?: string;
  familyMembers?: {
    name: string;
    relationship: string;
    cpf?: string;
    birthDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type User = AdminUser | CitizenUser;

// Add a type guard function to check if a user is an AdminUser
export function isAdminUser(user: User | null): user is AdminUser {
  return user?.role === "admin" || user?.role === "prefeito";
}

