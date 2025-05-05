
import { AdminPermission } from "@/types/auth";

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
}
