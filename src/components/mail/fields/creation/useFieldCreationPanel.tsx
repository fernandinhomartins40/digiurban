
import { useState, useCallback } from 'react';
import { TemplateField } from '@/types/mail';
import { useToast } from '@/hooks/use-toast';

interface UseFieldCreationPanelProps {
  onAddField: (field: Partial<TemplateField>) => void;
  onUpdateField: (index: number, field: Partial<TemplateField>) => void;
  onRemoveField: (index: number) => void;
}

export function useFieldCreationPanel({
  onAddField,
  onUpdateField,
  onRemoveField
}: UseFieldCreationPanelProps) {
  const [activeTab, setActiveTab] = useState("fields");
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleEditField = useCallback((index: number) => {
    setEditingFieldIndex(index);
    setActiveTab("edit");
  }, []);
  
  const handleSaveField = useCallback((field: Partial<TemplateField>) => {
    if (editingFieldIndex !== null) {
      onUpdateField(editingFieldIndex, field);
      setEditingFieldIndex(null);
      setActiveTab("fields");
    }
  }, [editingFieldIndex, onUpdateField]);
  
  const handleCancelEdit = useCallback(() => {
    setEditingFieldIndex(null);
    setActiveTab("fields");
  }, []);
  
  const handleCreateField = useCallback((field: Partial<TemplateField>) => {
    onAddField(field);
    setActiveTab("fields");
  }, [onAddField]);

  return {
    activeTab,
    setActiveTab,
    editingFieldIndex,
    handleEditField,
    handleSaveField,
    handleCancelEdit,
    handleCreateField
  };
}
