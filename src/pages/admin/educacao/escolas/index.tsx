
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, Plus, Search, FilterX } from "lucide-react";
import { getSchools } from "@/services/education/schools";
import { School as SchoolType, SchoolType as SchoolTypeEnum } from "@/types/education";
import { SchoolDialog } from "@/components/educacao/escolas/SchoolDialog";
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";

export default function EscolasIndex() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<SchoolTypeEnum | "">("");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | "">("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const result = await getSchools({
        page,
        pageSize,
        name: nameFilter || undefined,
        type: typeFilter || undefined,
        neighborhood: neighborhoodFilter || undefined,
        isActive: isActiveFilter === "" ? undefined : isActiveFilter,
      });
      
      setSchools(result.data);
      setTotalCount(result.count);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as escolas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [page, pageSize]);

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    fetchSchools();
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setTypeFilter("");
    setNeighborhoodFilter("");
    setIsActiveFilter("");
    setPage(1);
    fetchSchools();
  };

  const handleSchoolCreated = () => {
    fetchSchools();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Escola criada com sucesso",
    });
  };

  const handleSchoolUpdated = () => {
    fetchSchools();
    setDialogOpen(false);
    setEditingSchool(null);
    toast({
      title: "Sucesso",
      description: "Escola atualizada com sucesso",
    });
  };

  const openEditDialog = (school: SchoolType) => {
    setEditingSchool(school);
    setDialogOpen(true);
  };
  
  const getSchoolTypeLabel = (type: string) => {
    switch (type) {
      case 'school': return 'Escola';
      case 'cmei': return 'CMEI';
      case 'eja': return 'EJA';
      default: return type;
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Escolas e CMEIs</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de escolas, CMEIs e outras unidades educacionais
          </p>
        </div>
        <Button onClick={() => {
          setEditingSchool(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Escola
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search size={18} />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input 
                placeholder="Nome da escola" 
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={typeFilter} 
                onValueChange={(value) => setTypeFilter(value as SchoolTypeEnum | "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="school">Escola</SelectItem>
                  <SelectItem value="cmei">CMEI</SelectItem>
                  <SelectItem value="eja">EJA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Bairro</label>
              <Input 
                placeholder="Bairro" 
                value={neighborhoodFilter}
                onChange={(e) => setNeighborhoodFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={String(isActiveFilter)} 
                onValueChange={(value) => {
                  if (value === "") {
                    setIsActiveFilter("");
                  } else {
                    setIsActiveFilter(value === "true");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
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
      ) : schools.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código INEP</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.inepCode}</TableCell>
                    <TableCell>{getSchoolTypeLabel(school.type)}</TableCell>
                    <TableCell>{school.neighborhood}</TableCell>
                    <TableCell>
                      {school.currentStudents}/{school.maxCapacity}
                    </TableCell>
                    <TableCell>
                      {school.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(school)}>
                        Detalhes
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
          <School className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Nenhuma escola encontrada</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos escolas com os critérios especificados.
          </p>
        </div>
      )}
      
      <SchoolDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        school={editingSchool}
        onCreated={handleSchoolCreated}
        onUpdated={handleSchoolUpdated}
      />
    </div>
  );
}
