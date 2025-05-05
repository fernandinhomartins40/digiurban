
import { useMemo } from "react";
import { AdminUser } from "@/types/auth";

export function useDepartmentStatistics(users: AdminUser[]) {
  // Department statistics
  const departmentStats = useMemo(() => {
    const deptMap: Record<string, number> = {};
    
    users.forEach(user => {
      if (user.department) {
        deptMap[user.department] = (deptMap[user.department] || 0) + 1;
      }
    });
    
    return Object.entries(deptMap).map(([department, userCount]) => ({
      department,
      userCount,
    }));
  }, [users]);

  // Get unique departments for the filter dropdown
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    
    users.forEach(user => {
      if (user.department) {
        deptSet.add(user.department);
      }
    });
    
    return Array.from(deptSet);
  }, [users]);

  // Chart data
  const departmentChartData = useMemo(() => {
    return departmentStats.map(stat => ({
      name: stat.department,
      count: stat.userCount
    }));
  }, [departmentStats]);

  return {
    departmentStats,
    departments,
    departmentChartData
  };
}
