
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  MessageSquare,
  Send
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchCitizenRequestById, 
  CitizenRequest,
  addCommentToCitizenRequest,
  Comment
} from "@/services/citizen/requestsService";
import { toast } from "@/hooks/use-toast";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [request, setRequest] = useState<CitizenRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadRequest() {
      if (id) {
        try {
          const data = await fetchCitizenRequestById(id);
          setRequest(data);
        } catch (error) {
          console.error("Error loading request:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os detalhes da solicitação",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    }

    loadRequest();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em andamento";
      case "completed":
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setSubmitting(true);
    try {
      if (id && user) {
        await addCommentToCitizenRequest(id, comment, user.id);
        
        // Refresh the request data
        const updatedRequest = await fetchCitizenRequestById(id);
        setRequest(updatedRequest);
        setComment("");
        
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi adicionado com sucesso",
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 text-center">
        <div className="animate-pulse">Carregando detalhes da solicitação...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Solicitação não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A solicitação que você está procurando não existe ou foi removida.
          </p>
          <Link to="/citizen/requests">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para solicitações
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/citizen/requests" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar para solicitações
          </Link>
          <Heading 
            title={request.title || "Detalhe da Solicitação"}
            description={`Protocolo: ${request.protocol}`}
          />
        </div>
        <Badge className={`${getStatusColor(request.status)} px-3 py-1 text-sm`}>
          {getStatusIcon(request.status)}
          <span className="ml-1">{getStatusLabel(request.status)}</span>
        </Badge>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Solicitação</CardTitle>
              <CardDescription>Informações sobre sua solicitação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Descrição</h3>
                <p className="mt-1">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Departamento</h3>
                  <p className="mt-1">{request.target_department}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Prioridade</h3>
                  <p className="mt-1 capitalize">{request.priority}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Data de Criação</h3>
                  <p className="mt-1">
                    {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                {request.updatedAt && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Última Atualização</h3>
                    <p className="mt-1">
                      {new Date(request.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Comentários
                </CardTitle>
                <Badge variant="outline" className="font-normal">
                  {request.comments?.length || 0}
                </Badge>
              </div>
              <CardDescription>Atualizações e comunicação sobre esta solicitação</CardDescription>
            </CardHeader>
            
            <Separator className="mb-0" />
            
            <CardContent className="pt-4">
              {request.comments && request.comments.length > 0 ? (
                <div className="space-y-4">
                  {request.comments.map((comment: Comment) => (
                    <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">{comment.userName || 'Usuário'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Separator className="mb-2" />
              <div className="flex items-center w-full gap-2">
                <Input
                  placeholder="Adicione um comentário..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddComment} 
                  disabled={!comment.trim() || submitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status da Solicitação</CardTitle>
              <CardDescription>Acompanhe o andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-muted pl-4 space-y-6 py-2">
                <div className="relative">
                  <div className="absolute -left-[21px] -top-1 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                  <h3 className="font-medium">Solicitação Enviada</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(request.createdAt).toLocaleDateString("pt-BR", {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-[21px] -top-1 h-4 w-4 rounded-full ${
                    request.status !== "pending" ? "bg-primary" : "bg-muted"
                  } border-4 border-background`}></div>
                  <h3 className={request.status !== "pending" ? "font-medium" : "text-muted-foreground"}>
                    Em Análise
                  </h3>
                  {request.status !== "pending" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sua solicitação está sendo analisada pela equipe responsável.
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <div className={`absolute -left-[21px] -top-1 h-4 w-4 rounded-full ${
                    request.status === "completed" ? "bg-primary" : "bg-muted"
                  } border-4 border-background`}></div>
                  <h3 className={request.status === "completed" ? "font-medium" : "text-muted-foreground"}>
                    Concluído
                  </h3>
                  {request.status === "completed" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Sua solicitação foi atendida com sucesso.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
