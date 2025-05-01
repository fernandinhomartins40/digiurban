
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { createMealMenu, updateMealMenu } from "@/services/education/meals";
import { MealMenu, School, MealShift } from "@/types/education";
import { cn } from "@/lib/utils";

interface MenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: School;
  menu: MealMenu | null;
  onSaved: () => void;
}

export default function MenuDialog({
  open,
  onOpenChange,
  school,
  menu,
  onSaved,
}: MenuDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [shift, setShift] = useState<MealShift>("morning");
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const [currentMenuItem, setCurrentMenuItem] = useState("");
  const [nutritionalInfo, setNutritionalInfo] = useState("");
  const [isSpecialDiet, setIsSpecialDiet] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [currentRestriction, setCurrentRestriction] = useState("");
  const [weekNumber, setWeekNumber] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeFrom, setActiveFrom] = useState<Date | undefined>(new Date());
  const [activeUntil, setActiveUntil] = useState<Date | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!menu;

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setShift(menu.shift);
      setDayOfWeek(menu.dayOfWeek);
      setMenuItems(menu.menuItems || []);
      setNutritionalInfo(menu.nutritionalInfo || "");
      setIsSpecialDiet(menu.isSpecialDiet || false);
      setDietaryRestrictions(menu.forDietaryRestrictions || []);
      setWeekNumber(menu.weekNumber);
      setMonth(menu.month);
      setYear(menu.year);
      
      if (menu.activeFrom) {
        setActiveFrom(new Date(menu.activeFrom));
      }
      
      if (menu.activeUntil) {
        setActiveUntil(new Date(menu.activeUntil));
      }
      
      setIsActive(menu.isActive);
    } else {
      // Reset form for new menu
      resetForm();
    }
  }, [menu]);

  const resetForm = () => {
    setName("");
    setShift("morning");
    setDayOfWeek(1);
    setMenuItems([]);
    setCurrentMenuItem("");
    setNutritionalInfo("");
    setIsSpecialDiet(false);
    setDietaryRestrictions([]);
    setCurrentRestriction("");
    setWeekNumber(undefined);
    setMonth(undefined);
    setYear(new Date().getFullYear());
    setActiveFrom(new Date());
    setActiveUntil(undefined);
    setIsActive(true);
  };

  const handleAddMenuItem = () => {
    if (currentMenuItem.trim()) {
      setMenuItems([...menuItems, currentMenuItem.trim()]);
      setCurrentMenuItem("");
    }
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleAddRestriction = () => {
    if (currentRestriction.trim()) {
      setDietaryRestrictions([...dietaryRestrictions, currentRestriction.trim()]);
      setCurrentRestriction("");
    }
  };

  const handleRemoveRestriction = (index: number) => {
    setDietaryRestrictions(dietaryRestrictions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!school) {
      toast({
        title: "Erro",
        description: "Nenhuma escola selecionada",
        variant: "destructive",
      });
      return;
    }
    
    if (menuItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao cardápio",
        variant: "destructive",
      });
      return;
    }
    
    if (!activeFrom) {
      toast({
        title: "Erro",
        description: "Informe a data de início de vigência",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const menuData = {
        schoolId: school.id,
        name,
        shift,
        dayOfWeek,
        menuItems,
        nutritionalInfo,
        isSpecialDiet,
        forDietaryRestrictions: isSpecialDiet ? dietaryRestrictions : [],
        weekNumber,
        month,
        year,
        activeFrom: activeFrom?.toISOString() || new Date().toISOString(),
        activeUntil: activeUntil?.toISOString(),
        isActive,
        createdBy: undefined // Will be populated by the backend
      };

      if (isEditing && menu) {
        await updateMealMenu(menu.id, menuData);
        toast({
          title: "Cardápio atualizado",
          description: "As informações foram salvas com sucesso",
        });
      } else {
        await createMealMenu(menuData);
        toast({
          title: "Cardápio criado",
          description: "O novo cardápio foi criado com sucesso",
        });
      }
      
      onSaved();
    } catch (error) {
      console.error("Error saving menu:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cardápio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cardápio" : "Novo Cardápio"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cardápio*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shift">Turno*</Label>
              <Select value={shift} onValueChange={(value) => setShift(value as MealShift)} required>
                <SelectTrigger id="shift">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="evening">Noite</SelectItem>
                  <SelectItem value="all">Todo o Dia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Dia da Semana*</Label>
              <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(parseInt(value, 10))} required>
                <SelectTrigger id="dayOfWeek">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Segunda-feira</SelectItem>
                  <SelectItem value="2">Terça-feira</SelectItem>
                  <SelectItem value="3">Quarta-feira</SelectItem>
                  <SelectItem value="4">Quinta-feira</SelectItem>
                  <SelectItem value="5">Sexta-feira</SelectItem>
                  <SelectItem value="6">Sábado</SelectItem>
                  <SelectItem value="0">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Itens do Cardápio*</Label>
            <div className="flex gap-2">
              <Input
                value={currentMenuItem}
                onChange={(e) => setCurrentMenuItem(e.target.value)}
                placeholder="Adicionar item ao cardápio"
              />
              <Button type="button" onClick={handleAddMenuItem} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2 space-y-2">
              {menuItems.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum item adicionado</p>
              ) : (
                menuItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm">{item}</span>
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveMenuItem(index)} 
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

          <div className="space-y-2">
            <Label htmlFor="nutritionalInfo">Informações Nutricionais</Label>
            <Textarea
              id="nutritionalInfo"
              value={nutritionalInfo}
              onChange={(e) => setNutritionalInfo(e.target.value)}
              placeholder="Calorias, proteínas, carboidratos, etc."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="isSpecialDiet" checked={isSpecialDiet} onCheckedChange={setIsSpecialDiet} />
              <label
                htmlFor="isSpecialDiet"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Este é um cardápio de dieta especial
              </label>
            </div>
            
            {isSpecialDiet && (
              <div className="space-y-2 pl-6">
                <Label>Restrições Alimentares</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentRestriction}
                    onChange={(e) => setCurrentRestriction(e.target.value)}
                    placeholder="Adicionar restrição"
                  />
                  <Button type="button" onClick={handleAddRestriction} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-2 space-y-2">
                  {dietaryRestrictions.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma restrição adicionada</p>
                  ) : (
                    dietaryRestrictions.map((restriction, index) => (
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekNumber">Número da Semana (Opcional)</Label>
              <Input
                id="weekNumber"
                type="number"
                min={1}
                max={53}
                value={weekNumber !== undefined ? weekNumber : ""}
                onChange={(e) => setWeekNumber(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                placeholder="1-53"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Mês (Opcional)</Label>
              <Select 
                value={month !== undefined ? month.toString() : ""} 
                onValueChange={(value) => setMonth(value ? parseInt(value, 10) : undefined)}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  <SelectItem value="0">Janeiro</SelectItem>
                  <SelectItem value="1">Fevereiro</SelectItem>
                  <SelectItem value="2">Março</SelectItem>
                  <SelectItem value="3">Abril</SelectItem>
                  <SelectItem value="4">Maio</SelectItem>
                  <SelectItem value="5">Junho</SelectItem>
                  <SelectItem value="6">Julho</SelectItem>
                  <SelectItem value="7">Agosto</SelectItem>
                  <SelectItem value="8">Setembro</SelectItem>
                  <SelectItem value="9">Outubro</SelectItem>
                  <SelectItem value="10">Novembro</SelectItem>
                  <SelectItem value="11">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano*</Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activeFrom">Vigente A Partir De*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !activeFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {activeFrom ? format(activeFrom, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={activeFrom}
                    onSelect={setActiveFrom}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeUntil">Vigente Até (Opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !activeUntil && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {activeUntil ? format(activeUntil, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={activeUntil}
                    onSelect={setActiveUntil}
                    initialFocus
                    disabled={(date) => activeFrom ? date < activeFrom : false}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="isActive">Ativo</Label>
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
