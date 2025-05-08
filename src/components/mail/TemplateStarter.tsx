
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
  PanelLeftOpen,
  Copy,
  Edit
} from "lucide-react";
import { useState } from "react";
import { TemplateField } from "@/types/mail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TemplateStarterProps {
  fields: TemplateField[];
  onSelect: (content: string) => void;
}

export function TemplateStarter({ fields, onSelect }: TemplateStarterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("administrativo");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  // Define template categories
  const templateCategories = [
    { id: "administrativo", name: "Administrativos" },
    { id: "comunicacao", name: "Comunicações" },
    { id: "requerimento", name: "Requerimentos" },
    { id: "despacho", name: "Despachos" },
    { id: "parecer", name: "Pareceres" }
  ];

  // Expanded template library with categories
  const templateLibrary = {
    administrativo: [
      {
        id: 'oficio_padrao',
        name: 'Ofício Padrão',
        description: 'Modelo padrão para documentos oficiais',
        template: generateBasicTemplate(fields),
        isStandard: true,
        tags: ["formal", "geral"]
      },
      {
        id: 'oficio_detalhado',
        name: 'Ofício Detalhado',
        description: 'Ofício com seções detalhadas para comunicações formais',
        template: generateDetailedOficioTemplate(fields),
        isStandard: true,
        tags: ["formal", "detalhado"]
      },
      {
        id: 'oficio_gabinete',
        name: 'Ofício do Gabinete',
        description: 'Modelo específico para comunicações do Gabinete do Prefeito',
        template: generateMayorOfficeTemplate(fields),
        isStandard: true,
        tags: ["gabinete", "executivo"]
      }
    ],
    comunicacao: [
      {
        id: 'comunicado_interno',
        name: 'Comunicado Interno',
        description: 'Para comunicações internas entre departamentos',
        template: generateCommunicationTemplate(fields),
        isStandard: true,
        tags: ["interno", "departamentos"]
      },
      {
        id: 'circular',
        name: 'Circular',
        description: 'Para envio a múltiplos destinatários',
        template: generateCircularTemplate(fields),
        isStandard: true,
        tags: ["múltiplos", "circular"]
      },
      {
        id: 'informativo',
        name: 'Informativo',
        description: 'Para divulgação de informações importantes',
        template: generateInformativoTemplate(fields),
        isStandard: true,
        tags: ["informação", "divulgação"]
      }
    ],
    requerimento: [
      {
        id: 'memorando',
        name: 'Memorando',
        description: 'Para solicitações e comunicações formais',
        template: generateMemoTemplate(fields),
        isStandard: true,
        tags: ["solicitação", "formal"]
      },
      {
        id: 'requerimento_simples',
        name: 'Requerimento Simples',
        description: 'Para realizar pedidos formais simples',
        template: generateSimpleRequestTemplate(fields),
        isStandard: true,
        tags: ["solicitação", "pedido"]
      },
      {
        id: 'solicitacao_recursos',
        name: 'Solicitação de Recursos',
        description: 'Para requisitar recursos materiais ou financeiros',
        template: generateResourceRequestTemplate(fields),
        isStandard: true,
        tags: ["recursos", "requisição"]
      }
    ],
    despacho: [
      {
        id: 'despacho_decisorio',
        name: 'Despacho Decisório',
        description: 'Para decisões administrativas formais',
        template: generateDecisionTemplate(fields),
        isStandard: true,
        tags: ["decisão", "autoridade"]
      },
      {
        id: 'encaminhamento',
        name: 'Encaminhamento',
        description: 'Para encaminhar documentos entre setores',
        template: generateForwardingTemplate(fields),
        isStandard: true,
        tags: ["encaminhamento", "procedimento"]
      }
    ],
    parecer: [
      {
        id: 'parecer_tecnico',
        name: 'Parecer Técnico',
        description: 'Para análises técnicas sobre um tema',
        template: generateTechnicalOpinionTemplate(fields),
        isStandard: true,
        tags: ["técnico", "análise"]
      },
      {
        id: 'relatorio',
        name: 'Relatório',
        description: 'Para apresentação de resultados ou situações',
        template: generateReportTemplate(fields),
        isStandard: true,
        tags: ["relatório", "resultado"]
      }
    ]
  };

  // Filter templates based on search term
  const filterTemplates = (templates: any[]) => {
    if (!searchTerm) return templates;
    
    return templates.filter(
      template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  function handleSelectTemplate(template: string) {
    onSelect(template);
    setOpen(false);
    setPreviewTemplate(null);
  }

  function handlePreviewTemplate(template: string) {
    setPreviewTemplate(template);
  }

  function handleClosePreview() {
    setPreviewTemplate(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          <span>Modelos de Documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Biblioteca de Modelos</DialogTitle>
          <DialogDescription>
            Escolha um modelo para começar ou continue com um documento em branco.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 my-2">
          <Input 
            placeholder="Buscar modelos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="administrativo" value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="w-full justify-start overflow-auto">
            {templateCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex flex-1 overflow-hidden mt-2">
            {/* Templates list */}
            <div className={`flex-1 overflow-y-auto pr-2 ${previewTemplate ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
              {Object.entries(templateLibrary).map(([category, templates]) => (
                <TabsContent key={category} value={category} className="m-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {filterTemplates(templates).map((template) => (
                      <div
                        key={template.id}
                        className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <FileDown className="h-8 w-8 text-muted-foreground" />
                          <div className="flex gap-2">
                            {template.isStandard && (
                              <Badge variant="outline" className="bg-primary/10">Padrão</Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewTemplate(template.template);
                              }}
                            >
                              <PanelLeftOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {template.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSelectTemplate(template.template)}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Usar
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleSelectTemplate(template.template)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
            
            {/* Preview panel */}
            {previewTemplate && (
              <div className="w-full md:w-1/2 border-l md:pl-4 overflow-y-auto">
                <div className="sticky top-0 bg-background pb-2 flex justify-between items-center">
                  <h3 className="font-semibold">Pré-visualização</h3>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleClosePreview}
                      className="md:hidden"
                    >
                      Voltar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSelectTemplate(previewTemplate)}
                    >
                      Usar este modelo
                    </Button>
                  </div>
                </div>
                <div 
                  className="prose prose-sm max-w-none border rounded-md p-4 mt-2 bg-white"
                  dangerouslySetInnerHTML={{ __html: previewTemplate }}
                />
              </div>
            )}
          </div>
        </Tabs>
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

// New template functions

function generateDetailedOficioTemplate(fields: TemplateField[]): string {
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
  const remetenteDepartamento = fields.find(f => f.field_key === 'remetente_departamento')?.field_key || 'remetente_departamento';
  const introducao = fields.find(f => f.field_key === 'conteudo_introducao')?.field_key || 'conteudo_introducao';
  const desenvolvimento = fields.find(f => f.field_key === 'conteudo_desenvolvimento')?.field_key || 'conteudo_desenvolvimento';
  const conclusao = fields.find(f => f.field_key === 'conteudo_conclusao')?.field_key || 'conteudo_conclusao';

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
<h3><strong>INTRODUÇÃO</strong></h3>
<p>{{${introducao}}}</p>
<p><br></p>
<h3><strong>DESENVOLVIMENTO</strong></h3>
<p>{{${desenvolvimento}}}</p>
<p><br></p>
<h3><strong>CONCLUSÃO</strong></h3>
<p>{{${conclusao}}}</p>
<p><br></p>
<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
<p style="text-align:center;">{{${remetenteDepartamento}}}</p>
  `;
}

function generateMayorOfficeTemplate(fields: TemplateField[]): string {
  // Find field keys
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioCargo = fields.find(f => f.field_key === 'destinatario_cargo')?.field_key || 'destinatario_cargo';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const referencia = fields.find(f => f.field_key === 'documento_referencia')?.field_key || 'documento_referencia';

  return `
<div style="text-align:center;">
  <h2><strong>GABINETE DO PREFEITO</strong></h2>
  <h3>MUNICÍPIO DE {{${cidade}}}</h3>
  <p>Ofício do Gabinete Nº {{${numeroOficio}}}/202X</p>
</div>

<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p><strong>Referência:</strong> {{${referencia}}}</p>
<p><strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>

<p>Ao(À) Excelentíssimo(a) Senhor(a)<br>
<strong>{{${destinatarioNome}}}</strong><br>
{{${destinatarioCargo}}}<br>
{{${destinatarioOrgao}}}</p>
<p><br></p>

<p>{{${corpoTexto}}}</p>
<p><br></p>

<p style="text-align:center;">Cordialmente,</p>
<p><br></p>
<p style="text-align:center;"><strong>PREFEITO MUNICIPAL</strong></p>
  `;
}

function generateCircularTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';

  return `
<h2 style="text-align:center;"><strong>CIRCULAR Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p><strong>A TODOS OS DEPARTAMENTOS</strong></p>
<p><strong>Assunto: {{${assunto}}}</strong></p>
<p><br></p>

<p>Prezados Senhores,</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>

<p>Esta circular entra em vigor na data de sua publicação.</p>
<p><br></p>

<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
  `;
}

function generateInformativoTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteDepartamento = fields.find(f => f.field_key === 'remetente_departamento')?.field_key || 'remetente_departamento';

  return `
<div style="text-align:center;">
  <h2><strong>INFORMATIVO Nº {{${numeroOficio}}}/202X</strong></h2>
  <p>Data: {{${dataEmissao}}}</p>
</div>
<p><br></p>

<div style="background-color: #f0f0f0; padding: 10px; text-align: center;">
  <h3><strong>{{${assunto}}}</strong></h3>
</div>
<p><br></p>

<p>{{${corpoTexto}}}</p>
<p><br></p>

<p style="text-align:right;">Departamento de {{${remetenteDepartamento}}}</p>
<p style="text-align:right;">{{${remetenteNome}}}</p>
  `;
}

function generateSimpleRequestTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioCargo = fields.find(f => f.field_key === 'destinatario_cargo')?.field_key || 'destinatario_cargo';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';

  return `
<h2 style="text-align:center;"><strong>REQUERIMENTO Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p>Ao Sr(a).<br>
<strong>{{${destinatarioNome}}}</strong><br>
{{${destinatarioCargo}}}</p>
<p><br></p>

<p><strong>Assunto: {{${assunto}}}</strong></p>
<p><br></p>

<p>Venho por meio deste requerer:</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>

<p>Nestes termos, peço deferimento.</p>
<p><br></p>

<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
  `;
}

function generateResourceRequestTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteDepartamento = fields.find(f => f.field_key === 'remetente_departamento')?.field_key || 'remetente_departamento';

  return `
<h2 style="text-align:center;"><strong>SOLICITAÇÃO DE RECURSOS</strong></h2>
<h3 style="text-align:center;">Memorando nº {{${numeroOficio}}}/202X</h3>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p><strong>De:</strong> Departamento de {{${remetenteDepartamento}}}<br>
<strong>Para:</strong> {{${destinatarioOrgao}}}<br>
<strong>At.:</strong> {{${destinatarioNome}}}<br>
<strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>

<p>Prezados,</p>
<p><br></p>
<p>Vimos por meio deste documento solicitar os seguintes recursos:</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>

<p>Justificativa: A presente solicitação visa atender às necessidades do departamento para o pleno cumprimento de suas atividades.</p>
<p><br></p>

<p>Atenciosamente,</p>
<p><br></p>
<p><strong>{{${remetenteNome}}}</strong></p>
<p>Departamento de {{${remetenteDepartamento}}}</p>
  `;
}

function generateDecisionTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const documentoReferencia = fields.find(f => f.field_key === 'documento_referencia')?.field_key || 'documento_referencia';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';

  return `
<h2 style="text-align:center;"><strong>DESPACHO DECISÓRIO Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p><strong>Referência:</strong> {{${documentoReferencia}}}<br>
<strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>

<p>DECISÃO:</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>

<p>Este é o despacho.</p>
<p><br></p>

<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
  `;
}

function generateForwardingTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const destinatarioNome = fields.find(f => f.field_key === 'destinatario_nome')?.field_key || 'destinatario_nome';
  const destinatarioOrgao = fields.find(f => f.field_key === 'destinatario_orgao')?.field_key || 'destinatario_orgao';
  const documentoReferencia = fields.find(f => f.field_key === 'documento_referencia')?.field_key || 'documento_referencia';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const corpoTexto = fields.find(f => f.field_key === 'corpo_texto')?.field_key || 'corpo_texto';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteDepartamento = fields.find(f => f.field_key === 'remetente_departamento')?.field_key || 'remetente_departamento';

  return `
<h2 style="text-align:center;"><strong>ENCAMINHAMENTO</strong></h2>
<h3 style="text-align:center;">Despacho nº {{${numeroOficio}}}/202X</h3>
<p style="text-align:right;">{{${dataEmissao}}}</p>
<p><br></p>

<p><strong>De:</strong> {{${remetenteDepartamento}}}<br>
<strong>Para:</strong> {{${destinatarioOrgao}}}<br>
<strong>Atenção:</strong> {{${destinatarioNome}}}<br>
<strong>Referência:</strong> {{${documentoReferencia}}}<br>
<strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>

<p>Encaminho o documento em referência para:</p>
<p><br></p>
<p>{{${corpoTexto}}}</p>
<p><br></p>

<p style="text-align:right;">{{${remetenteNome}}}<br>{{${remetenteDepartamento}}}</p>
  `;
}

function generateTechnicalOpinionTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const documentoReferencia = fields.find(f => f.field_key === 'documento_referencia')?.field_key || 'documento_referencia';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const introducao = fields.find(f => f.field_key === 'conteudo_introducao')?.field_key || 'conteudo_introducao';
  const desenvolvimento = fields.find(f => f.field_key === 'conteudo_desenvolvimento')?.field_key || 'conteudo_desenvolvimento';
  const conclusao = fields.find(f => f.field_key === 'conteudo_conclusao')?.field_key || 'conteudo_conclusao';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';

  return `
<h2 style="text-align:center;"><strong>PARECER TÉCNICO Nº {{${numeroOficio}}}/202X</strong></h2>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p><strong>Referência:</strong> {{${documentoReferencia}}}<br>
<strong>Assunto:</strong> {{${assunto}}}</p>
<p><br></p>

<h3><strong>1. RELATÓRIO</strong></h3>
<p>{{${introducao}}}</p>
<p><br></p>

<h3><strong>2. ANÁLISE</strong></h3>
<p>{{${desenvolvimento}}}</p>
<p><br></p>

<h3><strong>3. PARECER</strong></h3>
<p>{{${conclusao}}}</p>
<p><br></p>

<p>É o parecer.</p>
<p><br></p>

<p style="text-align:center;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
  `;
}

