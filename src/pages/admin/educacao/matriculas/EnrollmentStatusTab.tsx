
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getEnrollmentStatsByStatus } from "@/services/education/enrollment";
import { getSchools } from "@/services/education/schools";
import { School, EnrollmentStatus } from "@/types/education";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Loader2 } from "lucide-react";

export default function EnrollmentStatusTab() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<EnrollmentStatus, number>>({
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlist: 0,
    transferred: 0,
    cancelled: 0
  });

  // Define constants for the current school year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStats(selectedSchoolId || undefined);
  }, [selectedSchoolId]);

  const fetchSchools = async () => {
    try {
      const result = await getSchools();
      setSchools(result.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de escolas",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async (schoolId?: string) => {
    setLoading(true);
    try {
      const result = await getEnrollmentStatsByStatus(currentYear, schoolId);
      setStats(result);
    } catch (error) {
      console.error("Error fetching enrollment stats:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas de matrículas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatStatusName = (status: EnrollmentStatus): string => {
    const statusNames = {
      pending: "Pendente",
      approved: "Aprovada",
      rejected: "Rejeitada",
      waitlist: "Lista de Espera",
      transferred: "Transferida",
      cancelled: "Cancelada"
    };
    return statusNames[status] || status;
  };

  // Prepare data for charts
  const pieData = Object.entries(stats).map(([status, count]) => ({
    name: formatStatusName(status as EnrollmentStatus),
    value: count,
    status
  }));

  const barData = Object.entries(stats).map(([status, count]) => ({
    name: formatStatusName(status as EnrollmentStatus),
    count
  }));

  // Colors for the charts
  const COLORS = {
    pending: '#FFB74D',   // Orange
    approved: '#66BB6A',  // Green
    rejected: '#EF5350',  // Red
    waitlist: '#42A5F5',  // Blue
    transferred: '#7E57C2', // Purple
    cancelled: '#9E9E9E'  // Grey
  };

  const colorArray = Object.values(COLORS);

  return (
    <div className="space-y-6">
      <div className="space-y-2 max-w-md">
        <Label htmlFor="school">Escola</Label>
        <Select
          value={selectedSchoolId || ""}
          onValueChange={(value) => setSelectedSchoolId(value || null)}
        >
          <SelectTrigger id="school">
            <SelectValue placeholder="Todas as Escolas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as Escolas</SelectItem>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: COLORS[status as keyof typeof COLORS] + '20', color: COLORS[status as keyof typeof COLORS] }}
                >
                  {count}
                </div>
                <CardTitle className="text-center">{formatStatusName(status as EnrollmentStatus)}</CardTitle>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <CardTitle className="mb-6 text-center">Distribuição por Status</CardTitle>
          <div className="h-80">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.status as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} matrículas`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="mb-6 text-center">Quantidade por Status</CardTitle>
          <div className="h-80">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} matrículas`, '']} />
                  <Bar dataKey="count">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorArray[index % colorArray.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Dados do ano letivo: {currentYear}</p>
        <p>
          {selectedSchoolId 
            ? `Estatísticas para a escola selecionada.` 
            : `Estatísticas para todas as escolas.`
          }
        </p>
      </div>
    </div>
  );
}
