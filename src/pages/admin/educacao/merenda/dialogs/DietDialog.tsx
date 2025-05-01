
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpecialDiet, Student, School } from "@/types/education";

interface DietDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  schools: School[];
  diet?: SpecialDiet | null;
  onSaved?: () => void;
}

// This is a placeholder component - in a real app it would handle form submission
export default function DietDialog({
  open,
  onOpenChange,
  student,
  schools,
  diet,
  onSaved,
}: DietDialogProps) {
  const [dietType, setDietType] = useState(diet?.dietType || "");
  const [selectedSchoolId, setSelectedSchoolId] = useState(diet?.schoolId || "");
  const [restrictionsText, setRestrictionsText] = useState(
    diet?.restrictions ? diet.restrictions.join(", ") : ""
  );
  const [hasMedicalDocumentation, setHasMedicalDocumentation] = useState(
    diet?.medicalDocumentation || false
  );
  const [notes, setNotes] = useState(diet?.notes || "");

  const handleSave = () => {
    // In a real app, this would call an API
    console.log({
      studentId: student?.id,
      schoolId: selectedSchoolId,
      dietType,
      restrictions: restrictionsText.split(",").map((s) => s.trim()),
      medicalDocumentation: hasMedicalDocumentation,
      notes,
    });

    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{diet ? "Editar Dieta Especial" : "Nova Dieta Especial"}</DialogTitle>
          <DialogDescription>
            {diet
              ? "Edite os detalhes da dieta especial para o aluno."
              : "Crie uma nova dieta especial para o aluno."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student">Aluno</Label>
            <Input
              id="student"
              value={student?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">Escola</Label>
            <Select
              value={selectedSchoolId}
              onValueChange={setSelectedSchoolId}
            >
              <SelectTrigger id="school">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietType">Tipo de Dieta</Label>
            <Input
              id="dietType"
              placeholder="Ex: Sem Glúten, Sem Lactose, etc."
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restrictions">Restrições Alimentares</Label>
            <Textarea
              id="restrictions"
              placeholder="Liste as restrições separadas por vírgulas"
              value={restrictionsText}
              onChange={(e) => setRestrictionsText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="medicalDoc"
              checked={hasMedicalDocumentation}
              onCheckedChange={(checked) =>
                setHasMedicalDocumentation(checked === true)
              }
            />
            <Label
              htmlFor="medicalDoc"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Possui documentação médica
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais sobre a dieta"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