function generateReportTemplate(fields: TemplateField[]): string {
  const numeroOficio = fields.find(f => f.field_key === 'numero_oficio')?.field_key || 'numero_oficio';
  const assunto = fields.find(f => f.field_key === 'assunto')?.field_key || 'assunto';
  const cidade = fields.find(f => f.field_key === 'cidade')?.field_key || 'cidade';
  const dataEmissao = fields.find(f => f.field_key === 'data_emissao')?.field_key || 'data_emissao';
  const introducao = fields.find(f => f.field_key === 'conteudo_introducao')?.field_key || 'conteudo_introducao';
  const desenvolvimento = fields.find(f => f.field_key === 'conteudo_desenvolvimento')?.field_key || 'conteudo_desenvolvimento';
  const conclusao = fields.find(f => f.field_key === 'conteudo_conclusao')?.field_key || 'conteudo_conclusao';
  const remetenteNome = fields.find(f => f.field_key === 'remetente_nome')?.field_key || 'remetente_nome';
  const remetenteCargo = fields.find(f => f.field_key === 'remetente_cargo')?.field_key || 'remetente_cargo';
  const remetenteDepartamento = fields.find(f => f.field_key === 'remetente_departamento')?.field_key || 'remetente_departamento';

  return `
<h2 style="text-align:center;"><strong>RELATÓRIO Nº {{${numeroOficio}}}/202X</strong></h2>
<h3 style="text-align:center;">{{${assunto}}}</h3>
<p style="text-align:right;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<h3><strong>1. INTRODUÇÃO</strong></h3>
<p>{{${introducao}}}</p>
<p><br></p>

<h3><strong>2. DESENVOLVIMENTO</strong></h3>
<p>{{${desenvolvimento}}}</p>
<p><br></p>

<h3><strong>3. CONCLUSÃO</strong></h3>
<p>{{${conclusao}}}</p>
<p><br></p>

<p style="text-align:center;">{{${cidade}}}, {{${dataEmissao}}}</p>
<p><br></p>

<p style="text-align:center;"><strong>{{${remetenteNome}}}</strong></p>
<p style="text-align:center;">{{${remetenteCargo}}}</p>
<p style="text-align:center;">{{${remetenteDepartamento}}}</p>
  `;
}
