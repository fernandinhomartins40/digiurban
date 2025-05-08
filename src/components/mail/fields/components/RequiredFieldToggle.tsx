
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RequiredFieldToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RequiredFieldToggle({ checked, onChange }: RequiredFieldToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="is_required"
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor="is_required">Campo obrigatório</Label>
    </div>
  );
}
