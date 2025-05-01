
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransportRequest } from "@/services/education";
import { fetchStudents, fetchSchools } from "@/services/education";
import { TransportRequest } from "@/types/education";

interface TransportRequestFormProps {
  onSuccess: () => void;
}

export function TransportRequestForm({ onSuccess }: TransportRequestFormProps) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm();
  
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });
  
  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools
  });

  const onSubmit = async (data: any) => {
    try {
      const requestData: Omit<TransportRequest, 'id' | 'protocol_number' | 'created_at' | 'updated_at' | 'student_name' | 'school_name'> = {
        student_id: data.student_id,
        school_id: data.school_id,
        requester_name: data.requester_name,
        requester_contact: data.requester_contact,
        request_type: data.request_type,
        description: data.description,
        status: 'pending',
        pickup_location: data.pickup_location,
        return_location: data.return_location || data.pickup_location,
      };
      
      await createTransportRequest(requestData);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting transport request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student_id">Aluno</Label>
        <Select onValueChange={(value) => setValue("student_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um aluno" />
          </SelectTrigger>
          <SelectContent>
            {students?.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.student_id && (
          <p className="text-sm text-red-500">Aluno é obrigatório</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="school_id">Escola</Label>
        <Select onValueChange={(value) => setValue("school_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma escola" />
          </SelectTrigger>
          <SelectContent>
            {schools?.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.school_id && (
          <p className="text-sm text-red-500">Escola é obrigatória</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="request_type">Tipo de Solicitação</Label>
        <Select onValueChange={(value) => setValue("request_type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new_route">Nova Rota</SelectItem>
            <SelectItem value="route_change">Alteração de Rota</SelectItem>
            <SelectItem value="special_needs">Necessidades Especiais</SelectItem>
            <SelectItem value="complaint">Reclamação</SelectItem>
          </SelectContent>
        </Select>
        {errors.request_type && (
          <p className="text-sm text-red-500">Tipo de solicitação é obrigatório</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pickup_location">Endereço de Embarque</Label>
        <Input
          id="pickup_location"
          {...register("pickup_location", { required: true })}
        />
        {errors.pickup_location && (
          <p className="text-sm text-red-500">Endereço de embarque é obrigatório</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="return_location">Endereço de Retorno (opcional)</Label>
        <Input
          id="return_location"
          {...register("return_location")}
          placeholder="Se diferente do endereço de embarque"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="requester_name">Nome do Solicitante</Label>
        <Input
          id="requester_name"
          {...register("requester_name", { required: true })}
        />
        {errors.requester_name && (
          <p className="text-sm text-red-500">Nome do solicitante é obrigatório</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="requester_contact">Contato do Solicitante</Label>
        <Input
          id="requester_contact"
          {...register("requester_contact", { required: true })}
        />
        {errors.requester_contact && (
          <p className="text-sm text-red-500">Contato do solicitante é obrigatório</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Detalhes da Solicitação</Label>
        <Textarea
          id="description"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">Detalhes da solicitação são obrigatórios</p>
        )}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
        </Button>
      </div>
    </form>
  );
}
