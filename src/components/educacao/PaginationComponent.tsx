
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));
  const goToLastPage = () => onPageChange(totalPages);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Total de {totalCount} registros
      </div>
      
      <div className="flex items-center space-x-6">
        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Itens por página</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Página {currentPage} de {totalPages || 1}
          </span>
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={goToLastPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
