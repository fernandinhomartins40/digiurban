
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMealFeedbacks } from "@/services/education/meals";
import { MealFeedback, MealRating } from "@/types/education";
import { getSchools } from "@/services/education/schools";
import { School } from "@/types/education";
import FeedbackDialog from "./dialogs/FeedbackDialog";
import { format } from "date-fns";
import PaginationComponent from "@/components/educacao/PaginationComponent";

export default function FeedbackTab() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<MealFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Load schools when component mounts
  useEffect(() => {
    fetchSchools();
  }, []);

  // Load feedbacks when school selection changes
  useEffect(() => {
    if (selectedSchool) {
      fetchFeedbacks(selectedSchool);
    } else {
      setFeedbacks([]);
    }
  }, [selectedSchool, page]);

  const fetchSchools = async () => {
    try {
      const result = await getSchools();
      setSchools(result.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de escolas",
        variant: "destructive",
      });
    }
  };

  const fetchFeedbacks = async (schoolId: string) => {
    setLoading(true);
    try {
      const result = await getMealFeedbacks(schoolId);
      
      // Filter by search term if provided
      let filtered = result;
      if (searchTerm) {
        filtered = result.filter(feedback => 
          feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.parentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.feedbackDate).getTime() - new Date(a.feedbackDate).getTime());
      
      setFeedbacks(filtered);
      setTotalItems(filtered.length);
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

  const handleCreateFeedback = () => {
    setDialogOpen(true);
  };

  const handleFeedbackSaved = () => {
    setDialogOpen(false);
    if (selectedSchool) {
      fetchFeedbacks(selectedSchool);
    }
  };

  const handleSearch = () => {
    if (selectedSchool) {
      fetchFeedbacks(selectedSchool);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Format rating for display
  const formatRating = (rating: MealRating): string => {
    const ratings = {
      satisfactory: "Satisfatório",
      insufficient: "Insuficiente",
      problems: "Problemas"
    };
    return ratings[rating] || rating;
  };

  // Get badge variant based on rating
  const getRatingBadgeVariant = (rating: MealRating) => {
    switch (rating) {
      case 'satisfactory':
        return "bg-green-50 text-green-700 border-green-200";
      case 'insufficient':
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'problems':
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Label htmlFor="school">Escola</Label>
            <Select
              value={selectedSchool}
              onValueChange={setSelectedSchool}
            >
              <SelectTrigger id="school">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Label htmlFor="search">Buscar</Label>
            <div className="flex gap-2">
              <Input 
                id="search" 
                placeholder="Nome do aluno ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <Button 
            onClick={handleCreateFeedback} 
            disabled={!selectedSchool}
            className="ml-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Feedback
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Comentários</TableHead>
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
                  {selectedSchool 
                    ? "Nenhum feedback encontrado para esta escola." 
                    : "Selecione uma escola para visualizar os feedbacks."
                  }
                </TableCell>
              </TableRow>
            ) : (
              feedbacks
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{format(new Date(feedback.feedbackDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{feedback.studentName}</TableCell>
                  <TableCell>{feedback.parentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRatingBadgeVariant(feedback.rating)}>
                      {formatRating(feedback.rating)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {feedback.comments ? (
                      <span className="line-clamp-1">{feedback.comments}</span>
                    ) : (
                      <span className="text-gray-400">Sem comentários</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {feedbacks.length > 0 && (
        <PaginationComponent 
          currentPage={page} 
          totalItems={totalItems} 
          pageSize={itemsPerPage} 
          onPageChange={setPage}
        />
      )}

      <FeedbackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        school={schools.find(s => s.id === selectedSchool)}
        onSaved={handleFeedbackSaved}
      />
    </div>
  );
}
