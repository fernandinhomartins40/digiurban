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
import { MenuFeedback } from "@/types/education";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import { FeedbackDetailDialog } from "./dialogs/FeedbackDetailDialog";

export default function FeedbackTab() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<MenuFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<MenuFeedback | null>(null);
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

  const handleViewDetails = (feedback: MenuFeedback) => {
    setSelectedFeedback(feedback);
    setDetailDialogOpen(true);
  };

  const handleDeleteFeedback = async (id: string) => {
    // Implement delete logic here
    console.log("Delete feedback with ID:", id);
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
                  <TableCell>{feedback.userId}</TableCell>
                  <TableCell>{feedback.comment}</TableCell>
                  <TableCell>
                    <Badge>{feedback.rating}</Badge>
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
