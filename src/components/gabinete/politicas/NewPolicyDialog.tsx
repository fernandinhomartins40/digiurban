
import React from "react";
import { NewPolicyDrawer } from "./NewPolicyDrawer";

interface NewPolicyDialogProps {
  onSuccess?: () => void;
}

export function NewPolicyDialog({ onSuccess }: NewPolicyDialogProps) {
  return <NewPolicyDrawer onSuccess={onSuccess} />;
}
