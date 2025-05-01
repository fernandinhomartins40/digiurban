
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PolicyList } from '@/components/gabinete/politicas/PolicyList';
import { PolicyFilter, PolicyTabs } from '@/components/gabinete/politicas/PolicyFilter';
import { NewPolicyDialog } from '@/components/gabinete/politicas/NewPolicyDialog';
import { getPublicPolicies } from '@/services/mayorOffice/policiesService';
import { PolicyStatus } from '@/types/mayorOffice';

export default function PublicPoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PolicyStatus | 'all'>('all');

  // Fetch policies data
  const { data: policies, isLoading } = useQuery({
    queryKey: ['publicPolicies', selectedStatus],
    queryFn: () => getPublicPolicies(selectedStatus !== 'all' ? selectedStatus : undefined),
  });

  // Handle status change
  const handleStatusChange = (status: PolicyStatus | 'all') => {
    setSelectedStatus(status);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Helmet>
        <title>Políticas Públicas | Gabinete</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Políticas Públicas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e monitore as políticas públicas municipais
          </p>
        </div>
        <NewPolicyDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Políticas Públicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PolicyFilter 
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              onStatusChange={handleStatusChange}
              onSearchChange={setSearchQuery}
            />
            
            <PolicyTabs 
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
            
            <div className="mt-6">
              <PolicyList 
                policies={policies}
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
