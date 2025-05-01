
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequestList } from '@/components/gabinete/solicitacoes/RequestList';
import { RequestFilter } from '@/components/gabinete/solicitacoes/RequestFilter';
import { NewRequestDialog } from '@/components/gabinete/solicitacoes/NewRequestDialog';
import { getDirectRequests, updateDirectRequest } from '@/services/mayorOffice/requestsService';
import { DirectRequest, RequestStatus } from '@/types/mayorOffice';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function DirectRequests() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Fetch requests data
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['directRequests', selectedStatus],
    queryFn: () => getDirectRequests(
      selectedStatus !== 'all' ? selectedStatus : undefined, 
      selectedDepartment !== 'all' ? selectedDepartment : undefined
    ),
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: RequestStatus }) => {
      return await updateDirectRequest(requestId, { status });
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação.",
        variant: "destructive",
      });
    },
  });

  // Handle request status change
  const handleStatusChange = async (requestId: string, status: RequestStatus) => {
    updateStatusMutation.mutate({ requestId, status });
  };

  // Handle request creation
  const handleCreateRequest = async (formData: any) => {
    toast({
      title: "Solicitação criada",
      description: "A solicitação foi criada com sucesso.",
    });
    
    setIsDialogOpen(false);
    refetch();
  };

  // Extract unique departments from requests
  const departments = requests
    ? [...new Set(requests.map((request) => request.targetDepartment))]
    : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Solicitações Diretas | Gabinete</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Solicitações Diretas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as solicitações encaminhadas para o gabinete do prefeito
          </p>
        </div>
        <NewRequestDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          departments={departments}
          onSubmit={handleCreateRequest}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Todas as Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
          />

          <div className="mt-6">
            <RequestList 
              requests={requests}
              isLoading={isLoading}
              searchQuery={searchQuery}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
