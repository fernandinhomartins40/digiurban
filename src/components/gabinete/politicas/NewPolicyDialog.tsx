
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Política
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Política Pública</DialogTitle>
          <DialogDescription>
            Crie uma nova política pública com objetivos e metas mensuráveis.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Policy creation form would go here */}
          <p className="text-center py-6">Funcionalidade em implementação...</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Criar Política</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
