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
import { PlusCircle, Search, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMenus } from "@/services/education/menus";
import { SchoolMenu } from "@/types/education";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import { MenuDetailDialog } from "./dialogs/MenuDetailDialog";
import { MenuDialog } from "./dialogs/MenuDialog";

export default function MenusTab() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<SchoolMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<SchoolMenu | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [page, pageSize, searchQuery]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const result = await getMenus({
        page: page,
        pageSize: pageSize,
        search: searchQuery,
      });
      setMenus(result.data);
      setTotalCount(result.count);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleViewDetails = (menu: SchoolMenu) => {
    setSelectedMenu(menu);
    setDetailDialogOpen(true);
  };

  const handleCreateMenu = () => {
    setCreateDialogOpen(true);
  };

  const handleEditMenu = (menu: SchoolMenu) => {
    setSelectedMenu(menu);
    setCreateDialogOpen(true);
  };

  const handleMenuSaved = () => {
    setCreateDialogOpen(false);
    fetchMenus();
  };

  const handleMenuUpdated = () => {
    setDetailDialogOpen(false);
    fetchMenus();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Buscar cardápio..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button onClick={handleCreateMenu}>
          <PlusCircle className="mr-2 h-4 w-4" /> Criar Cardápio
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Carregando cardápios...
                </TableCell>
              </TableRow>
            ) : menus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Nenhum cardápio encontrado.
                </TableCell>
              </TableRow>
            ) : (
              menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{menu.schoolName}</TableCell>
                  <TableCell>{format(new Date(menu.createdAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(menu)}>
                        <Eye className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditMenu(menu)}>
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    </div>
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
      
      <MenuDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        menu={selectedMenu}
      />
      <MenuDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSaved={handleMenuSaved}
        menu={selectedMenu}
      />
    </div>
  );
}
