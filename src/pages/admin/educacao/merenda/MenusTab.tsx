
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
import { getMealMenus } from "@/services/education/meals";
import { MealMenu, MealShift } from "@/types/education";
import { getSchools } from "@/services/education/schools";
import { School } from "@/types/education";
import MenuDialog from "./dialogs/MenuDialog";
import PaginationComponent from "@/components/educacao/PaginationComponent";

export default function MenusTab() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<MealMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<MealMenu | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shift, setShift] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Load schools when component mounts
  useEffect(() => {
    fetchSchools();
  }, []);

  // Load menus when school selection changes
  useEffect(() => {
    if (selectedSchool) {
      fetchMenus(selectedSchool);
    } else {
      setMenus([]);
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

  const fetchMenus = async (schoolId: string) => {
    setLoading(true);
    try {
      // Create filters object
      const filters: Record<string, any> = {};
      
      if (shift) {
        filters.shift = shift as MealShift;
      }

      const result = await getMealMenus(schoolId, filters);
      
      // Filter results by search term if provided
      let filteredMenus = result;
      if (searchTerm) {
        filteredMenus = result.filter(menu => 
          menu.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setMenus(filteredMenus);
      setTotalItems(filteredMenus.length);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cardápios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = () => {
    setEditMenu(null);
    setDialogOpen(true);
  };

  const handleEditMenu = (menu: MealMenu) => {
    setEditMenu(menu);
    setDialogOpen(true);
  };

  const handleMenuSaved = () => {
    setDialogOpen(false);
    if (selectedSchool) {
      fetchMenus(selectedSchool);
    }
  };

  const handleSearch = () => {
    if (selectedSchool) {
      fetchMenus(selectedSchool);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Format shift for display
  const formatShift = (shift: MealShift): string => {
    const shifts = {
      morning: "Manhã",
      afternoon: "Tarde",
      evening: "Noite",
      all: "Todo o Dia"
    };
    return shifts[shift] || shift;
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

          <div className="w-full md:w-48">
            <Label htmlFor="shift">Turno</Label>
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger id="shift">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="morning">Manhã</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
                <SelectItem value="evening">Noite</SelectItem>
                <SelectItem value="all">Todo o Dia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-64">
            <Label htmlFor="search">Buscar</Label>
            <div className="flex gap-2">
              <Input 
                id="search" 
                placeholder="Buscar cardápio..."
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
            onClick={handleCreateMenu} 
            disabled={!selectedSchool}
            className="ml-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Cardápio
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Dia da Semana</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dieta Especial</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando cardápios...
                </TableCell>
              </TableRow>
            ) : menus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  {selectedSchool 
                    ? "Nenhum cardápio encontrado para esta escola." 
                    : "Selecione uma escola para visualizar os cardápios."
                  }
                </TableCell>
              </TableRow>
            ) : (
              menus
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{formatShift(menu.shift)}</TableCell>
                  <TableCell>
                    {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][menu.dayOfWeek]}
                  </TableCell>
                  <TableCell>
                    {menu.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {menu.isSpecialDiet ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Sim
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Não
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => handleEditMenu(menu)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {menus.length > 0 && (
        <PaginationComponent 
          currentPage={page} 
          totalItems={totalItems} 
          pageSize={itemsPerPage} 
          onPageChange={setPage}
        />
      )}

      <MenuDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        school={schools.find(s => s.id === selectedSchool)}
        menu={editMenu}
        onSaved={handleMenuSaved}
      />
    </div>
  );
}
