"use client"

import { Card } from "@/components/ui/card"
import { useMachineStore } from "@/lib/store"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const chartConfig = {
  efficiency: {
    label: "Eficiência",
    color: "hsl(var(--chart-1))",
  },
  performance: {
    label: "Desempenho",
    color: "hsl(var(--chart-2))",
  },
  quality: {
    label: "Qualidade",
    color: "hsl(var(--chart-3))",
  },
  availability: {
    label: "Disponibilidade",
    color: "hsl(var(--chart-4))",
  },
}

interface EquipmentMetricsProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function EquipmentMetrics({ isCollapsed, onToggle }: EquipmentMetricsProps) {
  const { machines } = useMachineStore()

  // Calculate average metrics across all machines
  const avgMetrics =
    machines.length > 0
      ? {
          oee: machines.reduce((sum, m) => sum + (m.metrics?.oee || 0), 0) / machines.length,
          performance: machines.reduce((sum, m) => sum + (m.metrics?.performance || 0), 0) / machines.length,
          quality: machines.reduce((sum, m) => sum + (m.metrics?.quality || 0), 0) / machines.length,
          availability: machines.reduce((sum, m) => sum + (m.metrics?.availability || 0), 0) / machines.length,
        }
      : { oee: 0, performance: 0, quality: 0, availability: 0 }

  const chartData = [
    {
      metric: "Eficiência",
      value: avgMetrics.oee,
      fill: "var(--color-efficiency)",
    },
    {
      metric: "Desempenho",
      value: avgMetrics.performance,
      fill: "var(--color-performance)",
    },
    {
      metric: "Qualidade",
      value: avgMetrics.quality,
      fill: "var(--color-quality)",
    },
    {
      metric: "Disponibilidade",
      value: avgMetrics.availability,
      fill: "var(--color-availability)",
    },
  ]

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Métricas de Equipamentos</h3>
            <p className="text-xs text-muted-foreground">Indicadores médios de desempenho</p>
          </div>
          <div className="flex items-center gap-2">
            {machines.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-chart-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">{avgMetrics.oee.toFixed(1)}%</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {machines.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Nenhuma máquina cadastrada</p>
                  <p className="text-xs text-muted-foreground">Clique em "Sincronizar API" para carregar dados</p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ChartContainer>
            )}

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-chart-1" />
                  <span className="text-[10px] text-muted-foreground">Efic.</span>
                </div>
                <p className="text-sm font-bold">{avgMetrics.oee.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-chart-2" />
                  <span className="text-[10px] text-muted-foreground">Desemp.</span>
                </div>
                <p className="text-sm font-bold">{avgMetrics.performance.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-chart-3" />
                  <span className="text-[10px] text-muted-foreground">Qualid.</span>
                </div>
                <p className="text-sm font-bold">{avgMetrics.quality.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-chart-4" />
                  <span className="text-[10px] text-muted-foreground">Dispon.</span>
                </div>
                <p className="text-sm font-bold">{avgMetrics.availability.toFixed(1)}%</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
