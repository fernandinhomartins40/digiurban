
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFeedbacks } from "@/services/education/feedback";
import { MealFeedback } from "@/types/education";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import { FeedbackDetailDialog } from "./dialogs/FeedbackDetailDialog";

export default function FeedbackTab() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<MealFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<MealFeedback | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, pageSize, searchQuery]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const result = await getFeedbacks({
        page,
        pageSize,
        search: searchQuery,
      });
      setFeedbacks(result.data);
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os feedbacks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleViewDetails = (feedback: MealFeedback) => {
    setSelectedFeedback(feedback);
    setDetailDialogOpen(true);
  };

  const handleDeleteFeedback = async (id: string) => {
    // Implement delete logic here
    console.log("Delete feedback with ID:", id);
  };
  
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "satisfactory":
        return <Badge className="bg-green-100 text-green-800">Satisfatório</Badge>;
      case "insufficient":
        return <Badge className="bg-yellow-100 text-yellow-800">Insuficiente</Badge>;
      case "problems":
        return <Badge className="bg-red-100 text-red-800">Problemas</Badge>;
      default:
        return <Badge variant="outline">{rating}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Buscar feedbacks..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Comentário</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Carregando feedbacks...
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Nenhum feedback encontrado.
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{format(new Date(feedback.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{feedback.parentName}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.comments || "Sem comentários"}
                  </TableCell>
                  <TableCell>
                    {getRatingBadge(feedback.rating)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(feedback)}>
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteFeedback(feedback.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <PaginationComponent 
        currentPage={page} 
        totalCount={totalCount} 
        pageSize={pageSize} 
        onPageChange={setPage}
      />
      
      <FeedbackDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        feedback={selectedFeedback}
      />
    </div>
  );
}
