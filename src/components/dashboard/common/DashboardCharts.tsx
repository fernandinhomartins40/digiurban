
import React, { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = memo(({ title, description, children, className }: ChartCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-2">{children}</CardContent>
    </Card>
  );
});

ChartCard.displayName = "ChartCard";

interface LineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    stroke?: string;
    name?: string;
  }[];
  xAxisDataKey: string;
  height?: number;
}

export const DashboardLineChart = memo(
  ({ data, lines, xAxisDataKey, height = 300 }: LineChartProps) => {
    return (
      <div style={{ height: height, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={`line-${index}`}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke || CHART_COLORS[index % CHART_COLORS.length]}
                name={line.name || line.dataKey}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

DashboardLineChart.displayName = "DashboardLineChart";

interface BarChartProps {
  data: any[];
  bars: {
    dataKey: string;
    fill?: string;
    name?: string;
  }[];
  xAxisDataKey: string;
  height?: number;
  layout?: "horizontal" | "vertical";
}

export const DashboardBarChart = memo(
  ({ data, bars, xAxisDataKey, height = 300, layout = "horizontal" }: BarChartProps) => {
    return (
      <div style={{ height: height, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={layout}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {layout === "horizontal" ? (
              <>
                <XAxis dataKey={xAxisDataKey} />
                <YAxis />
              </>
            ) : (
              <>
                <XAxis type="number" />
                <YAxis dataKey={xAxisDataKey} type="category" width={150} tick={{ fontSize: 12 }} />
              </>
            )}
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey={bar.dataKey}
                fill={bar.fill || CHART_COLORS[index % CHART_COLORS.length]}
                name={bar.name || bar.dataKey}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

DashboardBarChart.displayName = "DashboardBarChart";

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
  labelFormatter?: (name: string, value: number, percent: number) => string;
}

export const DashboardPieChart = memo(
  ({ data, dataKey, nameKey, colors = CHART_COLORS, height = 300, labelFormatter }: PieChartProps) => {
    return (
      <div style={{ height: height, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={
                labelFormatter
                  ? ({ name, value, percent }) => labelFormatter(name, value, percent)
                  : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

DashboardPieChart.displayName = "DashboardPieChart";
