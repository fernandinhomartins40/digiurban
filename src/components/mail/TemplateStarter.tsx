
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
  fields: Partial<TemplateField>[];
  onSelect: (content: string, fields: Partial<TemplateField>[]) => void;
}

export function TemplateStarter({ fields, onSelect }: TemplateStarterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("administrativo");
  const [previewTemplate, setPreviewTemplate] = useState<{content: string, fields: Partial<TemplateField>[]} | null>(null);

  // Define template categories
  const templateCategories = [
    { id: "administrativo", name: "Administrativos" },
    { id: "comunicacao", name: "Comunicações" },
    { id: "requerimento", name: "Requerimentos" },
    { id: "despacho", name: "Despachos" },
    { id: "parecer", name: "Pareceres" }
  ];

  // Template fields by category
  const templateFieldSets: Record<string, Partial<TemplateField>[]> = {
    basic: [
      { field_key: 'destinatario_nome', field_label: 'Nome do Destinatário', field_type: 'text', is_required: true },
      { field_key: 'destinatario_cargo', field_label: 'Cargo do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'destinatario_orgao', field_label: 'Órgão do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'numero_oficio', field_label: 'Número do Documento', field_type: 'text', is_required: true },
      { field_key: 'assunto', field_label: 'Assunto', field_type: 'text', is_required: true },
      { field_key: 'cidade', field_label: 'Cidade', field_type: 'text', is_required: false },
      { field_key: 'data_emissao', field_label: 'Data de Emissão', field_type: 'date', is_required: true },
      { field_key: 'remetente_nome', field_label: 'Nome do Remetente', field_type: 'text', is_required: true },
      { field_key: 'remetente_cargo', field_label: 'Cargo do Remetente', field_type: 'text', is_required: false },
      { field_key: 'corpo_texto', field_label: 'Corpo do Texto', field_type: 'textarea', is_required: true },
    ],
    detailed: [
      // Basic fields
      { field_key: 'destinatario_nome', field_label: 'Nome do Destinatário', field_type: 'text', is_required: true },
      { field_key: 'destinatario_cargo', field_label: 'Cargo do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'destinatario_orgao', field_label: 'Órgão do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'numero_oficio', field_label: 'Número do Documento', field_type: 'text', is_required: true },
      { field_key: 'assunto', field_label: 'Assunto', field_type: 'text', is_required: true },
      { field_key: 'cidade', field_label: 'Cidade', field_type: 'text', is_required: false },
      { field_key: 'data_emissao', field_label: 'Data de Emissão', field_type: 'date', is_required: true },
      { field_key: 'remetente_nome', field_label: 'Nome do Remetente', field_type: 'text', is_required: true },
      { field_key: 'remetente_cargo', field_label: 'Cargo do Remetente', field_type: 'text', is_required: false },
      { field_key: 'remetente_departamento', field_label: 'Departamento do Remetente', field_type: 'text', is_required: false },
      // Detailed sections
      { field_key: 'conteudo_introducao', field_label: 'Introdução', field_type: 'textarea', is_required: false },
      { field_key: 'conteudo_desenvolvimento', field_label: 'Desenvolvimento', field_type: 'textarea', is_required: false },
      { field_key: 'conteudo_conclusao', field_label: 'Conclusão', field_type: 'textarea', is_required: false },
    ],
    comunicacao: [
      { field_key: 'numero_oficio', field_label: 'Número do Documento', field_type: 'text', is_required: true },
      { field_key: 'assunto', field_label: 'Assunto', field_type: 'text', is_required: true },
      { field_key: 'destinatario_nome', field_label: 'Nome do Destinatário', field_type: 'text', is_required: true },
      { field_key: 'destinatario_cargo', field_label: 'Cargo do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'destinatario_orgao', field_label: 'Órgão do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'data_emissao', field_label: 'Data de Emissão', field_type: 'date', is_required: true },
      { field_key: 'corpo_texto', field_label: 'Corpo do Texto', field_type: 'textarea', is_required: true },
      { field_key: 'remetente_nome', field_label: 'Nome do Remetente', field_type: 'text', is_required: true },
      { field_key: 'remetente_cargo', field_label: 'Cargo do Remetente', field_type: 'text', is_required: false },
    ],
    memorando: [
      { field_key: 'numero_oficio', field_label: 'Número do Memorando', field_type: 'text', is_required: true },
      { field_key: 'assunto', field_label: 'Assunto', field_type: 'text', is_required: true },
      { field_key: 'destinatario_nome', field_label: 'Nome do Destinatário', field_type: 'text', is_required: true },
      { field_key: 'destinatario_orgao', field_label: 'Órgão do Destinatário', field_type: 'text', is_required: false },
      { field_key: 'remetente_nome', field_label: 'Nome do Remetente', field_type: 'text', is_required: true },
      { field_key: 'cidade', field_label: 'Cidade', field_type: 'text', is_required: false },
      { field_key: 'data_emissao', field_label: 'Data de Emissão', field_type: 'date', is_required: true },
      { field_key: 'corpo_texto', field_label: 'Corpo do Texto', field_type: 'textarea', is_required: true },
    ],
  };

  // Expanded template library with categories and associated fields
  const templateLibrary = {
    administrativo: [
      {
        id: 'oficio_padrao',
        name: 'Ofício Padrão',
        description: 'Modelo padrão para documentos oficiais',
        template: generateBasicTemplate(),
        isStandard: true,
        tags: ["formal", "geral"],
        fields: templateFieldSets.basic
      },
      {
        id: 'oficio_detalhado',
        name: 'Ofício Detalhado',
        description: 'Ofício com seções detalhadas para comunicações formais',
        template: generateDetailedOficioTemplate(),
        isStandard: true,
        tags: ["formal", "detalhado"],
        fields: templateFieldSets.detailed
      },
      {
        id: 'oficio_gabinete',
        name: 'Ofício do Gabinete',
        description: 'Modelo específico para comunicações do Gabinete do Prefeito',
        template: generateMayorOfficeTemplate(),
        isStandard: true,
        tags: ["gabinete", "executivo"],
        fields: templateFieldSets.basic
      }
    ],
    comunicacao: [
      {
        id: 'comunicado_interno',
        name: 'Comunicado Interno',
        description: 'Para comunicações internas entre departamentos',
        template: generateCommunicationTemplate(),
        isStandard: true,
        tags: ["interno", "departamentos"],
        fields: templateFieldSets.comunicacao
      },
      {
        id: 'circular',
        name: 'Circular',
        description: 'Para envio a múltiplos destinatários',
        template: generateCircularTemplate(),
        isStandard: true,
        tags: ["múltiplos", "circular"],
        fields: templateFieldSets.comunicacao
      },
      {
        id: 'informativo',
        name: 'Informativo',
        description: 'Para divulgação de informações importantes',
        template: generateInformativoTemplate(),
        isStandard: true,
        tags: ["informação", "divulgação"],
        fields: templateFieldSets.comunicacao
      }
    ],
    requerimento: [
      {
        id: 'memorando',
        name: 'Memorando',
        description: 'Para solicitações e comunicações formais',
        template: generateMemoTemplate(),
        isStandard: true,
        tags: ["solicitação", "formal"],
        fields: templateFieldSets.memorando
      },
      {
        id: 'requerimento_simples',
        name: 'Requerimento Simples',
        description: 'Para realizar pedidos formais simples',
        template: generateSimpleRequestTemplate(),
        isStandard: true,
        tags: ["solicitação", "pedido"],
        fields: templateFieldSets.basic
      },
      {
        id: 'solicitacao_recursos',
        name: 'Solicitação de Recursos',
        description: 'Para requisitar recursos materiais ou financeiros',
        template: generateResourceRequestTemplate(),
        isStandard: true,
        tags: ["recursos", "requisição"],
        fields: templateFieldSets.basic
      }
    ],
    despacho: [
      {
        id: 'despacho_decisorio',
        name: 'Despacho Decisório',
        description: 'Para decisões administrativas formais',
        template: generateDecisionTemplate(),
        isStandard: true,
        tags: ["decisão", "autoridade"],
        fields: templateFieldSets.basic
      },
      {
        id: 'encaminhamento',
        name: 'Encaminhamento',
        description: 'Para encaminhar documentos entre setores',
        template: generateForwardingTemplate(),
        isStandard: true,
        tags: ["encaminhamento", "procedimento"],
        fields: templateFieldSets.basic
      }
    ],
    parecer: [
      {
        id: 'parecer_tecnico',
        name: 'Parecer Técnico',
        description: 'Para análises técnicas sobre um tema',
        template: generateTechnicalOpinionTemplate(),
        isStandard: true,
        tags: ["técnico", "análise"],
        fields: templateFieldSets.basic
      },
      {
        id: 'relatorio',
        name: 'Relatório',
        description: 'Para apresentação de resultados ou situações',
        template: generateReportTemplate(),
        isStandard: true,
        tags: ["relatório", "resultado"],
        fields: templateFieldSets.basic
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

  function handleSelectTemplate(template: string, fields: Partial<TemplateField>[]) {
    onSelect(template, fields);
    setOpen(false);
    setPreviewTemplate(null);
  }

  function handlePreviewTemplate(template: string, fields: Partial<TemplateField>[]) {
    setPreviewTemplate({ content: template, fields });
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
                                handlePreviewTemplate(template.template, template.fields);
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
                            onClick={() => handleSelectTemplate(template.template, template.fields)}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Usar
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleSelectTemplate(template.template, template.fields)}
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
                      onClick={() => handleSelectTemplate(previewTemplate.content, previewTemplate.fields)}
                    >
                      Usar este modelo
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div 
                    className="prose prose-sm max-w-none border rounded-md p-4 mt-2 bg-white"
                    dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                  />

                  {previewTemplate.fields.length > 0 && (
                    <div className="border rounded-md p-4 bg-white">
                      <h4 className="font-medium mb-3">Campos incluídos neste modelo:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {previewTemplate.fields.map((field, index) => (
                          <div key={index} className="text-sm p-2 border rounded-md bg-gray-50 flex items-center gap-2">
                            <span className="font-medium">{field.field_label}:</span>
                            <Badge variant="outline" className="text-xs">{field.field_type}</Badge>
                            {field.is_required && <Badge className="text-xs">Obrigatório</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function generateBasicTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>OFÍCIO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>
<p><strong>A Sua Excelência o(a) Senhor(a)</strong></p>
<p><strong>{{destinatario_nome}}</strong></p>
<p><strong>{{destinatario_cargo}}</strong></p>
<p><strong>{{destinatario_orgao}}</strong></p>
<p><br></p>
<p><strong>Assunto: {{assunto}}</strong></p>
<p><br></p>
<p>Excelentíssimo(a) Senhor(a) {{destinatario_nome}},</p>
<p><br></p>
<p>{{corpo_texto}}</p>
<p><br></p>
<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateCommunicationTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>COMUNICAÇÃO INTERNA Nº {{numero_oficio}}/202X</strong></h2>
<p><br></p>
<p><strong>De:</strong> {{remetente_nome}} - {{remetente_cargo}}</p>
<p><strong>Para:</strong> {{destinatario_nome}} - {{destinatario_cargo}}</p>
<p><strong>Departamento:</strong> {{destinatario_orgao}}</p>
<p><strong>Assunto:</strong> {{assunto}}</p>
<p><strong>Data:</strong> {{data_emissao}}</p>
<p><br></p>
<p><strong>MENSAGEM:</strong></p>
<p><br></p>
<p>{{corpo_texto}}</p>
<p><br></p>
<p>Atenciosamente,</p>
<p><br></p>
<p><strong>{{remetente_nome}}</strong></p>
<p>{{remetente_cargo}}</p>
  `;
}

function generateMemoTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>MEMORANDO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>
<p><strong>De:</strong> {{remetente_nome}}</p>
<p><strong>Para:</strong> {{destinatario_nome}} - {{destinatario_orgao}}</p>
<p><strong>Assunto:</strong> {{assunto}}</p>
<p><br></p>
<p>{{corpo_texto}}</p>
<p><br></p>
<p>Atenciosamente,</p>
<p><br></p>
<p><strong>{{remetente_nome}}</strong></p>
  `;
}

function generateDetailedOficioTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>OFÍCIO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>
<p><strong>A Sua Excelência o(a) Senhor(a)</strong></p>
<p><strong>{{destinatario_nome}}</strong></p>
<p><strong>{{destinatario_cargo}}</strong></p>
<p><strong>{{destinatario_orgao}}</strong></p>
<p><br></p>
<p><strong>Assunto: {{assunto}}</strong></p>
<p><br></p>
<p>Excelentíssimo(a) Senhor(a) {{destinatario_nome}},</p>
<p><br></p>
<h3><strong>INTRODUÇÃO</strong></h3>
<p>{{conteudo_introducao}}</p>
<p><br></p>
<h3><strong>DESENVOLVIMENTO</strong></h3>
<p>{{conteudo_desenvolvimento}}</p>
<p><br></p>
<h3><strong>CONCLUSÃO</strong></h3>
<p>{{conteudo_conclusao}}</p>
<p><br></p>
<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
<p style="text-align:center;">{{remetente_departamento}}</p>
  `;
}

function generateMayorOfficeTemplate(): string {
  return `
<div style="text-align:center;">
  <h2><strong>GABINETE DO PREFEITO</strong></h2>
  <h3>MUNICÍPIO DE {{cidade}}</h3>
  <p>Ofício do Gabinete Nº {{numero_oficio}}/202X</p>
</div>

<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p><strong>Assunto:</strong> {{assunto}}</p>
<p><br></p>

<p>Ao(À) Excelentíssimo(a) Senhor(a)<br>
<strong>{{destinatario_nome}}</strong><br>
{{destinatario_cargo}}<br>
{{destinatario_orgao}}</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p style="text-align:center;">Cordialmente,</p>
<p><br></p>
<p style="text-align:center;"><strong>PREFEITO MUNICIPAL</strong></p>
  `;
}

function generateCircularTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>CIRCULAR Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p><strong>A TODOS OS DEPARTAMENTOS</strong></p>
<p><strong>Assunto:</strong> {{assunto}}</p>
<p><br></p>

<p>Prezados(as) Senhores(as),</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p style="text-align:right;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:right;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:right;">{{remetente_cargo}}</p>
  `;
}

function generateInformativoTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>INFORMATIVO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:center;"><strong>{{assunto}}</strong></p>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p>Para mais informações, entre em contato:</p>
<p>{{remetente_nome}} - {{remetente_cargo}}</p>
  `;
}

function generateSimpleRequestTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>REQUERIMENTO</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p><strong>A Sua Excelência o(a) Senhor(a)</strong></p>
<p><strong>{{destinatario_nome}}</strong></p>
<p><strong>{{destinatario_cargo}}</strong></p>
<p><strong>{{destinatario_orgao}}</strong></p>
<p><br></p>

<p><strong>Assunto: {{assunto}}</strong></p>
<p><br></p>

<p>Eu, {{remetente_nome}}, venho por meio deste solicitar:</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p>Nestes termos, peço deferimento.</p>
<p><br></p>

<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateResourceRequestTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>SOLICITAÇÃO DE RECURSOS Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p><strong>Ao Departamento:</strong> {{destinatario_orgao}}</p>
<p><strong>A/C:</strong> {{destinatario_nome}}</p>
<p><br></p>

<p><strong>Assunto: {{assunto}}</strong></p>
<p><br></p>

<p>Prezado(a) Senhor(a),</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p>Sem mais para o momento, agradeço pela atenção.</p>
<p><br></p>

<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>
<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateDecisionTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>DESPACHO DECISÓRIO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p><strong>Assunto: {{assunto}}</strong></p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p style="text-align:right;">{{cidade}}, {{data_emissao}}.</p>
<p><br></p>

<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateForwardingTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>ENCAMINHAMENTO</strong></h2>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p>Encaminho o presente processo a {{destinatario_nome}} - {{destinatario_orgao}}, para:</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p style="text-align:center;">Atenciosamente,</p>
<p><br></p>

<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateTechnicalOpinionTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>PARECER TÉCNICO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:center;"><strong>{{assunto}}</strong></p>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p>É o parecer.</p>
<p><br></p>

<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}

function generateReportTemplate(): string {
  return `
<h2 style="text-align:center;"><strong>RELATÓRIO Nº {{numero_oficio}}/202X</strong></h2>
<p style="text-align:center;"><strong>{{assunto}}</strong></p>
<p style="text-align:right;">{{cidade}}, {{data_emissao}}</p>
<p><br></p>

<p>{{corpo_texto}}</p>
<p><br></p>

<p style="text-align:center;">{{cidade}}, {{data_emissao}}.</p>
<p><br></p>

<p style="text-align:center;"><strong>{{remetente_nome}}</strong></p>
<p style="text-align:center;">{{remetente_cargo}}</p>
  `;
}
