
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewProgramDialog() {
  return (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Novo Programa
    </Button>
  );
}
