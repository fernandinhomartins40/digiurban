
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import OccurrencesList from "./OccurrencesList";
import OccurrenceDialog from "./dialogs/OccurrenceDialog";
import OccurrenceDetailDialog from "./dialogs/OccurrenceDetailDialog";
import { getOccurrences } from "@/services/education/occurrences";
import { Occurrence, OccurrencesRequestParams } from "@/types/education";
import { useToast } from "@/hooks/use-toast";

export default function OcorrenciasIndex() {
  const { toast } = useToast();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [filters, setFilters] = useState<OccurrencesRequestParams>({});
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOccurrences(filters);
  }, [currentPage]);

  const fetchOccurrences = async (params: OccurrencesRequestParams = {}) => {
    setLoading(true);
    try {
      const result = await getOccurrences({
        ...params,
        page: currentPage,
        pageSize: 10
      });
      setOccurrences(result.data);
      setTotalItems(result.count);
    } catch (error) {
      console.error("Error fetching occurrences:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ocorrências",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: OccurrencesRequestParams) => {
    setCurrentPage(1);
    setFilters(params);
    fetchOccurrences(params);
  };

  const handleOpenCreateDialog = () => {
    setSelectedOccurrence(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
    setDialogOpen(true);
  };

  const handleOpenDetailDialog = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
    setDetailDialogOpen(true);
  };

  const handleOccurrenceSaved = () => {
    setDialogOpen(false);
    fetchOccurrences(filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Ocorrências Escolares</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Ocorrências</CardTitle>
        </CardHeader>
        <CardContent>
          <OccurrencesList
            occurrences={occurrences}
            loading={loading}
            onSearch={handleSearch}
            onCreateOccurrence={handleOpenCreateDialog}
            onEditOccurrence={handleOpenEditDialog}
            onViewOccurrence={handleOpenDetailDialog}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <OccurrenceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        occurrence={selectedOccurrence}
        onSaved={handleOccurrenceSaved}
      />

      <OccurrenceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        occurrenceId={selectedOccurrence?.id}
      />
    </div>
  );
}
