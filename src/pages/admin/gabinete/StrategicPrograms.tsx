
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ProgramStatus, Program } from "@/types/mayorOffice";
import { getStrategicPrograms } from "@/services/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";
import { ProgramFilter } from "@/components/gabinete/programas/ProgramFilter";
import { ProgramList } from "@/components/gabinete/programas/ProgramList";
import { NewProgramDrawer } from "@/components/gabinete/programas/NewProgramDrawer";
import { ProgramDrawer } from "@/components/gabinete/programas/ProgramDrawer";

export default function StrategicPrograms() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<ProgramStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch strategic programs
  const { data: programs, isLoading } = useQuery({
    queryKey: ["strategicPrograms", selectedStatus],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      return getStrategicPrograms(status);
    },
  });
  
  // Handle program click
  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Programas Estratégicos | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Programas Estratégicos</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de programas de desenvolvimento e projetos estratégicos do município.
          </p>
        </div>

        <NewProgramDrawer />
      </div>

      <Card>
        <CardHeader>
          <ProgramFilter
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchQuery}
          />
        </CardHeader>

        <CardContent>
          <ProgramList 
            programs={programs} 
            isLoading={isLoading} 
            searchQuery={searchQuery}
            onProgramClick={handleProgramClick}
          />
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {programs?.length || 0} programas estratégicos
          </div>
        </CardFooter>
      </Card>
      
      {/* Program Drawer */}
      <ProgramDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        program={selectedProgram}
      />
    </div>
  );
}
