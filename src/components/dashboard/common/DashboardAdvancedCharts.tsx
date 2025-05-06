
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = ({ title, description, children, className }: ChartProps) => (
  <Card className={className}>
    <CardHeader className="pb-4">
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="p-0 h-[300px]">
      {children}
    </CardContent>
  </Card>
);

// Comparison Chart - combines bars and lines
interface ComparisonChartProps {
  data: any[];
  bars?: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  lines?: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  xAxisDataKey: string;
  height?: number;
  yAxisWidth?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  gridAxis?: "x" | "y" | "both";
}

export const DashboardComparisonChart = ({
  data,
  bars = [],
  lines = [],
  xAxisDataKey,
  height = 300,
  yAxisWidth = 50,
  gridAxis,
  margin = { top: 5, right: 30, left: 20, bottom: 20 },
}: ComparisonChartProps) => {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center">Sem dados disponíveis</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={margin}>
        <XAxis dataKey={xAxisDataKey} />
        <YAxis width={yAxisWidth} />
        <Tooltip />
        <Legend />
        {bars && bars.map((bar, index) => (
          <Bar
            key={`bar-${index}`}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name}
            barSize={20}
          />
        ))}
        {lines && lines.map((line, index) => (
          <Line
            key={`line-${index}`}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Area Chart - for showing trends over time with filled areas
interface AreaChartProps {
  data: any[];
  areas: Array<{
    dataKey: string;
    fill: string;
    stroke: string;
    name: string;
    yAxis?: "left" | "right";
  }>;
  xAxisDataKey: string;
  stacked?: boolean;
  height?: number;
  yAxisWidth?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  gridAxis?: "x" | "y" | "both";
  leftYAxisLabel?: string;
  rightYAxisLabel?: string;
}

export const DashboardAreaChart = ({
  data,
  areas,
  xAxisDataKey,
  stacked = false,
  height = 300,
  yAxisWidth = 50,
  margin = { top: 5, right: 30, left: 20, bottom: 20 },
  gridAxis,
  leftYAxisLabel,
  rightYAxisLabel,
}: AreaChartProps) => {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center">Sem dados disponíveis</div>;
  }

  // Check if we need a right Y axis
  const needsRightAxis = areas.some(area => area.yAxis === "right");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={margin}>
        <XAxis dataKey={xAxisDataKey} />
        <YAxis 
          width={yAxisWidth} 
          yAxisId="left"
          label={leftYAxisLabel ? { value: leftYAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
        />
        {needsRightAxis && (
          <YAxis 
            width={yAxisWidth} 
            yAxisId="right" 
            orientation="right"
            label={rightYAxisLabel ? { value: rightYAxisLabel, angle: 90, position: 'insideRight' } : undefined}
          />
        )}
        <Tooltip />
        <Legend />
        {areas.map((area, index) => (
          <Area
            key={`area-${index}`}
            type="monotone"
            dataKey={area.dataKey}
            stackId={stacked ? "1" : `stack-${index}`}
            stroke={area.stroke}
            fill={area.fill}
            name={area.name}
            yAxisId={area.yAxis || "left"}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Scatter Plot - for correlation analysis
interface ScatterPlotProps {
  data: any[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  height?: number;
  name?: string;
  fill?: string;
  yAxisWidth?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const DashboardScatterPlot = ({
  data,
  xAxisDataKey,
  yAxisDataKey,
  height = 300,
  name = "Dados",
  fill = "#8884d8",
  yAxisWidth = 50,
  margin = { top: 5, right: 30, left: 20, bottom: 20 },
}: ScatterPlotProps) => {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center">Sem dados disponíveis</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={margin}>
        <XAxis dataKey={xAxisDataKey} type="number" name={xAxisDataKey} />
        <YAxis
          dataKey={yAxisDataKey}
          type="number"
          name={yAxisDataKey}
          width={yAxisWidth}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name={name} data={data} fill={fill} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Advanced Pie Chart - for more customized pie charts with legends and labels
interface AdvancedPieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  colors?: string[];
  donut?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

export const DashboardAdvancedPieChart = ({
  data,
  dataKey,
  nameKey,
  height = 300,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"],
  donut = false,
  innerRadius = 60,
  outerRadius = 90,
  showLabels = true,
}: AdvancedPieChartProps) => {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center">Sem dados disponíveis</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels}
          label={showLabels ? 
            ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : 
            undefined
          }
          innerRadius={donut ? innerRadius : 0}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
