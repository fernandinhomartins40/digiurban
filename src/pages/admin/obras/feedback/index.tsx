
import React, { useState } from "react";
import { ObrasLayout } from "../components/ObrasLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, MessageSquare, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for citizen feedback
const feedbackMock = [
  {
    id: 1,
    nome: "Ricardo Silva",
    avatar: "",
    obra: "Revitalização da Praça Central",
    data: "2025-05-01",
    status: "pendente",
    sentimento: "positivo",
    mensagem: "Estou feliz em ver o progresso da revitalização da praça. Será um espaço importante para nossa comunidade. Apenas peço atenção aos bancos que precisam de mais sombra.",
    resposta: null
  },
  {
    id: 2,
    nome: "Ana Souza",
    avatar: "",
    obra: "Pavimentação da Rua das Flores",
    data: "2025-04-28",
    status: "respondido",
    sentimento: "negativo",
    mensagem: "A obra está causando muito transtorno aos moradores. Os operários começam muito cedo e o barulho é insuportável. Além disso, há muito pó que está afetando as casas próximas.",
    resposta: "Prezada Ana, pedimos desculpas pelo transtorno. Estamos ajustando o horário de início das obras para 8h e implementando medidas para reduzir a poeira, como umidificação constante da área. A previsão é que esta fase mais incômoda termine em 10 dias."
  },
  {
    id: 3,
    nome: "Carlos Mendes",
    avatar: "",
    obra: "Reforma da Escola Municipal",
    data: "2025-04-25",
    status: "encaminhado",
    sentimento: "neutro",
    mensagem: "Gostaria de saber se a reforma incluirá melhoria na acessibilidade da escola, especificamente rampas e banheiros adaptados para cadeirantes.",
    resposta: null
  },
  {
    id: 4,
    nome: "Juliana Alves",
    avatar: "",
    obra: "Duplicação de Via Urbana",
    data: "2025-04-23",
    status: "respondido",
    sentimento: "positivo",
    mensagem: "A obra está avançando bem e já percebemos a diferença no fluxo de veículos. Parabéns à equipe pela organização e eficiência.",
    resposta: "Olá Juliana, agradecemos seu feedback positivo! Estamos empenhados em concluir a obra dentro do prazo e com a menor interferência possível no dia a dia dos cidadãos."
  },
  {
    id: 5,
    nome: "Paulo Campos",
    avatar: "",
    obra: "Construção de UBS",
    data: "2025-04-20",
    status: "pendente",
    sentimento: "negativo",
    mensagem: "A construção da UBS está muito lenta e parece que está atrasada em relação ao cronograma informado. Precisamos urgentemente dessa unidade de saúde na região.",
    resposta: null
  },
];

// Mock data for statistics
const estatisticasMock = {
  total: feedbackMock.length,
  pendentes: feedbackMock.filter(f => f.status === 'pendente').length,
  respondidos: feedbackMock.filter(f => f.status === 'respondido').length,
  positivos: feedbackMock.filter(f => f.sentimento === 'positivo').length,
  negativos: feedbackMock.filter(f => f.sentimento === 'negativo').length,
  neutros: feedbackMock.filter(f => f.sentimento === 'neutro').length,
};

