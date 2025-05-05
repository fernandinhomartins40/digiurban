
import { useState } from "react";

export interface UserFilterValues {
  searchTerm: string;
  department: string | null;
  role: string | null;
  status: string | null;
}

export function useUserFilters() {
  const [filters, setFilters] = useState<UserFilterValues>({
    searchTerm: "",
    department: null,
    role: null,
    status: null,
  });

  return { filters, setFilters };
}
