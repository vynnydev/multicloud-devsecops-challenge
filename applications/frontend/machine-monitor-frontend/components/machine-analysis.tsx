"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useMachineStore } from "@/lib/store"
import { Activity, AlertTriangle, Clock, Gauge, Settings, TrendingUp, X, Zap, Wrench } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { useMemo } from "react"

const performanceChartConfig = {
  value: {
    label: "Desempenho",
    color: "hsl(var(--chart-1))",
  },
}

export function MachineAnalysis() {
  const { selectedMachine, machines, zones, selectMachine, sendToMaintenance } = useMachineStore()

  const machine = machines.find((m) => m.id === selectedMachine)

  // Generate performance history data
  const performanceHistory = useMemo(() => {
    if (!machine) return []

    const points = 12
    return Array.from({ length: points }, (_, i) => {
      const variance = (Math.random() - 0.5) * 15
      return {
        time: `${points - i}m`,
        value: Math.max(0, Math.min(100, machine.metrics.performance + variance)),
      }
    })
  }, [machine])

  const handleSendToMaintenance = async () => {
    if (!machine) return

    const success = await sendToMaintenance(machine.id)
    if (success) {
      console.log("[v0] Machine successfully sent to maintenance")
    } else {
      console.error("[v0] Failed to send machine to maintenance")
    }
  }

  if (!machine) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold">Nenhuma Máquina Selecionada</h3>
          <p className="text-sm text-muted-foreground">
            Clique em uma máquina no chão de fábrica para ver análise detalhada
          </p>
        </div>
      </Card>
    )
  }

  const utilization = machine.utilization || { active: 0, idle: 0, downtime: 0 }
  const totalUtilization = utilization.active + utilization.idle + utilization.downtime
  const activePercent = totalUtilization > 0 ? (utilization.active / totalUtilization) * 100 : 0
  const idlePercent = totalUtilization > 0 ? (utilization.idle / totalUtilization) * 100 : 0
  const downtimePercent = totalUtilization > 0 ? (utilization.downtime / totalUtilization) * 100 : 0

  const statusColor =
    {
      working: "text-chart-1 bg-chart-1/10 border-chart-1/30",
      idle: "text-chart-3 bg-chart-3/10 border-chart-3/30",
      repair: "text-chart-2 bg-chart-2/10 border-chart-2/30",
      offline: "text-muted-foreground bg-muted/30 border-muted-foreground/30",
    }[machine.status] || "text-muted-foreground bg-muted/30"

  const machineZone = zones.find((z) => z.id === machine.zoneId)

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      working: "Operando",
      idle: "Parada",
      repair: "Em Manutenção",
      offline: "Offline",
    }
    return labels[status] || status
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{machine.name}</h2>
            <Badge className={statusColor} variant="outline">
              {getStatusLabel(machine.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{machine.type}</p>
          <p className="text-xs text-muted-foreground">
            {machine.corridor ? `Corredor: ${machine.corridor}` : `Zona: ${machineZone?.name || "Desconhecida"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {machine.status !== "repair" && (
            <Button variant="outline" size="sm" onClick={handleSendToMaintenance} className="gap-2 bg-transparent">
              <Wrench className="h-4 w-4" />
              Enviar para Manutenção
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => selectMachine(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>Eficiência Geral do Equipamento</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{machine.metrics.oee.toFixed(1)}%</span>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Disponibilidade</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{machine.metrics.availability.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Detalhamento de Desempenho
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desempenho</span>
                <span className="font-semibold">{machine.metrics.performance.toFixed(1)}%</span>
              </div>
              <Progress value={machine.metrics.performance} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qualidade</span>
                <span className="font-semibold">{machine.metrics.quality.toFixed(1)}%</span>
              </div>
              <Progress value={machine.metrics.quality} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disponibilidade</span>
                <span className="font-semibold">{machine.metrics.availability.toFixed(1)}%</span>
              </div>
              <Progress value={machine.metrics.availability} className="h-2" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Utilização de Tempo
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-1" />
                <span className="text-sm text-muted-foreground">Ativo</span>
              </div>
              <span className="text-sm font-semibold">
                {utilization.active.toFixed(1)}h ({activePercent.toFixed(0)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-3" />
                <span className="text-sm text-muted-foreground">Parado</span>
              </div>
              <span className="text-sm font-semibold">
                {utilization.idle.toFixed(1)}h ({idlePercent.toFixed(0)}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-2" />
                <span className="text-sm text-muted-foreground">Tempo de Parada</span>
              </div>
              <span className="text-sm font-semibold">
                {utilization.downtime.toFixed(1)}h ({downtimePercent.toFixed(0)}%)
              </span>
            </div>

            <div className="h-3 rounded-full overflow-hidden flex bg-muted/30">
              <div className="bg-chart-1 transition-all" style={{ width: `${activePercent}%` }} />
              <div className="bg-chart-3 transition-all" style={{ width: `${idlePercent}%` }} />
              <div className="bg-chart-2 transition-all" style={{ width: `${downtimePercent}%` }} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Trend */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Tendência de Desempenho (Últimos 12min)</h3>
          <ChartContainer config={performanceChartConfig} className="h-[120px] w-full">
            <LineChart data={performanceHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        <Separator />

        {machine.status === "repair" || machine.metrics.oee < 60 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-chart-2" />
              Alertas Ativos
            </h3>
            <div className="space-y-2">
              {machine.status === "repair" && (
                <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-chart-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Máquina em Manutenção</p>
                      <p className="text-xs text-muted-foreground">Manutenção em andamento</p>
                    </div>
                  </div>
                </div>
              )}
              {machine.metrics.oee < 60 && (
                <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-chart-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Baixa Eficiência</p>
                      <p className="text-xs text-muted-foreground">Eficiência abaixo de 60%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">ID da Máquina</span>
            <span className="font-mono">{machine.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Posição</span>
            <span className="font-mono">
              ({machine.position.x}, {machine.position.y})
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Última Atualização</span>
            <span>{machine.lastUpdate ? new Date(machine.lastUpdate).toLocaleTimeString("pt-BR") : "N/A"}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
