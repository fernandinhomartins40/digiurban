
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserFilters, UserFilterValues } from "@/components/users/UserFilters";
import { UserActionMenu } from "@/components/users/UserActionMenu";
import { AdminUser } from "@/types/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface UsersTabContentProps {
  users: AdminUser[];
  filters: UserFilterValues;
  setFilters: (filters: UserFilterValues) => void;
  departments: string[];
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
  isLoading?: boolean;
  isLoadingActions?: {[key: string]: boolean};
}

export function UsersTabContent({
  users,
  filters,
  setFilters,
  departments,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  isLoading = false,
  isLoadingActions = {},
}: UsersTabContentProps) {
  const isMobile = useIsMobile();

  // Filter users based on the filter values
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search term filter
      if (
        filters.searchTerm &&
        !user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Department filter
      if (
        filters.department &&
        user.department !== filters.department
      ) {
        return false;
      }

      // Role filter
      if (
        filters.role &&
        user.role !== filters.role
      ) {
        return false;
      }

      return true;
    });
  }, [users, filters]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <UserFilters 
            onFilterChange={setFilters} 
            departments={departments}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Departamento</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Cargo</TableHead>
                <TableHead className={isMobile ? "hidden" : ""}>Função</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : 6} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">
                        Carregando usuários...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : 6} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">
                        Nenhum usuário encontrado.
                      </p>
                      {(filters.searchTerm || filters.department || filters.role) && (
                        <Button variant="ghost" onClick={() => setFilters({
                          searchTerm: "",
                          department: null,
                          role: null,
                          status: null,
                        })}>
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>{user.department || "-"}</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>{user.position || "-"}</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        user.role === 'prefeito' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'prefeito' ? 'Prefeito' : 'Administrador'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActionMenu
                        user={user}
                        onEdit={onEditUser}
                        onDelete={onDeleteUser}
                        onResetPassword={onResetPassword}
                        isLoading={isLoadingActions}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
