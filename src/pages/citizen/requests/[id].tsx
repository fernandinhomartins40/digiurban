
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Clock,
  Building,
  Tag,
  MessageSquare,
  Send,
  AlertCircle, 
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCitizenRequestById, addCommentToRequest } from "@/services/citizen/requestsService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRequestDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getCitizenRequestById(id, user?.id);
        if (!data) {
          toast({
            title: "Solicitação não encontrada",
            description: "Não foi possível encontrar a solicitação solicitada.",
            variant: "destructive",
          });
          navigate("/citizen/requests");
          return;
        }
        setRequest(data);
      } catch (error) {
        console.error("Error loading request details:", error);
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes da solicitação. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRequestDetails();
  }, [id, user, navigate, toast]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + 
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Em andamento</Badge>;
      case "completed":
        return <Badge variant="default">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Baixa</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "high":
        return <Badge variant="secondary">Alta</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setSubmitting(true);
    try {
      const success = await addCommentToRequest(id!, comment, user?.id);
      if (success) {
        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi adicionado com sucesso.",
        });
        setComment("");
        // Refresh request data to show the new comment
        const updatedRequest = await getCitizenRequestById(id!, user?.id);
        setRequest(updatedRequest);
      } else {
        throw new Error("Falha ao adicionar comentário");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível adicionar seu comentário. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando detalhes da solicitação...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Solicitação não encontrada</AlertTitle>
          <AlertDescription>
            Não foi possível encontrar a solicitação solicitada.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/citizen/requests")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para solicitações
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/citizen/requests")}
          className="mr-2"
        >
          <ChevronLeft size={20} />
        </Button>
        <Heading 
          title={`Solicitação: ${request.protocol_number}`}
          description="Detalhes e acompanhamento da sua solicitação" 
        />
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">{request.title}</CardTitle>
                  <CardDescription>
                    Protocolo: {request.protocol_number}
                  </CardDescription>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Data de criação:</span>
                  <span className="ml-2 font-medium">{formatDate(request.created_at)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Departamento:</span>
                  <span className="ml-2 font-medium">{request.target_department}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Prioridade:</span>
                  <span className="ml-2">{getPriorityBadge(request.priority)}</span>
                </div>
                {request.due_date && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Prazo:</span>
                    <span className="ml-2 font-medium">{formatDate(request.due_date)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="mr-2 h-5 w-5" /> Comentários
              </CardTitle>
              <CardDescription>
                Acompanhe as atualizações e adicione comentários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.comments && request.comments.length > 0 ? (
                <div className="space-y-4">
                  {request.comments.map((comment: any, index: number) => (
                    <div key={index} className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {comment.author_name || "Usuário"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum comentário ainda. Adicione o primeiro comentário!
                </div>
              )}
              
              <div className="pt-4">
                <div className="flex items-center space-x-2">
                  <Textarea
                    placeholder="Adicione um comentário ou atualização..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button 
                    size="icon" 
                    className="shrink-0"
                    onClick={handleAddComment}
                    disabled={!comment.trim() || submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Andamento</CardTitle>
              <CardDescription>
                Status atual da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-6 before:absolute before:left-0 before:h-full before:border-l-2 before:border-primary/30">
                  <div className="relative -left-2 flex items-center mb-1">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                    <span className="ml-2 font-medium">Solicitação Recebida</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                
                {request.status !== "open" && (
                  <div className="relative pl-6 before:absolute before:left-0 before:h-full before:border-l-2 before:border-primary/30">
                    <div className="relative -left-2 flex items-center mb-1">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                      <span className="ml-2 font-medium">Em Processamento</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A solicitação está sendo analisada pelo departamento responsável
                    </p>
                  </div>
                )}
                
                {(request.status === "completed" || request.status === "cancelled") && (
                  <div className="relative pl-6">
                    <div className="relative -left-2 flex items-center mb-1">
                      <div className={`h-4 w-4 rounded-full ${
                        request.status === "completed" ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                      <span className="ml-2 font-medium">
                        {request.status === "completed" ? "Concluída" : "Cancelada"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {request.status === "completed" 
                        ? "Sua solicitação foi atendida com sucesso" 
                        : "Sua solicitação foi cancelada"
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex flex-col items-start space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">
                Último status atualizado em:
              </p>
              <p className="font-medium text-sm">
                {formatDate(request.updated_at)}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
