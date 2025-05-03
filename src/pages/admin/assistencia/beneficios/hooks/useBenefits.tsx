
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { fetchBenefits, updateBenefitStatus, fetchBenefitById } from '@/services/assistance';
import { EmergencyBenefit } from '@/types/assistance';

export function useBenefits() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [showBenefitForm, setShowBenefitForm] = useState<boolean>(false);
  const [showBenefitDetail, setShowBenefitDetail] = useState<boolean>(false);
  
  // Fetch all benefits
  const { data: benefits = [], isLoading: isBenefitsLoading, refetch: refetchBenefits } = useQuery({
    queryKey: ['emergency-benefits'],
    queryFn: fetchBenefits,
  });
  
  // Fetch selected benefit details
  const { data: selectedBenefit, isLoading: isSelectedBenefitLoading } = useQuery({
    queryKey: ['emergency-benefit', selectedBenefitId],
    queryFn: () => selectedBenefitId ? fetchBenefitById(selectedBenefitId) : null,
    enabled: !!selectedBenefitId,
  });
  
  // Filter benefits
  const filteredBenefits = benefits.filter(benefit => {
    // Filter by tab (status)
    if (activeTab !== 'all' && benefit.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !(
      benefit.protocol_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.benefit_type?.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filter by benefit type
    if (filterType && benefit.benefit_type !== filterType) {
      return false;
    }
    
    return true;
  });
  
  // Get unique benefit types for filter options
  const typeOptions = benefits ? Array.from(new Set(benefits.map(benefit => benefit.benefit_type))) : [];

  // Handle update benefit status
  const handleUpdateStatus = useCallback(async (
    benefitId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'delivering' | 'completed', 
    comments?: string
  ) => {
    try {
      await updateBenefitStatus(benefitId, status, comments);
      toast({
        title: "Sucesso",
        description: "Status do benefício atualizado com sucesso.",
      });
      
      // Refresh benefits
      refetchBenefits();
      
      // Close detail dialog
      setShowBenefitDetail(false);
    } catch (error) {
      console.error("Error updating benefit status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do benefício.",
        variant: "destructive",
      });
    }
  }, [refetchBenefits, toast]);

  // Handle benefit actions
  const handleViewBenefit = useCallback((benefit: EmergencyBenefit) => {
    setSelectedBenefitId(benefit.id);
    setShowBenefitDetail(true);
  }, []);

  const handleAddBenefit = useCallback(() => {
    setSelectedBenefitId(null);
    setShowBenefitForm(true);
  }, []);

  const isLoading = isBenefitsLoading || isSelectedBenefitLoading;

  return {
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
    benefits,
    isLoading,
    filteredBenefits,
    typeOptions,
    handleUpdateStatus,
    handleViewBenefit,
    handleAddBenefit,
    refetchBenefits
  };
}
