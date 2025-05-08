
import React, { useState } from 'react';
import { Plus, X, Edit, AlignJustify, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DraggableField } from './DraggableField';
import { PredefinedFieldsSelector } from './PredefinedFieldsSelector';
import { TemplateField } from '@/types/mail';
import { cn } from '@/lib/utils';
import { generateFieldId } from '@/utils/mailTemplateUtils';

interface FieldCreationPanelProps {
  fields: Partial<TemplateField>[];
  onAddField: (field: Partial<TemplateField>) => void;
  onUpdateField: (index: number, field: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
  onAddPredefinedFields: (fields: Partial<TemplateField>[]) => void;
  onFieldDragStart: (e: React.DragEvent, fieldKey: string, field?: Partial<TemplateField>) => void;
  onFieldClick: (fieldKey: string, targetField?: string) => void;
  existingFieldKeys: string[];
  selectedTargetField: 'content' | 'header' | 'footer';
  onChangeTargetField: (field: 'content' | 'header' | 'footer') => void;
  showPredefinedFields?: boolean;
  togglePredefinedFields?: () => void;
}

export function FieldCreationPanel({
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  onAddPredefinedFields,
  onFieldDragStart,
  onFieldClick,
  existingFieldKeys,
  selectedTargetField,
  onChangeTargetField,
  showPredefinedFields = false,
  togglePredefinedFields
}: FieldCreationPanelProps) {
  const [newField, setNewField] = useState<Partial<TemplateField>>({
    field_key: '',
    field_label: '',
    field_type: 'text',
    is_required: false
  });
  
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const resetNewField = () => {
    setNewField({
      field_key: '',
      field_label: '',
      field_type: 'text',
      is_required: false
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newField.field_key || !newField.field_label) return;
    
    if (editingFieldIndex !== null) {
      onUpdateField(editingFieldIndex, newField);
      setEditingFieldIndex(null);
    } else {
      onAddField(newField);
    }
    resetNewField();
  };
  
  const startEditField = (index: number) => {
    setEditingFieldIndex(index);
    setNewField({...fields[index]});
  };
  
  const cancelEdit = () => {
    setEditingFieldIndex(null);
    resetNewField();
  };

  const handleCreateFieldFromSelection = () => {
    const event = new CustomEvent('create-field-from-selection', {
      detail: {
        targetField: selectedTargetField,
        callback: (field: Partial<TemplateField>) => {
          onAddField(field);
        }
      }
    });
    document.dispatchEvent(event);
  };
  
  const filteredFields = fields.filter(field => 
    field.field_label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.field_key?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLabelChange = (value: string) => {
    const generatedKey = value.trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
      
    setNewField({
      ...newField,
      field_label: value,
      field_key: generatedKey
    });
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Campos do Documento</h3>
      </div>
      
      <div className="flex gap-1 mb-3">
        <Button 
          variant={selectedTargetField === 'content' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onChangeTargetField('content')}
          className="text-xs h-7 px-2 flex-1"
        >
          Conteúdo
        </Button>
        <Button 
          variant={selectedTargetField === 'header' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onChangeTargetField('header')}
          className="text-xs h-7 px-2 flex-1"
        >
          Cabeçalho
        </Button>
        <Button 
          variant={selectedTargetField === 'footer' ? "default" : "outline"} 
          size="sm" 
          onClick={() => onChangeTargetField('footer')}
          className="text-xs h-7 px-2 flex-1"
        >
          Rodapé
        </Button>
      </div>
      
      <Card className="border-dashed border-blue-300 bg-blue-50/50">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Criar Campo</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCreateFieldFromSelection} 
              className="h-6 px-2 text-xs"
            >
              Da Seleção
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3 space-y-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                placeholder="Nome do campo"
                value={newField.field_label || ''}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="text-sm h-8"
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={newField.field_type} 
                onValueChange={(value) => setNewField({...newField, field_type: value})}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="required" 
                  checked={newField.is_required}
                  onCheckedChange={(checked) => setNewField({...newField, is_required: checked === true})}
                />
                <label htmlFor="required" className="text-xs cursor-pointer">
                  Obrigatório
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              {editingFieldIndex !== null ? (
                <>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={cancelEdit} 
                    className="h-8 text-xs"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Atualizar
                  </Button>
                </>
              ) : (
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-8 text-xs ml-auto"
                  disabled={!newField.field_label || !newField.field_key}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar Campo
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {togglePredefinedFields && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-between text-xs h-8"
          onClick={togglePredefinedFields}
        >
          <span>Campos Predefinidos</span>
          {showPredefinedFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      )}

      {showPredefinedFields && (
        <PredefinedFieldsSelector 
          onAddFields={onAddPredefinedFields} 
          existingFieldKeys={existingFieldKeys}
        />
      )}
      
      {fields.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-sm font-medium">Campos Disponíveis</h3>
            <Input
              placeholder="Filtrar campos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[180px] h-8 text-xs"
            />
          </div>
          
          <div className={cn("space-y-1", filteredFields.length > 6 && "overflow-y-auto max-h-[240px] pr-2")}>
            {filteredFields.map((field, index) => (
              <div key={field.field_key} className="flex items-center gap-1">
                <DraggableField
                  label={field.field_label || ''}
                  fieldKey={field.field_key || ''}
                  isRequired={field.is_required}
                  field={field}
                  onDragStart={onFieldDragStart}
                  onClick={() => onFieldClick(field.field_key || '')}
                />
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => startEditField(index)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-500 hover:text-red-700" 
                    onClick={() => onRemoveField(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-1 pt-2 border-t">
            <p>Arraste os campos para o editor ou clique para inserir no cursor.</p>
          </div>
        </>
      )}
    </div>
  );
}
