
import React, { useState, useEffect } from "react";
import { Plus, Edit, Search, FilterX, Trash2 } from "lucide-react";
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
import { getVehicles } from "@/services/education/transport";
import { Vehicle } from "@/types/education";
import { useToast } from "@/hooks/use-toast";
import { PaginationComponent } from "@/components/educacao/PaginationComponent";
import VehicleDialog from "./VehicleDialog";

export default function VehiclesTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Filters
  const [plateFilter, setPlateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | "all">("all");
  
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const result = await getVehicles();
      let filteredVehicles = [...result];
      
      // Apply filters
      if (plateFilter) {
        filteredVehicles = filteredVehicles.filter(v => 
          v.plate.toLowerCase().includes(plateFilter.toLowerCase())
        );
      }
      
      if (typeFilter) {
        filteredVehicles = filteredVehicles.filter(v => 
          v.type.toLowerCase().includes(typeFilter.toLowerCase())
        );
      }
      
      if (isActiveFilter !== "all") {
        filteredVehicles = filteredVehicles.filter(v => 
          v.isActive === isActiveFilter
        );
      }
      
      setVehicles(filteredVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os veículos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleApplyFilters = () => {
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setPlateFilter("");
    setTypeFilter("");
    setIsActiveFilter("all");
    fetchVehicles();
  };

  const handleVehicleCreated = () => {
    fetchVehicles();
    setDialogOpen(false);
    toast({
      title: "Sucesso",
      description: "Veículo cadastrado com sucesso",
    });
  };

  const handleVehicleUpdated = () => {
    fetchVehicles();
    setDialogOpen(false);
    setEditingVehicle(null);
    toast({
      title: "Sucesso",
      description: "Veículo atualizado com sucesso",
    });
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Veículos do Transporte Escolar</h2>
        <Button onClick={() => {
          setEditingVehicle(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
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
              <label className="text-sm font-medium">Placa</label>
              <Input 
                placeholder="Placa do veículo" 
                value={plateFilter}
                onChange={(e) => setPlateFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Input 
                placeholder="Tipo do veículo" 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
      ) : vehicles.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.driverName}</TableCell>
                  <TableCell>{vehicle.driverContact}</TableCell>
                  <TableCell>
                    {vehicle.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(vehicle)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="mt-2 text-lg font-medium">Nenhum veículo encontrado</h3>
          <p className="mt-1 text-muted-foreground">
            Não encontramos veículos com os critérios especificados.
          </p>
        </div>
      )}
      
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={editingVehicle}
        onCreated={handleVehicleCreated}
        onUpdated={handleVehicleUpdated}
      />
    </div>
  );
}
