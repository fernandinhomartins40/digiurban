
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  FileDown,
  PanelLeftOpen 
} from "lucide-react";
import { useState } from "react";
import { TemplateField } from "@/types/mail";

interface TemplateStarterProps {
  fields: TemplateField[];
  onSelect: (content: string) => void;
}

export function TemplateStarter({ fields, onSelect }: TemplateStarterProps) {
  const [open, setOpen] = useState(false);

  const templates = [
    {
      id: 'oficio',
      name: 'Modelo de Ofício',
      description: 'Modelo padrão para documentos oficiais',
      template: generateBasicTemplate(fields),
    },
    {
      id: 'comunicado',
      name: 'Comunicado Interno',
      description: 'Para comunicações internas entre departamentos',
      template: generateCommunicationTemplate(fields),
    },
    {
      id: 'memorando',
      name: 'Memorando',
      description: 'Para solicitações e comunicações formais',
      template: generateMemoTemplate(fields),
    },
  ];

  function handleSelectTemplate(template: string) {
    onSelect(template);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          <span>Modelos de Documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecione um modelo inicial</DialogTitle>
          <DialogDescription>
            Escolha um modelo para começar ou continue com um documento em branco.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors"
              onClick={() => handleSelectTemplate(template.template)}
            >
              <div className="flex justify-between items-start mb-2">
                <FileDown className="h-8 w-8 text-muted-foreground" />
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateBasicTemplate(fields: TemplateField[]): string {
  // Find field keys
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioCargo = fields.find(f => f.field_key === 'destinatario_cargo')?.field_key || 'destinatario_cargo';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';

  return `
<h2 style="text-align:center;"><strong>OFÍCIO Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>
<p><strong>A Sua Excelência o(a) Senhor(a)</strong></p>
<p><strong>{{${destinatarioNome}}}</strong></p>
<p><strong>{{${destinatarioCargo}}}</strong></p>
<p><strong>{{${destinatarioOrgao}}}</strong></p>
<p><br></p>
<p><strong>Assunto: {{${assunto}}}</strong></p>
<p><br></p>
<p>Excelentíssimo(a) Senhor(a) {{${destinatarioNome}}},</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>
<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
  `;
}

function generateCommunicationTemplate(fields: TemplateField[]): string {
  // Find field keys
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioCargo = fields.find(f => f.field_key === 'destinatario_cargo')?.field_key || 'destinatario_cargo';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';

  return `
<h2 style="text-align:center;"><strong>COMUNICAÇÃO INTERNA Nº {{${numeroOficio}}}/202X</strong></h2>
<p><br></p>
<p><strong>De:</strong> {{${remetenteNome}}} - {{${remetenteCargo}}}</p>
<p><strong>Para:</strong> {{${destinatarioNome}}} - {{${destinatarioCargo}}}</p>
<p><strong>Departamento:</strong> {{${destinatarioOrgao}}}</p>
<p><strong>Assunto:</strong> {{${assunto}}}</p>
<p><strong>Data:</strong> {{${dataEmissao}}}</p>
<p><br></p>
<p><strong>MENSAGEM:</strong></p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>
<p>Atenciosamente,</p>
<p><br></p>
<p><strong>{{${remetenteNome}}}</strong></p>
<p>{{${remetenteCargo}}}</p>
  `;
}

function generateMemoTemplate(fields: TemplateField[]): string {
  // Find field keys
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';

  return `
<h2 style="text-align:center;"><strong>MEMORANDO Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>
<p><strong>De:</strong> {{${remetenteNome}}}</p>
<p><strong>Para:</strong> {{${destinatarioNome}}} - {{${destinatarioOrgao}}}</p>
<p><strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>
<p>Atenciosamente,</p>
<p><br></p>
<p><strong>{{${remetenteNome}}}</strong></p>
  `;
}
