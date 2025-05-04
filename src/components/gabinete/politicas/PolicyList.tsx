
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Policy, PolicyStatus } from "@/types/mayorOffice";
import { PolicyCard } from "./PolicyCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileBarChart,
  Users,
} from "lucide-react";

interface PolicyListProps {
  policies: Policy[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onPolicyClick?: (policy: Policy) => void;
}

export function PolicyList({ policies, isLoading, searchQuery, onPolicyClick }: PolicyListProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return date || "N/A";
    }
  };

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
