
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AssistanceCenter, SocialAttendance } from "@/types/assistance";
import { getAssistanceCenters, getSocialAttendances } from "@/services/assistance";
import CentersTable from "@/components/assistencia/cras/CentersTable";
import CenterDialog from "@/components/assistencia/cras/CenterDialog";
import AttendancesTable from "@/components/assistencia/cras/AttendancesTable";

export default function CrasCreasPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("centers");

  // Centers state
  const [centers, setCenters] = useState<AssistanceCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<AssistanceCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState<boolean>(true);
  const [centerSearchTerm, setCenterSearchTerm] = useState<string>("");
  const [centerTypeFilter, setCenterTypeFilter] = useState<string>("all");
  
  // Attendances state
  const [attendances, setAttendances] = useState<SocialAttendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<SocialAttendance[]>([]);
  const [loadingAttendances, setLoadingAttendances] = useState<boolean>(true);
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState<string>("");
  const [attendanceTypeFilter, setAttendanceTypeFilter] = useState<string>("all");
  const [centerIdFilter, setCenterIdFilter] = useState<string>("all");

  // Dialog states
  const [isNewCenterDialogOpen, setIsNewCenterDialogOpen] = useState<boolean>(false);
  const [isEditCenterDialogOpen, setIsEditCenterDialogOpen] = useState<boolean>(false);
  const [isViewCenterDialogOpen, setIsViewCenterDialogOpen] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<AssistanceCenter | null>(null);
  
  const [isNewAttendanceDialogOpen, setIsNewAttendanceDialogOpen] = useState<boolean>(false);
  const [isEditAttendanceDialogOpen, setIsEditAttendanceDialogOpen] = useState<boolean>(false);
  const [isViewAttendanceDialogOpen, setIsViewAttendanceDialogOpen] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] = useState<SocialAttendance | null>(null);

  useEffect(() => {
    fetchCenters();
    fetchAttendances();
  }, []);

  useEffect(() => {
    applyFiltersForCenters();
  }, [centers, centerSearchTerm, centerTypeFilter]);

  useEffect(() => {
    applyFiltersForAttendances();
  }, [attendances, attendanceSearchTerm, attendanceTypeFilter, centerIdFilter]);

  const fetchCenters = async () => {
    setLoadingCenters(true);
    try {
      const data = await getAssistanceCenters();
      setCenters(data);
      setFilteredCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os centros de assistência",
        variant: "destructive",
      });
    } finally {
      setLoadingCenters(false);
    }
  };

  const fetchAttendances = async () => {
    setLoadingAttendances(true);
    try {
      const data = await getSocialAttendances();
      setAttendances(data);
      setFilteredAttendances(data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atendimentos",
        variant: "destructive",
      });
    } finally {
      setLoadingAttendances(false);
    }
  };

  const applyFiltersForCenters = () => {
    let result = [...centers];
    
    // Apply search term filter
    if (centerSearchTerm) {
      const searchLower = centerSearchTerm.toLowerCase();
      result = result.filter(center => 
        center.name.toLowerCase().includes(searchLower) ||
        center.address.toLowerCase().includes(searchLower) ||
        center.neighborhood.toLowerCase().includes(searchLower) ||
        center.city.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (centerTypeFilter !== "all") {
      result = result.filter(center => center.type === centerTypeFilter);
    }
    
    setFilteredCenters(result);
  };

  const applyFiltersForAttendances = () => {
    let result = [...attendances];
    
    // Apply search term filter
    if (attendanceSearchTerm) {
      const searchLower = attendanceSearchTerm.toLowerCase();
      result = result.filter(attendance => 
        attendance.protocol_number.toLowerCase().includes(searchLower) ||
        attendance.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (attendanceTypeFilter !== "all") {
      result = result.filter(attendance => attendance.attendance_type === attendanceTypeFilter);
    }
    
    // Apply center filter
    if (centerIdFilter !== "all") {
      result = result.filter(attendance => attendance.center_id === centerIdFilter);
    }
    
    setFilteredAttendances(result);
  };

  const handleNewCenter = () => {
    setSelectedCenter(null);
    setIsNewCenterDialogOpen(true);
  };

  const handleEditCenter = (center: AssistanceCenter) => {
    setSelectedCenter(center);
    setIsEditCenterDialogOpen(true);
  };

  const handleViewCenter = (center: AssistanceCenter) => {
    setSelectedCenter(center);
    setIsViewCenterDialogOpen(true);
  };

  const handleNewAttendance = () => {
    setSelectedAttendance(null);
    setIsNewAttendanceDialogOpen(true);
  };

  const handleEditAttendance = (attendance: SocialAttendance) => {
    setSelectedAttendance(attendance);
    setIsEditAttendanceDialogOpen(true);
  };

  const handleViewAttendance = (attendance: SocialAttendance) => {
    setSelectedAttendance(attendance);
    setIsViewAttendanceDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>CRAS/CREAS | Assistência Social</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            CRAS/CREAS
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerenciar centros de assistência social e atendimentos
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === "centers" ? (
            <Button onClick={handleNewCenter}>
              <Plus className="mr-2 h-4 w-4" /> Novo Centro
            </Button>
          ) : (
            <Button onClick={handleNewAttendance}>
              <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
            </Button>
          )}
        </div>
      </div>

      <Tabs 
        defaultValue="centers" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="centers">Unidades CRAS/CREAS</TabsTrigger>
          <TabsTrigger value="attendances">Atendimentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="centers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Centros de Assistência Social</CardTitle>
              <CardDescription>
                Lista de unidades CRAS e CREAS cadastradas
              </CardDescription>
            </CardHeader>

            <div className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="center-search">Buscar</Label>
                  <Input
                    id="center-search"
                    placeholder="Buscar por nome, endereço..."
                    value={centerSearchTerm}
                    onChange={(e) => setCenterSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="center-type">Tipo</Label>
                  <Select
                    value={centerTypeFilter}
                    onValueChange={setCenterTypeFilter}
                  >
                    <SelectTrigger id="center-type">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="CRAS">CRAS</SelectItem>
                      <SelectItem value="CREAS">CREAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCenterSearchTerm("");
                      setCenterTypeFilter("all");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>

            <CardContent>
              <CentersTable
                centers={filteredCenters}
                loading={loadingCenters}
                onView={handleViewCenter}
                onEdit={handleEditCenter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos</CardTitle>
              <CardDescription>
                Registro de atendimentos realizados nos centros de assistência
              </CardDescription>
            </CardHeader>

            <div className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="attendance-search">Buscar</Label>
                  <Input
                    id="attendance-search"
                    placeholder="Buscar por protocolo..."
                    value={attendanceSearchTerm}
                    onChange={(e) => setAttendanceSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="attendance-type">Tipo</Label>
                  <Select
                    value={attendanceTypeFilter}
                    onValueChange={setAttendanceTypeFilter}
                  >
                    <SelectTrigger id="attendance-type">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="reception">Acolhida</SelectItem>
                      <SelectItem value="qualified_listening">Escuta Qualificada</SelectItem>
                      <SelectItem value="referral">Encaminhamento</SelectItem>
                      <SelectItem value="guidance">Orientação</SelectItem>
                      <SelectItem value="follow_up">Acompanhamento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="center-filter">Centro</Label>
                  <Select
                    value={centerIdFilter}
                    onValueChange={setCenterIdFilter}
                  >
                    <SelectTrigger id="center-filter">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {centers.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setAttendanceSearchTerm("");
                      setAttendanceTypeFilter("all");
                      setCenterIdFilter("all");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>

            <CardContent>
              <AttendancesTable
                attendances={filteredAttendances}
                loading={loadingAttendances}
                onView={handleViewAttendance}
                onEdit={handleEditAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Center Dialogs */}
      <CenterDialog
        isOpen={isNewCenterDialogOpen}
        onClose={() => setIsNewCenterDialogOpen(false)}
        onSuccess={fetchCenters}
      />

      <CenterDialog
        isOpen={isEditCenterDialogOpen}
        onClose={() => setIsEditCenterDialogOpen(false)}
        center={selectedCenter || undefined}
        onSuccess={fetchCenters}
      />

      {/* Add more dialogs as needed */}
    </div>
  );
}