export default function FeedbackCidadaoIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [obraFilter, setObraFilter] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<typeof feedbackMock[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [respostaText, setRespostaText] = useState("");

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pendente</Badge>;
      case 'respondido':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Respondido</Badge>;
      case 'encaminhado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Encaminhado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getSentimentoIcon = (sentimento: string) => {
    switch(sentimento) {
      case 'positivo':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negativo':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case 'neutro':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredFeedback = feedbackMock.filter(feedback => {
    const matchesQuery = 
      feedback.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
      feedback.obra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.mensagem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || feedback.status === statusFilter;
    const matchesObra = obraFilter === "" || feedback.obra === obraFilter;
    
    return matchesQuery && matchesStatus && matchesObra;
  });

  const handleOpenDialog = (feedback: typeof feedbackMock[0]) => {
    setSelectedFeedback(feedback);
    setRespostaText(feedback.resposta || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFeedback(null);
    setIsDialogOpen(false);
    setRespostaText("");
  };

  const handleSendResponse = () => {
    // Here would be the logic to send the response
    console.log(`Enviando resposta para feedback ID ${selectedFeedback?.id}: ${respostaText}`);
    handleCloseDialog();
  };

  return (
    <ObrasLayout title="Feedback Cidadão" description="Gestão de feedbacks e sugestões sobre obras públicas">
      <div className="space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Total de Feedbacks
                </span>
                <span className="text-2xl">{estatisticasMock.total}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-6">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span>Pendentes: {estatisticasMock.pendentes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Respondidos: {estatisticasMock.respondidos}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ThumbsUp size={16} />
                  Sentimento Geral
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-6">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} className="text-green-500" />
                  <span>Positivos: {estatisticasMock.positivos}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown size={14} className="text-red-500" />
                  <span>Negativos: {estatisticasMock.negativos}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} className="text-blue-500" />
                  <span>Neutros: {estatisticasMock.neutros}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Taxa de Resposta
                </span>
                <span className="text-2xl">{Math.round((estatisticasMock.respondidos / estatisticasMock.total) * 100)}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(estatisticasMock.respondidos / estatisticasMock.total) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex-1 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar feedbacks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="encaminhado">Encaminhados</SelectItem>
                  <SelectItem value="respondido">Respondidos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={obraFilter} onValueChange={setObraFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as obras</SelectItem>
                  <SelectItem value="Revitalização da Praça Central">Praça Central</SelectItem>
                  <SelectItem value="Pavimentação da Rua das Flores">Rua das Flores</SelectItem>
                  <SelectItem value="Reforma da Escola Municipal">Escola Municipal</SelectItem>
                  <SelectItem value="Construção de UBS">UBS</SelectItem>
                  <SelectItem value="Duplicação de Via Urbana">Via Urbana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Feedback list tabs */}
        <Tabs defaultValue="todos">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="positivos">Positivos</TabsTrigger>
            <TabsTrigger value="negativos">Negativos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-4 space-y-4">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedback) => (
                <Card key={feedback.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={feedback.avatar} />
                        <AvatarFallback>{feedback.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{feedback.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              <span>Sobre: {feedback.obra}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(feedback.data).toLocaleDateString('pt-BR')}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSentimentoIcon(feedback.sentimento)}
                            {getStatusBadge(feedback.status)}
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-md p-3 text-sm">
                          {feedback.mensagem}
                        </div>
                        
                        {feedback.resposta && (
                          <div className="bg-blue-50 rounded-md p-3 text-sm mt-2 border border-blue-100">
                            <p className="font-medium text-xs mb-1 text-blue-700">Resposta da Prefeitura:</p>
                            {feedback.resposta}
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button 
                            variant={feedback.status === 'respondido' ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleOpenDialog(feedback)}
                          >
                            {feedback.status === 'respondido' ? "Ver Resposta" : "Responder"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-2 text-lg font-semibold">Nenhum feedback encontrado</h3>
                <p className="text-muted-foreground">Não existem feedbacks com os filtros aplicados.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Conteúdo similar para as outras abas */}
          <TabsContent value="pendentes" className="mt-4">
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Feedbacks pendentes de resposta
            </div>
          </TabsContent>
          
          <TabsContent value="positivos" className="mt-4">
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Feedbacks com sentimento positivo
            </div>
          </TabsContent>
          
          <TabsContent value="negativos" className="mt-4">
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Feedbacks com sentimento negativo
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Dialog for responding to feedback */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between">
                <span>Feedback de {selectedFeedback?.nome}</span>
                <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                  <X size={18} />
                </Button>
              </DialogTitle>
              <DialogDescription>
                Sobre: {selectedFeedback?.obra} - {selectedFeedback?.data ? new Date(selectedFeedback.data).toLocaleDateString('pt-BR') : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="bg-muted/50 rounded-md p-3 text-sm">
                {selectedFeedback?.mensagem}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sua resposta</label>
                <textarea 
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-transparent"
                  placeholder="Digite sua resposta ao feedback..."
                  value={respostaText}
                  onChange={(e) => setRespostaText(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSendResponse}>Enviar Resposta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ObrasLayout>
  );
}
