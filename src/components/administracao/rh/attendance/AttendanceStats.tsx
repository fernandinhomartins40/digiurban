
import React from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import { fetchAttendanceStats } from "@/services/administration/hr/attendances";
import { 
  CheckCircle, Clock, XCircle, Users 
} from "lucide-react";

export default function AttendanceStats() {
  const { data: stats, isLoading } = useApiQuery(
    ["hr-attendance-stats"], 
    () => fetchAttendanceStats(),
    { enabled: true }
  );

  const defaultStats = {
    total: 0,
    inProgress: 0,
    concluded: 0,
    cancelled: 0
  };

  const attendanceStats = stats || defaultStats;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="h-4 bg-muted/50 rounded-md w-1/2"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted/50 rounded-md w-1/4 mb-2"></div>
              <div className="h-4 bg-muted/50 rounded-md w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Todos os atendimentos registrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{attendanceStats.inProgress}</div>
          <p className="text-xs text-muted-foreground">
            Atendimentos que ainda estão em processo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{attendanceStats.concluded}</div>
          <p className="text-xs text-muted-foreground">
            Atendimentos finalizados com sucesso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{attendanceStats.cancelled}</div>
          <p className="text-xs text-muted-foreground">
            Atendimentos que foram cancelados
          </p>
        </CardContent>
      </Card>

      {/* You can add more stats cards or charts here */}
    </div>
  );
}
