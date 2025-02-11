"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", sales: 4, revenue: 2.0 },
  { name: "Feb", sales: 3, revenue: 1.5 },
  { name: "Mar", sales: 7, revenue: 3.5 },
  { name: "Apr", sales: 5, revenue: 2.5 },
  { name: "May", sales: 9, revenue: 4.5 },
  { name: "Jun", sales: 8, revenue: 4.0 },
]

export function AnalyticsTab() {
  const chartData = useMemo(() => data, [])

  // Memoize chart configurations
  const chartConfig = useMemo(() => ({
    xAxis: {
      dataKey: "name",
      height: 60,
      tick: { fill: 'currentColor' },
      tickLine: { stroke: 'currentColor' },
      axisLine: { stroke: 'currentColor' }
    },
    yAxis: {
      width: 60,
      tick: { fill: 'currentColor' },
      tickLine: { stroke: 'currentColor' },
      axisLine: { stroke: 'currentColor' },
      tickFormatter: (value: number) => `${value}`
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderRadius: 'var(--radius)',
        color: 'hsl(var(--foreground))'
      }
    },
    line: {
      strokeWidth: 2,
      activeDot: { r: 6 },
      dot: { strokeWidth: 2 }
    }
  }), [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Sales</h3>
          <p className="text-2xl font-bold">36</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">18.0 SOL</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Products</h3>
          <p className="text-2xl font-bold">2</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              
              <XAxis {...chartConfig.xAxis} />
              
              <YAxis 
                {...chartConfig.yAxis}
                yAxisId="left"
              />
              
              <YAxis 
                {...chartConfig.yAxis}
                yAxisId="right"
                orientation="right"
              />
              
              <Tooltip {...chartConfig.tooltip} />
              
              <Line 
                {...chartConfig.line}
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
              />
              
              <Line 
                {...chartConfig.line}
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}