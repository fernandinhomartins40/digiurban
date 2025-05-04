
import React from "react";
import { Policy } from "@/types/mayorOffice";
import { ProgramCard } from "@/components/gabinete/programas/ProgramCard"; // We'll use this component temporarily 
import { FileBarChart } from "lucide-react";

interface PolicyListProps {
  policies: Policy[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onPolicyClick?: (policy: Policy) => void;
}

// Temporary component to render policies (will be replaced with a dedicated PolicyCard)
interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void; // Added onClick to make it compatible
}

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
  return (
    <div 
      className="border rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-medium text-lg">{policy.name}</h3>
      {policy.description && <p className="text-muted-foreground truncate mt-1">{policy.description}</p>}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">{policy.category}</span>
      </div>
    </div>
  );
}

export function PolicyList({ policies, isLoading, searchQuery, onPolicyClick }: PolicyListProps) {
  // Filter policies by search query
  const filteredPolicies = policies?.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.responsible?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!filteredPolicies || filteredPolicies.length === 0) {
    return (
      <div className="text-center py-8">
        <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
        <h3 className="text-lg font-medium">Nenhuma política encontrada</h3>
        <p className="text-muted-foreground mt-1">
          Não foram encontradas políticas públicas com os critérios de busca informados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPolicies.map((policy) => (
        <PolicyCard 
          key={policy.id} 
          policy={policy} 
          onClick={() => onPolicyClick?.(policy)} 
        />
      ))}
    </div>
  );
}
