
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssistanceCenter, SocialAttendance } from "@/types/assistance";
import {
  getAssistanceCenters,
  getSocialAttendances
} from "@/services/assistance";
import CentersTable from "@/components/assistencia/cras/CentersTable";
import AttendancesTable from "@/components/assistencia/cras/AttendancesTable";
import { CenterDialog } from "@/components/assistencia/cras/CenterDialog";
import { AttendanceDialog } from "@/components/assistencia/cras/AttendanceDialog";

export default function CrasCreasPage() {
  const { toast } = useToast();
  
  const [centers, setCenters] = useState<AssistanceCenter[]>([]);
  const [attendances, setAttendances] = useState<SocialAttendance[]>([]);
  const [loadingCenters, setLoadingCenters] = useState<boolean>(true);
  const [loadingAttendances, setLoadingAttendances] = useState<boolean>(true);
  
  const [selectedTab, setSelectedTab] = useState<string>("centers");
  const [showCenterDialog, setShowCenterDialog] = useState<boolean>(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<AssistanceCenter | null>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<SocialAttendance | null>(null);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedTab === "attendances") {
      fetchAttendances();
    }
  }, [selectedTab]);

  const fetchCenters = async () => {
    setLoadingCenters(true);
    try {
      const response = await getAssistanceCenters();
      setCenters(response || []);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os centros CRAS/CREAS",
        variant: "destructive",
      });
    } finally {
      setLoadingCenters(false);
    }
  };

  const fetchAttendances = async () => {
    setLoadingAttendances(true);
    try {
      const response = await getSocialAttendances();
      setAttendances(response || []);
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

  const handleAddCenter = () => {
    setSelectedCenter(null);
    setShowCenterDialog(true);
  };

  const handleEditCenter = (center: AssistanceCenter) => {
    setSelectedCenter(center);
    setShowCenterDialog(true);
  };

  const handleDeleteCenter = (center: AssistanceCenter) => {
    // Implementation for deleting a center would go here
    console.log("Delete center:", center.id);
    toast({
      title: "Não implementado",
      description: "A função de excluir centros ainda não foi implementada.",
      variant: "default",
    });
  };

  const handleAddAttendance = () => {
    setSelectedAttendance(null);
    setShowAttendanceDialog(true);
  };

  const handleViewAttendance = (attendance: SocialAttendance) => {
    setSelectedAttendance(attendance);
    setShowAttendanceDialog(true);
  };

  const handleEditAttendance = (attendance: SocialAttendance) => {
    // Implementation for editing attendance would go here
    console.log("Edit attendance:", attendance);
    toast({
      title: "Não implementado",
      description: "A função de editar atendimentos ainda não foi implementada.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>CRAS/CREAS | Assistência Social</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            CRAS e CREAS
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os centros de referência e seus atendimentos
          </p>
        </div>

        {selectedTab === "centers" ? (
          <Button onClick={handleAddCenter}>
            <Plus className="mr-2 h-4 w-4" /> Novo Centro
          </Button>
        ) : (
          <Button onClick={handleAddAttendance}>
            <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centros de Referência</CardTitle>
          <CardDescription>
            Unidades CRAS e CREAS e registro de atendimentos
          </CardDescription>
        </CardHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="px-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="centers">Centros</TabsTrigger>
              <TabsTrigger value="attendances">Atendimentos</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="centers" className="space-y-4">
              <CentersTable
                centers={centers}
                loading={loadingCenters}
                onEdit={handleEditCenter}
                onDelete={handleDeleteCenter}
              />
            </TabsContent>

            <TabsContent value="attendances" className="space-y-4">
              <AttendancesTable
                attendances={attendances}
                loading={loadingAttendances}
                onView={handleViewAttendance}
                onEdit={handleEditAttendance}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Center Dialog */}
      <CenterDialog
        center={selectedCenter}
        open={showCenterDialog}
        onClose={() => setShowCenterDialog(false)}
        onSave={fetchCenters}
      />

      {/* Attendance Dialog */}
      <AttendanceDialog 
        attendance={selectedAttendance}
        open={showAttendanceDialog}
        onClose={() => setShowAttendanceDialog(false)}
        onSave={fetchAttendances}
        centers={centers}
      />
    </div>
  );
}
