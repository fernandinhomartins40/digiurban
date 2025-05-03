
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus } from "lucide-react";
import { SearchFilters } from './components/SearchFilters';
import { BenefitsGrid } from './components/BenefitsGrid';
import { BenefitFormDialog } from './components/BenefitFormDialog';
import { BenefitDetailDialog } from './components/BenefitDetailDialog';
import { useBenefits } from './hooks/useBenefits';

export default function BeneficiosPage() {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedBenefit,
    showBenefitForm,
    setShowBenefitForm,
    showBenefitDetail,
    setShowBenefitDetail,
    isLoading,
    filteredBenefits,
    typeOptions,
    handleViewBenefit,
    handleAddBenefit,
    refetchBenefits
  } = useBenefits();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Benefícios Emergenciais</h2>
          <p className="text-muted-foreground">
            Gerencie a distribuição de benefícios sociais emergenciais.
          </p>
        </div>
        <Button onClick={handleAddBenefit} className="flex items-center gap-2">
          <PackagePlus className="h-4 w-4" />
          <span>Novo Benefício</span>
        </Button>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        typeOptions={typeOptions}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <BenefitsGrid 
            benefits={filteredBenefits}
            isLoading={isLoading}
            onBenefitClick={handleViewBenefit}
          />
        </TabsContent>
      </Tabs>

      <BenefitFormDialog 
        open={showBenefitForm} 
        onOpenChange={setShowBenefitForm}
      />

      <BenefitDetailDialog 
        open={showBenefitDetail} 
        onOpenChange={setShowBenefitDetail}
        benefit={selectedBenefit}
        onStatusUpdate={refetchBenefits}
      />
    </div>
  );
}
