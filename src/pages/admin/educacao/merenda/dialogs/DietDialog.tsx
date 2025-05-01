
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createSpecialDiet, updateSpecialDiet } from "@/services/education/meals";
import { SpecialDiet, Student, School } from "@/types/education";
import { cn } from "@/lib/utils";

interface DietDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student;
  schools: School[];
  diet: SpecialDiet | null;
  onSaved: () => void;
}

export default function DietDialog({
  open,
  onOpenChange,
  student,
  schools,
  diet,
  onSaved,
}: DietDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [currentRestriction, setCurrentRestriction] = useState("");
  const [medicalDocumentation, setMedicalDocumentation] = useState(false);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!diet;

  useEffect(() => {
    if (diet) {
      setDietType(diet.dietType);
      setSelectedSchoolId(diet.schoolId);
      setRestrictions(diet.restrictions || []);
      setMedicalDocumentation(diet.medicalDocumentation || false);
      setNotes(diet.notes || "");
      
      if (diet.startDate) {
        setStartDate(new Date(diet.startDate));
      }
      
      if (diet.endDate) {
        setEndDate(new Date(diet.endDate));
      }
      
      setIsActive(diet.isActive);
    } else {
      // Reset form for new diet
      resetForm();
      if (student && schools.length > 0) {
        // If there's only one school, select it automatically
        if (schools.length === 1) {
          setSelectedSchoolId(schools[0].id);
        }
      }
    }
  }, [diet, student, schools]);

  const resetForm = () => {
    setDietType("");
    setSelectedSchoolId("");
    setRestrictions([]);
    setCurrentRestriction("");
    setMedicalDocumentation(false);
    setNotes("");
    setStartDate(new Date());
    setEndDate(undefined);
    setIsActive(true);
  };

  const handleAddRestriction = () => {
    if (currentRestriction.trim()) {
      setRestrictions([...restrictions, currentRestriction.trim()]);
      setCurrentRestriction("");
    }
  };

  const handleRemoveRestriction = (index: number) => {
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) {
      toast({
        title: "Erro",
        description: "Nenhum aluno selecionado",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedSchoolId) {
      toast({
        title: "Erro",
        description: "Selecione uma escola",
        variant: "destructive",
      });
      return;
    }
    
    if (restrictions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma restrição alimentar",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate) {
      toast({
        title: "Erro",
        description: "Informe a data de início da dieta",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const dietData = {
        studentId: student.id,
        schoolId: selectedSchoolId,
        dietType,
        restrictions,
        medicalDocumentation,
        notes,
        startDate: startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0],
        isActive
      };

      if (isEditing && diet) {
        await updateSpecialDiet(diet.id, dietData);
        toast({
          title: "Dieta atualizada",
          description: "As informações foram salvas com sucesso",
        });
      } else {
        await createSpecialDiet(dietData);
        toast({
          title: "Dieta criada",
          description: "A dieta especial foi criada com sucesso",
        });
      }
      
      onSaved();
    } catch (error) {
      console.error("Error saving diet:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a dieta especial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Dieta Especial" : "Nova Dieta Especial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Aluno</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {student?.name || "Nenhum aluno selecionado"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolId">Escola*</Label>
            <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId} required>
              <SelectTrigger id="schoolId">
                <SelectValue placeholder="Selecione a escola" />
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
            <Label htmlFor="dietType">Tipo de Dieta*</Label>
            <Input
              id="dietType"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              placeholder="Ex: Diabetes, Intolerância à lactose, Alergia alimentar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Restrições Alimentares*</Label>
            <div className="flex gap-2">
              <Input
                value={currentRestriction}
                onChange={(e) => setCurrentRestriction(e.target.value)}
                placeholder="Adicionar restrição alimentar"
              />
              <Button type="button" onClick={handleAddRestriction} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 space-y-2">
              {restrictions.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma restrição adicionada</p>
              ) : (
                restrictions.map((restriction, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm">{restriction}</span>
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveRestriction(index)} 
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medicalDocumentation" 
                checked={medicalDocumentation} 
                onCheckedChange={(checked) => setMedicalDocumentation(checked === true)}
              />
              <label
                htmlFor="medicalDocumentation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Possui documentação médica
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre a dieta"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Início da Dieta*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fim da Dieta (Opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="isActive">Ativa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>{isEditing ? "Atualizar" : "Criar"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
