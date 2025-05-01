
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { createTeacher, updateTeacher } from "@/services/education/teachers";
import { Teacher } from "@/types/education";
import { useToast } from "@/hooks/use-toast";

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function TeacherDialog({ 
  open, 
  onOpenChange, 
  teacher, 
  onCreated, 
  onUpdated 
}: TeacherDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    registrationNumber: "",
    birthDate: "",
    address: "",
    phone: "",
    email: "",
    educationLevel: "",
    specialties: [] as string[],
    teachingAreas: [] as string[],
    hiringDate: "",
    isActive: true
  });
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newTeachingArea, setNewTeachingArea] = useState("");

  useEffect(() => {
    if (teacher) {
      // Format date for input
      const formattedBirthDate = teacher.birthDate ? 
        new Date(teacher.birthDate).toISOString().split('T')[0] : 
        "";
      const formattedHiringDate = teacher.hiringDate ? 
        new Date(teacher.hiringDate).toISOString().split('T')[0] : 
        "";

      setFormData({
        name: teacher.name,
        cpf: teacher.cpf,
        registrationNumber: teacher.registrationNumber,
        birthDate: formattedBirthDate,
        address: teacher.address,
        phone: teacher.phone,
        email: teacher.email,
        educationLevel: teacher.educationLevel,
        specialties: teacher.specialties || [],
        teachingAreas: teacher.teachingAreas,
        hiringDate: formattedHiringDate,
        isActive: teacher.isActive
      });
    } else {
      // Reset form for new teacher
      setFormData({
        name: "",
        cpf: "",
        registrationNumber: "",
        birthDate: "",
        address: "",
        phone: "",
        email: "",
        educationLevel: "",
        specialties: [],
        teachingAreas: [],
        hiringDate: "",
        isActive: true
      });
    }

    setNewSpecialty("");
    setNewTeachingArea("");
  }, [teacher, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const addSpecialty = () => {
    if (newSpecialty && !formData.specialties.includes(newSpecialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addTeachingArea = () => {
    if (newTeachingArea && !formData.teachingAreas.includes(newTeachingArea)) {
      setFormData(prev => ({
        ...prev,
        teachingAreas: [...prev.teachingAreas, newTeachingArea]
      }));
      setNewTeachingArea("");
    }
  };

  const removeTeachingArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      teachingAreas: prev.teachingAreas.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (teacher) {
        // Update existing teacher
        await updateTeacher(teacher.id, formData);
        onUpdated();
      } else {
        // Create new teacher
        await createTeacher(formData as Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>);
        onCreated();
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o professor. Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecialty();
    }
  };

  const handleTeachingAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTeachingArea();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teacher ? "Editar Professor" : "Novo Professor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dados Pessoais */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Dados Pessoais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo*</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF*</Label>
                  <Input 
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento*</Label>
                  <Input 
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Matrícula*</Label>
                  <Input 
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contato e Endereço */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Contato e Endereço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone*</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço*</Label>
                <Input 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Informações Profissionais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Nível de Formação*</Label>
                  <select 
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="Superior Incompleto">Superior Incompleto</option>
                    <option value="Superior Completo">Superior Completo</option>
                    <option value="Especialização">Especialização</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hiringDate">Data de Contratação*</Label>
                  <Input 
                    id="hiringDate"
                    name="hiringDate"
                    type="date"
                    value={formData.hiringDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Especialidades */}
              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades</Label>
                <div className="flex gap-2">
                  <Input 
                    id="newSpecialty"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Adicionar especialidade"
                    onKeyDown={handleSpecialtyKeyDown}
                  />
                  <Button 
                    type="button" 
                    onClick={addSpecialty}
                    variant="outline"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty, index) => (
                    <Badge 
                      variant="secondary" 
                      key={index}
                      className="pl-2 flex gap-1 items-center"
                    >
                      {specialty}
                      <button 
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Áreas de Ensino */}
              <div className="space-y-2">
                <Label htmlFor="teachingAreas">Áreas de Ensino*</Label>
                <div className="flex gap-2">
                  <Input 
                    id="newTeachingArea"
                    value={newTeachingArea}
                    onChange={(e) => setNewTeachingArea(e.target.value)}
                    placeholder="Adicionar área de ensino"
                    onKeyDown={handleTeachingAreaKeyDown}
                  />
                  <Button 
                    type="button" 
                    onClick={addTeachingArea}
                    variant="outline"
                  >
                    Adicionar
                  </Button>
                </div>
                {formData.teachingAreas.length === 0 && (
                  <p className="text-sm text-red-500">É necessário adicionar pelo menos uma área de ensino</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.teachingAreas.map((area, index) => (
                    <Badge 
                      variant="secondary" 
                      key={index}
                      className="pl-2 flex gap-1 items-center"
                    >
                      {area}
                      <button 
                        type="button"
                        onClick={() => removeTeachingArea(area)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Professor Ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || formData.teachingAreas.length === 0}
            >
              {loading ? "Salvando..." : teacher ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
