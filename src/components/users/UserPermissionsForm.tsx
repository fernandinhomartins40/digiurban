
import React, { useState } from "react";
import { AdminPermission } from "@/types/auth";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserPermissionsFormProps {
  permissions: AdminPermission[];
  onPermissionsChange: (permissions: AdminPermission[]) => void;
}

interface ModuleGroup {
  name: string;
  modules: { id: string, name: string }[];
}

export function UserPermissionsForm({
  permissions,
  onPermissionsChange,
}: UserPermissionsFormProps) {
  // Define module groups
  const moduleGroups: ModuleGroup[] = [
    {
      name: "Administração",
      modules: [
        { id: "administracao", name: "Administração Geral" },
        { id: "financas", name: "Finanças" },
        { id: "rh", name: "Recursos Humanos" },
      ]
    },
    {
      name: "Social",
      modules: [
        { id: "educacao", name: "Educação" },
        { id: "saude", name: "Saúde" },
        { id: "assistencia", name: "Assistência Social" },
      ]
    },
    {
      name: "Infraestrutura",
      modules: [
        { id: "obras", name: "Obras Públicas" },
        { id: "servicos", name: "Serviços Públicos" },
        { id: "meioambiente", name: "Meio Ambiente" },
      ]
    },
    {
      name: "Comunicação",
      modules: [
        { id: "correio", name: "Correio Interno" },
        { id: "chat", name: "Chat" },
      ]
    }
  ];

  const handlePermissionChange = (
    moduleId: string,
    action: keyof Omit<AdminPermission, "moduleId">,
    checked: boolean
  ) => {
    const updatedPermissions = permissions.map(permission =>
      permission.moduleId === moduleId
        ? { ...permission, [action]: checked }
        : permission
    );

    // If the module doesn't exist in permissions, add it
    if (!permissions.some(p => p.moduleId === moduleId)) {
      updatedPermissions.push({
        moduleId,
        create: action === "create" ? checked : false,
        read: action === "read" ? checked : false,
        update: action === "update" ? checked : false,
        delete: action === "delete" ? checked : false
      });
    }

    onPermissionsChange(updatedPermissions);
  };

  const getPermissionValue = (moduleId: string, action: keyof Omit<AdminPermission, "moduleId">) => {
    const permission = permissions.find(p => p.moduleId === moduleId);
    return permission ? permission[action] : false;
  };

  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Administração"]);

  return (
    <div className="space-y-4">
      <div className="text-sm mb-4">
        Configure as permissões por módulo do sistema:
      </div>

      <Accordion type="multiple" value={expandedGroups} onValueChange={setExpandedGroups} className="w-full">
        {moduleGroups.map((group) => (
          <AccordionItem key={group.name} value={group.name}>
            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
              <span className="text-sm font-medium">{group.name}</span>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Módulo</TableHead>
                    <TableHead className="text-center">Visualizar</TableHead>
                    <TableHead className="text-center">Criar</TableHead>
                    <TableHead className="text-center">Editar</TableHead>
                    <TableHead className="text-center">Excluir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>
                        <Label htmlFor={`module-${module.id}`} className="font-normal">
                          {module.name}
                        </Label>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`module-${module.id}-read`}
                          checked={getPermissionValue(module.id, 'read')} 
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.id, 'read', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`module-${module.id}-create`}
                          checked={getPermissionValue(module.id, 'create')} 
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.id, 'create', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`module-${module.id}-update`}
                          checked={getPermissionValue(module.id, 'update')} 
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.id, 'update', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`module-${module.id}-delete`}
                          checked={getPermissionValue(module.id, 'delete')} 
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.id, 'delete', !!checked)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
