
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { fetchServices } from '@/services/administration/hr/services';
import { fetchAttendances } from '@/services/administration/hr/attendances';
import { HRService } from '@/types/hr';

export default function RHDashboard() {
  const [services, setServices] = useState<HRService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalServices: 0,
    servicesByCategory: [] as Array<{ name: string; value: number }>,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const servicesResponse = await fetchServices();
        if (servicesResponse.data) {
          setServices(servicesResponse.data);
          
          // Calculate stats
          const activeServices = servicesResponse.data.filter(s => s.is_active).length;
          
          // Group services by category
          const categoryCount = servicesResponse.data.reduce((acc, service) => {
            acc[service.category] = (acc[service.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          // Convert to chart format
          const servicesByCategory = Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value
          }));
          
          setStats({
            activeServices,
            totalServices: servicesResponse.data.length,
            servicesByCategory,
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard RH</h1>
        <p className="text-muted-foreground">
          Visão geral do módulo de recursos humanos
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Serviços cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeServices}</div>
            <p className="text-xs text-muted-foreground">
              Serviços disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices - stats.activeServices}</div>
            <p className="text-xs text-muted-foreground">
              Serviços desativados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Serviços por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80 w-full">
            {stats.servicesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.servicesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.servicesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                {isLoading ? "Carregando..." : "Nenhum dado disponível"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
