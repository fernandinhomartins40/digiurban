
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UnifiedRequest } from "@/types/requests";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";

interface RequestCommentsProps {
  request: UnifiedRequest;
  onAddComment?: (id: string, comment: string, isInternal?: boolean) => Promise<boolean>;
}

export function RequestComments({ request, onAddComment }: RequestCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !onAddComment) return;
    
    setIsSubmitting(true);
    try {
      const success = await onAddComment(request.id, newComment, isInternal);
      if (success) {
        setNewComment("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    try {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  return (
    <div className="py-4 space-y-4">
      <h3 className="font-medium text-lg mb-2">Comentários</h3>
      
      {request.comments && request.comments.length > 0 ? (
        <div className="space-y-4">
          {request.comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-3 bg-muted/30">
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm">
                  {comment.authorName || 
                   (comment.authorType === 'citizen' ? 'Cidadão' : 
                    comment.authorType === 'department' ? 'Departamento' : 'Gabinete')}
                  {comment.isInternal && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5">
                      Interno
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{comment.commentText}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum comentário adicionado ainda.</p>
        </div>
      )}
      
      <Separator />
      
      {onAddComment && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Adicionar Comentário</h4>
          <Textarea
            placeholder="Digite seu comentário aqui..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="internal"
                checked={isInternal}
                onCheckedChange={(checked) => setIsInternal(!!checked)}
              />
              <label
                htmlFor="internal"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Comentário interno (apenas para departamentos)
              </label>
            </div>
            
            <Button
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              onClick={handleSubmitComment}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
