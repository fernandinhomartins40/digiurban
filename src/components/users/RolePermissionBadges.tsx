
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AdminPermission } from "@/types/auth";

interface RolePermissionBadgesProps {
  permissions: AdminPermission[];
}

export function RolePermissionBadges({ permissions }: RolePermissionBadgesProps) {
  const countPermissions = (permissions: AdminPermission[]) => {
    const totalModules = permissions.length;
    const readCount = permissions.filter(p => p.read).length;
    const writeCount = permissions.filter(p => p.create || p.update).length;
    const deleteCount = permissions.filter(p => p.delete).length;
    
    return { totalModules, readCount, writeCount, deleteCount };
  };

  const { totalModules, readCount, writeCount, deleteCount } = countPermissions(permissions);

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-blue-50">
        {readCount}/{totalModules} Leitura
      </Badge>
      <Badge variant="outline" className="bg-green-50">
        {writeCount}/{totalModules} Escrita
      </Badge>
      <Badge variant="outline" className="bg-red-50">
        {deleteCount}/{totalModules} Exclusão
      </Badge>
    </div>
  );
}
