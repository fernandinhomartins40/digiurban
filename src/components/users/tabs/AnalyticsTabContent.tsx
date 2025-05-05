
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatsCard } from "@/components/users/UserStatsCard";
import { DepartmentUserStats } from "@/components/users/DepartmentUserStats";

interface DepartmentStat {
  department: string;
  userCount: number;
}

interface AnalyticsTabContentProps {
  departmentStats: DepartmentStat[];
  departmentChartData: { name: string; count: number }[];
  totalUsers: number;
}

export function AnalyticsTabContent({ 
  departmentStats, 
  departmentChartData, 
  totalUsers 
}: AnalyticsTabContentProps) {
  return (
    <div className="space-y-6">
      <UserStatsCard
        totalUsers={totalUsers}
        activeUsers={totalUsers} // In a real app, you'd track active users
        departmentStats={departmentStats}
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <DepartmentUserStats 
          departmentData={departmentChartData}
        />
        
        <Card className="col-span-1 lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Estatísticas de Permissões</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Distribuição de permissões por módulos:
            </p>
            
            <div className="space-y-4">
              {[
                { module: "Administração", read: 15, write: 8, delete: 3 },
                { module: "Finanças", read: 12, write: 5, delete: 2 },
                { module: "RH", read: 10, write: 7, delete: 3 },
              ].map((stat) => (
                <div key={stat.module} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{stat.module}</span>
                    <span className="text-muted-foreground">
                      {stat.read} usuários com acesso
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(stat.read / totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
