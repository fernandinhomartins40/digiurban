
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgramList } from '@/components/gabinete/programas/ProgramList';
import { ProgramFilter, ProgramTabs } from '@/components/gabinete/programas/ProgramFilter';
import { NewProgramDialog } from '@/components/gabinete/programas/NewProgramDialog';
import { getStrategicPrograms } from '@/services/mayorOffice/programsService';
import { ProgramStatus } from '@/types/mayorOffice';

export default function StrategicProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProgramStatus | 'all'>('all');

  // Fetch programs data
  const { data: programs, isLoading } = useQuery({
    queryKey: ['strategicPrograms', selectedStatus],
    queryFn: () => getStrategicPrograms(selectedStatus !== 'all' ? selectedStatus : undefined),
  });

  // Handle status change
  const handleStatusChange = (status: ProgramStatus | 'all') => {
    setSelectedStatus(status);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Programas Estratégicos | Gabinete</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Programas Estratégicos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os programas prioritários e projetos especiais da administração
          </p>
        </div>
        <NewProgramDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programas Estratégicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgramFilter 
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onStatusChange={handleStatusChange}
              onSearchChange={setSearchQuery}
            />
            
            <ProgramTabs 
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
            
            <div className="mt-6">
              <ProgramList 
                programs={programs}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
