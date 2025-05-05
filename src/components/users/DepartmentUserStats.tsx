
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DepartmentData {
  name: string;
  count: number;
}

interface DepartmentUserStatsProps {
  departmentData: DepartmentData[];
}

export function DepartmentUserStats({ departmentData }: DepartmentUserStatsProps) {
  // Sort departments by user count
  const sortedData = [...departmentData].sort((a, b) => b.count - a.count);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribuição de Usuários por Departamento</CardTitle>
        <CardDescription>
          Total de usuários administrativos por departamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category"
                width={150} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip
                formatter={(value) => [`${value} usuários`, "Quantidade"]}
                labelFormatter={(label) => `Departamento: ${label}`}
              />
              <Bar dataKey="count" fill="#6366f1" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
