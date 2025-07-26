
import React from "react";
import { PurchaseRequestStatus } from "@/services/administration/purchase";
import { getStatusIcon, getStatusBadge } from "../utils/statusUtils";

interface StatusBadgeProps {
  status: PurchaseRequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      {getStatusIcon(status)}
      {getStatusBadge(status)}
    </div>
  );
}
