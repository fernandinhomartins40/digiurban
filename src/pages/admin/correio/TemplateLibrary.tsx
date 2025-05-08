import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileDown,
  ChevronLeft,
  PlusCircle, 
  Copy, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Mail,
  FileText
} from "lucide-react";
import { useMail } from "@/hooks/use-mail";
import { useToast } from "@/hooks/use-toast";
import { Document, Template } from "@/types/mail";

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplateType, setSelectedTemplateType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { getTemplates, documentTypes, getFilledDocuments } = useMail();
  const { data: templates, isLoading: isLoadingTemplates } = getTemplates();
  const { data: filledDocuments, isLoading: isLoadingDocuments } = getFilledDocuments();
  const { data: documentTypesData } = documentTypes;

  // Template categories based on document types
  const templateCategories = documentTypesData?.map(type => ({
    id: type.id,
    name: type.name
  })) || [];

  // Filter templates based on search and type
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedTemplateType || template.document_type_id === selectedTemplateType;
    
    return matchesSearch && matchesType;
  });

  // Filter filled documents based on search and type
  const filteredDocuments = filledDocuments?.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedTemplateType || doc.document_type_id === selectedTemplateType;
    
    return matchesSearch && matchesType;
  });

  // Group templates by standard vs custom
  const groupedTemplates = filteredTemplates?.reduce((acc: { standard: Template[], custom: Template[] }, template) => {
    if (template.name.startsWith("Sistema:")) {
      acc.standard.push(template);
    } else {
      acc.custom.push(template);
    }
    return acc;
  }, { standard: [], custom: [] }) || { standard: [], custom: [] };

  // Handle template duplication
  const handleDuplicateTemplate = (template: Template) => {
    navigate(`/admin/correio/criador-oficios?duplicate=${template.id}`);
    toast({
      title: "Duplicando modelo",
      description: "Você será redirecionado para o editor de modelos."
    });
  };

  // Handle template editing
  const handleEditTemplate = (template: Template) => {
    navigate(`/admin/correio/criador-oficios?edit=${template.id}`);
    toast({
      title: "Editando modelo",
      description: "Você será redirecionado para o editor de modelos."
    });
  };
  
  // Handle filled document actions
  const handleViewDocument = (document: Document) => {
    // TODO: Implement document viewer
    toast({
      title: "Visualizando documento",
      description: "Funcionalidade de visualização a ser implementada"
    });
  };
  
  const handleSendDocument = (document: Document) => {
    navigate(`/admin/correio/email-interno?document=${document.id}`);
    toast({
      title: "Enviando documento",
      description: "Você será redirecionado para a página de email interno."
    });
  };

  // Render template card
  const renderTemplateCard = (template: Template, isStandard: boolean = false) => (
    <Card key={template.id} className="overflow-hidden transition-colors hover:border-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">
            {template.name.replace("Sistema: ", "")}
          </CardTitle>
          <div className="flex gap-1">
            {isStandard && <Badge variant="outline" className="bg-primary/10">Padrão</Badge>}
            {template.document_type && (
              <Badge variant="secondary">{template.document_type.name}</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description || "Sem descrição"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2 mt-2">
          {isStandard ? (
            <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template)}>
              <Copy className="h-3.5 w-3.5 mr-1" /> Duplicar
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                <Edit className="h-3.5 w-3.5 mr-1" /> Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Duplicar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  // Render document card
  const renderDocumentCard = (document: Document) => (
    <Card key={document.id} className="overflow-hidden transition-colors hover:border-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">
            {document.title}
          </CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline" className="bg-blue-100">Ofício</Badge>
            {document.document_type && (
              <Badge variant="secondary">{document.document_type.name}</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Protocolo: {document.protocol_number}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => handleViewDocument(document)}>
            <FileText className="h-3.5 w-3.5 mr-1" /> Visualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSendDocument(document)}>
            <Mail className="h-3.5 w-3.5 mr-1" /> Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Modelos</h1>
            <p className="text-muted-foreground">
              Visualize, edite e crie novos modelos de documentos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/correio/novo-oficio")}>
            <FileText className="mr-2 h-4 w-4" />
            Novo Ofício
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/correio/criador-oficios")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Modelo
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-full md:w-[300px]"
            placeholder="Buscar modelo ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={() => setSelectedTemplateType(null)}
          >
            <Filter className="h-4 w-4" />
            {selectedTemplateType ? 'Limpar Filtro' : 'Filtrar por tipo'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="templates">Modelos</TabsTrigger>
          <TabsTrigger value="documents">Ofícios Criados</TabsTrigger>
        </TabsList>

        {/* All Content Tab */}
        <TabsContent value="all" className="m-0">
          {(isLoadingTemplates || isLoadingDocuments) ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (filteredTemplates?.length === 0 && filteredDocuments?.length === 0) ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileDown className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground">
                  Não foram encontrados modelos ou documentos com os critérios selecionados.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTemplateType(null);
                  }}
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {/* Documents Section */}
              {filteredDocuments && filteredDocuments.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Ofícios Criados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map(document => renderDocumentCard(document))}
                  </div>
                </div>
              )}
              
              {/* Templates Section */}
              {filteredTemplates && filteredTemplates.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Modelos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedTemplates.standard.map(template => renderTemplateCard(template, true))}
                    {groupedTemplates.custom.map(template => renderTemplateCard(template))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="m-0">
          {isLoadingTemplates ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredTemplates?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileDown className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">Nenhum modelo encontrado</h3>
                <p className="text-muted-foreground">
                  Não foram encontrados modelos com os critérios selecionados.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTemplateType(null);
                    }}
                  >
                    Limpar filtros
                  </Button>
                  <Button onClick={() => navigate("/admin/correio/criador-oficios")}>
                    Criar modelo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTemplates.standard.map(template => renderTemplateCard(template, true))}
              {groupedTemplates.custom.map(template => renderTemplateCard(template))}
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="m-0">
          {isLoadingDocuments ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredDocuments?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">Nenhum ofício encontrado</h3>
                <p className="text-muted-foreground">
                  Você ainda não criou nenhum ofício ou nenhum corresponde aos critérios de busca.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTemplateType(null);
                    }}
                  >
                    Limpar filtros
                  </Button>
                  <Button onClick={() => navigate("/admin/correio/novo-oficio")}>
                    Novo Ofício
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(document => renderDocumentCard(document))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
