
export type HRService = {
  id: string;
  name: string;
  description: string | null;
  form_schema: {
    fields: {
      name: string;
      type: string;
      label: string;
      required: boolean;
    }[];
  };
  category: string;
  is_active: boolean;
  requires_approval: boolean;
  approval_flow: any | null;
  available_for: string[];
  created_at: string;
  updated_at: string;
};

export type ServiceFormData = Omit<HRService, 'id' | 'created_at' | 'updated_at'>;
export type ServiceCategory = 'Tempo' | 'Licenças' | 'Aposentadoria' | 'Transferências' | 'Outros';
