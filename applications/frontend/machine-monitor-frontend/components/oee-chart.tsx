"use client"

import { Card } from "@/components/ui/card"
import { useMachineStore } from "@/lib/store"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const chartConfig = {
  oee: {
    label: "OEE",
    color: "hsl(var(--chart-1))",
  },
  performance: {
    label: "Performance",
    color: "hsl(var(--chart-2))",
  },
  availability: {
    label: "Availability",
    color: "hsl(var(--chart-4))",
  },
}

interface OEEChartProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function OEEChart({ isCollapsed, onToggle }: OEEChartProps) {
  const { machines } = useMachineStore()

  const chartData = useMemo(() => {
    if (machines.length === 0) return []

    const periods = ["6h ago", "5h ago", "4h ago", "3h ago", "2h ago", "1h ago", "Now"]

    return periods.map((time, index) => {
      const variance = (Math.random() - 0.5) * 10
      const trend = (index / periods.length) * 5

      const avgOEE = machines.reduce((sum, m) => sum + (m.metrics?.oee || 0), 0) / machines.length
      const avgPerf = machines.reduce((sum, m) => sum + (m.metrics?.performance || 0), 0) / machines.length
      const avgAvail = machines.reduce((sum, m) => sum + (m.metrics?.availability || 0), 0) / machines.length

      return {
        time,
        oee: Math.max(0, Math.min(100, avgOEE + variance + trend)),
        performance: Math.max(0, Math.min(100, avgPerf + variance * 0.8 + trend)),
        availability: Math.max(0, Math.min(100, avgAvail + variance * 0.6 + trend)),
      }
    })
  }, [machines])

  const latestOEE = chartData.length > 0 ? chartData[chartData.length - 1].oee : 0
  const previousOEE = chartData.length > 1 ? chartData[chartData.length - 2].oee : 0
  const oeeTrend = latestOEE - previousOEE

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Eficiência ao Longo do Tempo</h3>
            <p className="text-xs text-muted-foreground">Últimas 6 horas de desempenho</p>
          </div>
          <div className="flex items-center gap-2">
            {machines.length > 0 && chartData.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold" suppressHydrationWarning>
                  {latestOEE.toFixed(1)}%
                </p>
                <p className={`text-xs ${oeeTrend >= 0 ? "text-chart-1" : "text-chart-2"}`} suppressHydrationWarning>
                  {oeeTrend >= 0 ? "↑" : "↓"} {Math.abs(oeeTrend).toFixed(1)}%
                </p>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {machines.length === 0 || chartData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
                  <p className="text-xs text-muted-foreground">Aguardando dados de máquinas</p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillOEE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-oee)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-oee)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="fillPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-performance)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-performance)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="fillAvailability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-availability)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-availability)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    type="monotone"
                    dataKey="availability"
                    stroke="var(--color-availability)"
                    fill="url(#fillAvailability)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="var(--color-performance)"
                    fill="url(#fillPerformance)"
                    strokeWidth={2}
                  />
                  <Area type="monotone" dataKey="oee" stroke="var(--color-oee)" fill="url(#fillOEE)" strokeWidth={2} />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
