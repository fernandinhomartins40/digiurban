
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewRequestDrawer } from "./NewRequestDrawer";
import { z } from "zod";

// Form schema for direct request
const requestFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  targetDepartment: z.string().min(1, "O setor responsável é obrigatório"),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  dueDate: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

interface NewRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  departments: string[];
  onSubmit: (data: RequestFormValues) => void;
}

export function NewRequestDialog({
  isOpen,
  setIsOpen,
  departments,
  onSubmit,
}: NewRequestDialogProps) {
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
      </Button>

      <NewRequestDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        departments={departments}
        onSubmit={onSubmit}
      />
    </>
  );
}
