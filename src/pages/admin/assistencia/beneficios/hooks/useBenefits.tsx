
import { useState, useEffect } from "react";

export type Benefit = {
  id: string;
  beneficiaryName: string;
  beneficiaryCpf: string;
  category: string;
  value: number;
  startDate: string;
  endDate: string | null;
  status: string;
  lastUpdate: string;
};

export type EmergencyBenefit = Benefit;

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchBenefits = () => {
      setIsLoading(true);
      
      // Mock data
      const mockBenefits: Benefit[] = [
        {
          id: "BNF-001",
          beneficiaryName: "Maria da Silva",
          beneficiaryCpf: "123.456.789-01",
          category: "Bolsa Família",
          value: 600,
          startDate: "2023-01-15",
          endDate: null,
          status: "Aprovado",
          lastUpdate: "2023-04-10"
        },
        {
          id: "BNF-002",
          beneficiaryName: "João Santos",
          beneficiaryCpf: "987.654.321-09",
          category: "Auxílio Moradia",
          value: 350,
          startDate: "2023-02-01",
          endDate: "2023-08-01",
          status: "Aprovado",
          lastUpdate: "2023-03-15"
        },
        {
          id: "BNF-003",
          beneficiaryName: "Ana Pereira",
          beneficiaryCpf: "456.789.123-45",
          category: "Cesta Básica",
          value: 120,
          startDate: "2023-03-10",
          endDate: null,
          status: "Pendente",
          lastUpdate: "2023-03-10"
        },
        {
          id: "BNF-004",
          beneficiaryName: "Carlos Ferreira",
          beneficiaryCpf: "789.123.456-78",
          category: "BPC",
          value: 1212,
          startDate: "2022-11-20",
          endDate: null,
          status: "Aprovado",
          lastUpdate: "2023-02-22"
        },
        {
          id: "BNF-005",
          beneficiaryName: "Luiza Oliveira",
          beneficiaryCpf: "321.654.987-32",
          category: "Auxílio Emergencial",
          value: 600,
          startDate: "2023-01-05",
          endDate: "2023-07-05",
          status: "Inativo",
          lastUpdate: "2023-04-05"
        },
        {
          id: "BNF-006",
          beneficiaryName: "Roberto Almeida",
          beneficiaryCpf: "654.321.987-65",
          category: "Bolsa Família",
          value: 600,
          startDate: "2023-02-15",
          endDate: null,
          status: "Rejeitado",
          lastUpdate: "2023-02-28"
        }
      ];

      setTimeout(() => {
        setBenefits(mockBenefits);
        setIsLoading(false);
      }, 1000);
    };

    fetchBenefits();
  }, []);

  return { benefits, isLoading, error };
}
