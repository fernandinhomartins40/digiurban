
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth/useAuth";
import { isAdminUser } from "@/types/auth";
import {
  fetchUserPurchaseRequests,
  fetchDepartmentPurchaseRequests,
  fetchAllPurchaseRequests,
  updatePurchaseStatus,
  type PurchaseRequest,
  type PurchaseRequestStatus
} from "@/services/administration/purchase";

export function usePurchaseRequests() {
  const { user } = useAuth();
  const isAdmin = user ? isAdminUser(user) && (user.department === "Compras" || user.role === "prefeito") : false;
  
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [departmentRequests, setDepartmentRequests] = useState<PurchaseRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<PurchaseRequestStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user's department if available
  useEffect(() => {
    if (user && isAdminUser(user) && user.department) {
      setDepartmentFilter(user.department);
    }
  }, [user]);

  // Load purchase requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        let userReqs: PurchaseRequest[] = [];
        let deptReqs: PurchaseRequest[] = [];
        
        // Fetch requests based on user permissions
        if (isAdmin) {
          // Admin sees all requests
          const allRequests = await fetchAllPurchaseRequests(
            statusFilter !== "all" ? statusFilter : undefined,
            departmentFilter !== "all" ? departmentFilter : undefined
          );
          userReqs = allRequests;
          deptReqs = allRequests;
        } else if (isAdminUser(user) && user.department) {
          // Department user sees their department's requests
          userReqs = await fetchUserPurchaseRequests(user.id);
          deptReqs = await fetchDepartmentPurchaseRequests(user.department);
        } else {
          // Regular user only sees their requests
          userReqs = await fetchUserPurchaseRequests(user.id);
          deptReqs = [];
        }
        
        setRequests(userReqs);
        setDepartmentRequests(deptReqs);
      } catch (error) {
        console.error("Error loading purchase requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user, isAdmin, statusFilter, departmentFilter]);

  // Handler for updating request status
  const handleUpdateStatus = async (requestId: string, status: PurchaseRequestStatus, comments?: string) => {
    if (!user) return;
    
    try {
      const updatedRequest = await updatePurchaseStatus(requestId, status, comments || null, user.id);
      if (updatedRequest) {
        // Update request lists
        setRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
        setDepartmentRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return {
    requests,
    departmentRequests,
    isLoading,
    isAdmin,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    handleUpdateStatus
  };
}
