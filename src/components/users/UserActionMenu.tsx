
import React from "react";
import { AdminUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2, KeyRound, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserActionMenuProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
  isLoading?: {[key: string]: boolean};
}

export function UserActionMenu({
  user,
  onEdit,
  onDelete,
  onResetPassword,
  isLoading = {},
}: UserActionMenuProps) {
  const isDeletingUser = isLoading[user.id] === true;
  const isResettingPassword = isLoading[`reset_${user.id}`] === true;

  return (
    <div className="flex items-center justify-end">
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Opções</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => onResetPassword(user.id)}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              <span>Redefinir Senha</span>
            </DropdownMenuItem>
            
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remover</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuário <strong>{user.name}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete(user.id);
              }}
              disabled={isDeletingUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                "Remover"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
