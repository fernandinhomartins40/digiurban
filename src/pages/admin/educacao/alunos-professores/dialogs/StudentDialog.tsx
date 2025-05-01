
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createStudent, updateStudent } from "@/services/education/students";
import { Student } from "@/types/education";
import { useToast } from "@/hooks/use-toast";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function StudentDialog({ 
  open, 
  onOpenChange, 
  student, 
  onCreated, 
  onUpdated 
}: StudentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    registrationNumber: "",
    parentName: "",
    parentCpf: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    specialNeeds: "",
    medicalInfo: "",
    isActive: true
  });

  useEffect(() => {
    if (student) {
      // Format date for input
      const formattedBirthDate = student.birthDate ? 
        new Date(student.birthDate).toISOString().split('T')[0] : 
        "";

      setFormData({
        name: student.name,
        cpf: student.cpf || "",
        birthDate: formattedBirthDate,
        registrationNumber: student.registrationNumber,
        parentName: student.parentName,
        parentCpf: student.parentCpf || "",
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail || "",
        address: student.address,
        neighborhood: student.neighborhood,
        city: student.city,
        state: student.state,
        zipCode: student.zipCode || "",
        specialNeeds: student.specialNeeds || "",
        medicalInfo: student.medicalInfo || "",
        isActive: student.isActive
      });
    } else {
      // Reset form for new student
      setFormData({
        name: "",
        cpf: "",
        birthDate: "",
        registrationNumber: "",
        parentName: "",
        parentCpf: "",
        parentPhone: "",
        parentEmail: "",
        address: "",
        neighborhood: "",
        city: "Cidade",
        state: "Estado",
        zipCode: "",
        specialNeeds: "",
        medicalInfo: "",
        isActive: true
      });
    }
  }, [student, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (student) {
        // Update existing student
        await updateStudent(student.id, formData);
        onUpdated();
      } else {
        // Create new student
        await createStudent(formData as Omit<Student, 'id' | 'createdAt' | 'updatedAt'>);
        onCreated();
      }
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o aluno. Verifique os campos e tente novamente.",
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
          <DialogTitle>{student ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dados do Aluno */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Dados do Aluno</h3>
              
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
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
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

            {/* Dados do Responsável */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Dados do Responsável</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Nome do Responsável*</Label>
                  <Input 
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentCpf">CPF do Responsável</Label>
                  <Input 
                    id="parentCpf"
                    name="parentCpf"
                    value={formData.parentCpf}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Telefone do Responsável*</Label>
                  <Input 
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email do Responsável</Label>
                  <Input 
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Endereço</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Logradouro*</Label>
                <Input 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro*</Label>
                  <Input 
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade*</Label>
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">Estado*</Label>
                  <Input 
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input 
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Informações Médicas */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-lg">Informações Adicionais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Necessidades Especiais</Label>
                <Textarea 
                  id="specialNeeds"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  placeholder="Descreva qualquer necessidade especial do aluno"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalInfo">Informações Médicas</Label>
                <Textarea 
                  id="medicalInfo"
                  name="medicalInfo"
                  value={formData.medicalInfo}
                  onChange={handleChange}
                  placeholder="Descreva informações médicas relevantes (alergias, medicamentos, etc)"
                />
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Aluno Ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : student ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
