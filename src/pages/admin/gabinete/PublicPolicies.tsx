
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
import { PolicyStatus, Policy } from "@/types/mayorOffice";
import { getPublicPolicies } from "@/services/mayorOffice";
import { useAuth } from "@/contexts/AuthContext";
import { PolicyFilter, PolicyTabs } from "@/components/gabinete/politicas/PolicyFilter";
import { PolicyList } from "@/components/gabinete/politicas/PolicyList";
import { NewPolicyDialog } from "@/components/gabinete/politicas/NewPolicyDialog";
import { PolicyDrawer } from "@/components/gabinete/politicas/PolicyDrawer";

export default function PublicPolicies() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<PolicyStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch public policies
  const { data: policies, isLoading } = useQuery({
    queryKey: ["publicPolicies", selectedStatus],
    queryFn: () => {
      const status = selectedStatus !== "all" ? selectedStatus : undefined;
      return getPublicPolicies(status);
    },
  });
  
  // Handle policy click
  const handlePolicyClick = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Políticas Públicas | Gabinete do Prefeito</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Políticas Públicas</h1>
          <p className="text-sm text-muted-foreground">
            Ferramenta para criação e acompanhamento de metas de políticas públicas.
          </p>
        </div>

        <NewPolicyDialog />
      </div>

      <Card>
        <CardHeader>
          <PolicyFilter
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchQuery}
          />
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <PolicyTabs 
              selectedStatus={selectedStatus} 
              onStatusChange={setSelectedStatus} 
            />
          </div>

          <div className="mt-6">
            <PolicyList 
              policies={policies} 
              isLoading={isLoading} 
              searchQuery={searchQuery}
              onPolicyClick={handlePolicyClick}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {policies?.length || 0} políticas públicas
          </div>
        </CardFooter>
      </Card>
      
      {/* Policy Drawer */}
      <PolicyDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        policy={selectedPolicy}
      />
    </div>
  );
}
