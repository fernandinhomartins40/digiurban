
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { HRAttendanceFilterStatus } from "@/types/hr";
import { HRService } from "@/types/hr";

interface AttendanceFilterProps {
  onFilter: (filters: {
    employeeName?: string;
    serviceId?: string;
    status?: HRAttendanceFilterStatus;
    startDate?: Date;
    endDate?: Date;
  }) => void;
  onReset: () => void;
  services: HRService[];
  isLoading: boolean;
}

export const AttendanceFilter = ({
  onFilter,
  onReset,
  services,
  isLoading,
}: AttendanceFilterProps) => {
  const [employeeName, setEmployeeName] = React.useState("");
  const [serviceId, setServiceId] = React.useState<string>("all");
  const [status, setStatus] = React.useState<HRAttendanceFilterStatus>("all");
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  const handleFilter = () => {
    const filters: any = {};
    if (employeeName) filters.employeeName = employeeName;
    if (serviceId && serviceId !== "all") filters.serviceId = serviceId;
    if (status && status !== "all") filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    onFilter(filters);
  };

  const handleReset = () => {
    setEmployeeName("");
    setServiceId("all");
    setStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    onReset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Nome do Servidor
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome"
                className="pl-8"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Serviço</label>
            <Select
              value={serviceId}
              onValueChange={setServiceId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                {services && services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={status} onValueChange={(value) => setStatus(value as HRAttendanceFilterStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="concluded">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Limpar
        </Button>
        <Button onClick={handleFilter} disabled={isLoading}>
          <Search className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AttendanceFilter;
