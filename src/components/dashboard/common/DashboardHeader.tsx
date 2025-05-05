
import React from "react";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  dateRange: "7d" | "30d" | "90d" | "custom";
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (range: "7d" | "30d" | "90d" | "custom") => void;
  onDateRangeSelect?: (range: { from?: Date; to?: Date }) => void;
  sectors?: { value: string; label: string }[];
  selectedSector?: string;
  onSectorChange?: (sector: string) => void;
  showDownload?: boolean;
  onDownload?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  dateRange,
  startDate,
  endDate,
  onDateRangeChange,
  onDateRangeSelect,
  sectors,
  selectedSector,
  onSectorChange,
  showDownload = true,
  onDownload,
  rightContent,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {sectors && sectors.length > 0 && onSectorChange && (
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os setores</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <Tabs
            value={dateRange}
            onValueChange={(value) => onDateRangeChange(value as "7d" | "30d" | "90d" | "custom")}
            className="w-fit"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="custom">
                <CalendarIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {dateRange === "custom" && onDateRangeSelect && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto justify-start text-left font-normal">
                  {startDate && endDate ? (
                    <>
                      {format(startDate, "P", { locale: ptBR })} -{" "}
                      {format(endDate, "P", { locale: ptBR })}
                    </>
                  ) : (
                    <span>Escolha um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate,
                    to: endDate,
                  }}
                  onSelect={onDateRangeSelect}
                  defaultMonth={startDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          {showDownload && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDownload || (() => {})}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {rightContent && (
          <div className="ml-2">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
