
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

export function NewProgramDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Programa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Programa Estratégico</DialogTitle>
          <DialogDescription>
            Crie um novo programa estratégico com cronograma e metas.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Program creation form would go here */}
          <p className="text-center py-6">Funcionalidade em implementação...</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Criar Programa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
