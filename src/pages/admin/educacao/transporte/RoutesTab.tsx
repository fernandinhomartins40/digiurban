
import React, { useState, useEffect } from "react";
import { Plus, Edit, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTransportRoutes } from "@/services/education/transport";
import { TransportRoute } from "@/types/education";
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import RouteDialog from "./RouteDialog";

export default function RoutesTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | "all">("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const filters: any = {
        name: nameFilter || undefined,
        origin: originFilter || undefined,
      };
      
      if (isActiveFilter !== "all") {
        filters.isActive = isActiveFilter;
      }
      
      const result = await getTransportRoutes(filters);
      
      setRoutes(result);
      setTotalCount(result.length);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as rotas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [page, pageSize]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchRoutes();
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setOriginFilter("");
    setIsActiveFilter("all");
    setPage(1);
    fetchRoutes();
  };

  const handleRouteCreated = () => {
    fetchRoutes();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Rota criada com sucesso",
    });
  };

  const handleRouteUpdated = () => {
    fetchRoutes();
    setDialogOpen(false);
    setEditingRoute(null);
    toast({
      title: "Sucesso",
      description: "Rota atualizada com sucesso",
    });
  };

  const openEditDialog = (route: TransportRoute) => {
    setEditingRoute(route);
    setDialogOpen(true);
  };
  
  // Calculate paginated routes
  const paginatedRoutes = routes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Rotas de Transporte Escolar</h2>
        <Button onClick={() => {
          setEditingRoute(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Rota
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Nome da Rota</label>
              <Input 
                placeholder="Nome da rota" 
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Origem</label>
              <Input 
                placeholder="Local de origem" 
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={isActiveFilter} 
                onValueChange={(value: boolean | "all") => {
                  setIsActiveFilter(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={true}>Ativo</SelectItem>
                  <SelectItem value={false}>Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : paginatedRoutes.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Horário Saída</TableHead>
                  <TableHead>Horário Retorno</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.departureTime}</TableCell>
                    <TableCell>{route.returnTime}</TableCell>
                    <TableCell>{route.maxCapacity}</TableCell>
                    <TableCell>{route.currentStudents}</TableCell>
                    <TableCell>
                      {route.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(route)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <PaginationComponent
              currentPage={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h3 className="mt-2 text-lg font-medium">Nenhuma rota encontrada</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos rotas com os critérios especificados.
          </p>
        </div>
      )}
      
      <RouteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        route={editingRoute}
        onCreated={handleRouteCreated}
        onUpdated={handleRouteUpdated}
      />
    </div>
  );
}
