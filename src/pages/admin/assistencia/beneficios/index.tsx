
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "./components/SearchFilters";
import { BenefitsGrid } from "./components/BenefitsGrid";
import { useBenefits } from "./hooks/useBenefits";
import { Plus } from "lucide-react";
import { BenefitFormDialog } from "./components/BenefitFormDialog";

export default function BeneficiosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todos");

  const { benefits, isLoading, error } = useBenefits();

  // Filter benefits based on search term and filters
  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      searchTerm === "" ||
      benefit.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.beneficiaryCpf.includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || benefit.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === "todos" || benefit.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benefícios Sociais</h1>
          <p className="text-muted-foreground">
            Gerencie os benefícios concedidos aos cidadãos
          </p>
        </div>
        <Button className="gap-1" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Novo Benefício</span>
        </Button>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <BenefitsGrid benefits={filteredBenefits} isLoading={isLoading} />

      <BenefitFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
