
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createMealFeedback } from "@/services/education/meals";
import { MealRating, School } from "@/types/education";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school?: School;
  onSaved: () => void;
}

export default function FeedbackDialog({
  open,
  onOpenChange,
  school,
  onSaved,
}: FeedbackDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rating, setRating] = useState<MealRating>("satisfactory");
  const [comments, setComments] = useState("");
  const [feedbackDate, setFeedbackDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setParentName("");
    setStudentName("");
    setRating("satisfactory");
    setComments("");
    setFeedbackDate(new Date());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!school) {
      toast({
        title: "Erro",
        description: "Nenhuma escola selecionada",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedbackDate) {
      toast({
        title: "Erro",
        description: "Informe a data do feedback",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        schoolId: school.id,
        parentName,
        studentName,
        rating,
        comments,
        feedbackDate: feedbackDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      };

      await createMealFeedback(feedbackData);
      toast({
        title: "Feedback registrado",
        description: "O feedback foi registrado com sucesso",
      });
      
      onSaved();
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Feedback da Merenda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Escola</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {school?.name || "Nenhuma escola selecionada"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentName">Nome do Responsável*</Label>
            <Input
              id="parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentName">Nome do Aluno*</Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Avaliação da Merenda*</Label>
            <Select value={rating} onValueChange={(value) => setRating(value as MealRating)} required>
              <SelectTrigger id="rating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satisfactory">Satisfatória</SelectItem>
                <SelectItem value="insufficient">Insuficiente</SelectItem>
                <SelectItem value="problems">Com Problemas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedbackDate">Data do Feedback*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !feedbackDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {feedbackDate ? format(feedbackDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={feedbackDate}
                  onSelect={setFeedbackDate}
                  initialFocus
                  disabled={(date) => date > new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comentários</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Comentários sobre a merenda escolar"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Enviar Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
