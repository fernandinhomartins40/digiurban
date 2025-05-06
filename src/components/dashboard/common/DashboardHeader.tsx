
import React from "react";
import { CalendarIcon, ChevronDown, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Sector {
  value: string;
  label: string;
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (range: string) => void;
  onDateRangeSelect?: (range: DateRange | undefined) => void;
  sectors?: Sector[];
  selectedSector?: string;
  onSectorChange?: (value: string) => void;
  rightContent?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  dateRange = "30d",
  startDate,
  endDate,
  onDateRangeChange,
  onDateRangeSelect,
  sectors = [],
  selectedSector,
  onSectorChange,
  rightContent,
}: DashboardHeaderProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    startDate && endDate
      ? {
          from: startDate,
          to: endDate,
        }
      : undefined
  );

  React.useEffect(() => {
    if (startDate && endDate) {
      setDate({
        from: startDate,
        to: endDate,
      });
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (value: string) => {
    if (onDateRangeChange) {
      onDateRangeChange(value);
    }
  };

  return (
    <div className="pb-6">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-2 md:mt-0">
          {sectors.length > 0 && onSectorChange && (
            <Select
              value={selectedSector}
              onValueChange={onSectorChange}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por setor" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {onDateRangeChange && (
            <Select
              value={dateRange}
              onValueChange={handleDateRangeChange}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Selecione o período" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          )}

          {dateRange === "custom" && onDateRangeSelect && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "P", { locale: ptBR })} -{" "}
                        {format(date.to, "P", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "P", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    onDateRangeSelect(newDate);
                  }}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          )}

          {rightContent && <div className="ml-2">{rightContent}</div>}
        </div>
      </div>
    </div>
  );
}
