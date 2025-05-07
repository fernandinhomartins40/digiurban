
import React from 'react';
import { DraggableField } from './DraggableField';
import { TemplateField } from '@/types/mail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FieldListProps {
  fields: TemplateField[];
  onFieldDragStart: (e: React.DragEvent, fieldKey: string) => void;
  onFieldClick?: (fieldKey: string) => void;
}

export function FieldList({ fields, onFieldDragStart, onFieldClick }: FieldListProps) {
  if (!fields.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campos do Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Não há campos definidos. Adicione campos na aba "Campos".
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group fields by their category for better organization
  const destinatarioFields = fields.filter(field => 
    field.field_key.startsWith('destinatario_')
  );
  
  const documentoFields = fields.filter(field => 
    field.field_key === 'numero_oficio' || 
    field.field_key === 'assunto' || 
    field.field_key === 'referencia' ||
    field.field_key === 'data_emissao' ||
    field.field_key === 'cidade'
  );
  
  const remetenteFields = fields.filter(field => 
    field.field_key.startsWith('remetente_')
  );
  
  const conteudoFields = fields.filter(field => 
    field.field_key === 'corpo_texto'
  );
  
  const outrosFields = fields.filter(field => 
    !field.field_key.startsWith('destinatario_') &&
    !field.field_key.startsWith('remetente_') &&
    field.field_key !== 'numero_oficio' &&
    field.field_key !== 'assunto' &&
    field.field_key !== 'referencia' &&
    field.field_key !== 'data_emissao' &&
    field.field_key !== 'cidade' &&
    field.field_key !== 'corpo_texto'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Campos do Modelo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Arraste os campos para o editor ou clique para inserir no cursor
        </p>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="dest">Destinatário</TabsTrigger>
            <TabsTrigger value="doc">Documento</TabsTrigger>
            <TabsTrigger value="rem">Remetente</TabsTrigger>
            <TabsTrigger value="outros">Outros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-1">
            {fields.map((field) => (
              <DraggableField
                key={field.id}
                label={field.field_label}
                fieldKey={field.field_key}
                isRequired={field.is_required}
                onDragStart={onFieldDragStart}
                onClick={onFieldClick}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="dest" className="space-y-1">
            {destinatarioFields.map((field) => (
              <DraggableField
                key={field.id}
                label={field.field_label}
                fieldKey={field.field_key}
                isRequired={field.is_required}
                onDragStart={onFieldDragStart}
                onClick={onFieldClick}
              />
            ))}
            {destinatarioFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhum campo nesta categoria
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="doc" className="space-y-1">
            {documentoFields.map((field) => (
              <DraggableField
                key={field.id}
                label={field.field_label}
                fieldKey={field.field_key}
                isRequired={field.is_required}
                onDragStart={onFieldDragStart}
                onClick={onFieldClick}
              />
            ))}
            {documentoFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhum campo nesta categoria
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="rem" className="space-y-1">
            {remetenteFields.map((field) => (
              <DraggableField
                key={field.id}
                label={field.field_label}
                fieldKey={field.field_key}
                isRequired={field.is_required}
                onDragStart={onFieldDragStart}
                onClick={onFieldClick}
              />
            ))}
            {remetenteFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhum campo nesta categoria
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="outros" className="space-y-1">
            {conteudoFields.concat(outrosFields).map((field) => (
              <DraggableField
                key={field.id}
                label={field.field_label}
                fieldKey={field.field_key}
                isRequired={field.is_required}
                onDragStart={onFieldDragStart}
                onClick={onFieldClick}
              />
            ))}
            {conteudoFields.length + outrosFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhum campo nesta categoria
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
