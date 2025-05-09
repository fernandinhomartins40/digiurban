
import React, { useState } from "react";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type FieldDefinition = {
  name: string;
  type: string;
  label: string;
  required: boolean;
};

interface FieldProps {
  field: FieldDefinition;
  onDelete: () => void;
  onEdit: (field: FieldDefinition) => void;
}

interface FieldGroupProps {
  fields: FieldDefinition[];
  onAddField: (field: FieldDefinition) => void;
  onDeleteField: (index: number) => void;
  onUpdateField: (index: number, field: FieldDefinition) => void;
}

export const Field: React.FC<FieldProps> = ({ field, onDelete, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex-1">
        <div className="font-medium">{field.label}</div>
        <div className="text-sm text-muted-foreground">
          {field.name} ({field.type})
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {field.required && (
          <Badge variant="secondary">Obrigatório</Badge>
        )}
        <Button variant="ghost" size="sm" onClick={() => onEdit(field)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export const FieldForm: React.FC<{
  initialField?: FieldDefinition;
  onSubmit: (field: FieldDefinition) => void;
  onCancel: () => void;
}> = ({ initialField, onSubmit, onCancel }) => {
  const [field, setField] = useState<FieldDefinition>(
    initialField || {
      name: "",
      type: "text",
      label: "",
      required: false,
    }
  );

  const handleChange = (
    key: keyof FieldDefinition,
    value: string | boolean
  ) => {
    setField((prev) => ({
      ...prev,
      [key]: value,
    }));

    // When label changes, create slug-like name if name is empty
    if (key === "label" && !field.name) {
      const slugifiedName = (value as string)
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '_');
      setField((prev) => ({
        ...prev,
        name: slugifiedName,
      }));
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Rótulo</Label>
          <Input
            id="label"
            value={field.label}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Nome exibido"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nome do campo</Label>
          <Input
            id="name"
            value={field.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="nome_do_campo"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={field.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="textarea">Área de Texto</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="select">Seleção</SelectItem>
              <SelectItem value="file">Arquivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="required"
            checked={field.required}
            onCheckedChange={(checked) =>
              handleChange("required", checked === true)
            }
          />
          <label
            htmlFor="required"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Campo obrigatório
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button
          onClick={() => onSubmit(field)}
          disabled={!field.name || !field.label}
        >
          {initialField ? "Atualizar" : "Adicionar"}
        </Button>
      </div>
    </div>
  );
};

export const FieldGroup: React.FC<FieldGroupProps> = ({
  fields,
  onAddField,
  onDeleteField,
  onUpdateField,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<{
    index: number;
    field: FieldDefinition;
  } | null>(null);

  const handleAddSubmit = (field: FieldDefinition) => {
    onAddField(field);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (field: FieldDefinition) => {
    if (editingField !== null) {
      onUpdateField(editingField.index, field);
      setIsEditDialogOpen(false);
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Campo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Campo</DialogTitle>
            </DialogHeader>
            <FieldForm
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Campo</DialogTitle>
          </DialogHeader>
          {editingField && (
            <FieldForm
              initialField={editingField.field}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingField(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {fields.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
            Nenhum campo definido. Adicione campos para o formulário.
          </div>
        ) : (
          fields.map((field, index) => (
            <Field
              key={`${field.name}-${index}`}
              field={field}
              onDelete={() => onDeleteField(index)}
              onEdit={(fieldData) => {
                setEditingField({ index, field: fieldData });
                setIsEditDialogOpen(true);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
