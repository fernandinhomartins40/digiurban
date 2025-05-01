
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getFeedbackById, deleteFeedback } from "@/services/education/feedback";
import { MealFeedback } from "@/types/education";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FeedbackDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: MealFeedback | null;
}

export function FeedbackDetailDialog({
  open,
  onOpenChange,
  feedback,
}: FeedbackDetailDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case "satisfactory":
        return { text: "Satisfatório", class: "bg-green-100 text-green-800" };
      case "insufficient":
        return { text: "Insuficiente", class: "bg-yellow-100 text-yellow-800" };
      case "problems":
        return { text: "Problemas", class: "bg-red-100 text-red-800" };
      default:
        return { text: rating, class: "bg-gray-100 text-gray-800" };
    }
  };

  const handleDelete = async () => {
    if (!feedback) return;
    
    setLoading(true);
    try {
      await deleteFeedback(feedback.id);
      toast({
        title: "Sucesso",
        description: "Feedback excluído com sucesso",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setConfirmDeleteOpen(false);
    }
  };

  if (!feedback) {
    return null;
  }

  const ratingInfo = getRatingLabel(feedback.rating);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Feedback</DialogTitle>
            <DialogDescription>
              Feedback de merenda escolar enviado por {feedback.parentName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge className={ratingInfo.class}>
                {ratingInfo.text}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(feedback.feedbackDate), "dd/MM/yyyy HH:mm")}
              </span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Responsável:</span>
                  <span>{feedback.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Aluno:</span>
                  <span>{feedback.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Escola:</span>
                  <span>{feedback.schoolId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Turma:</span>
                  <span>{feedback.classId}</span>
                </div>
              </CardContent>
            </Card>

            {feedback.comments && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comentários</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feedback.comments}</p>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={loading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir Feedback
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este feedback? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
