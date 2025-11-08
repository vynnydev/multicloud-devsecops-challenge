"use client"

import { Card } from "@/components/ui/card"
import { useMachineStore } from "@/lib/store"
import { Activity, AlertCircle, Settings, Wrench, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MachineStatsProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function MachineStats({ isCollapsed, onToggle }: MachineStatsProps) {
  const { machines } = useMachineStore()

  const stats = {
    total: machines.length,
    working: machines.filter((m) => m.status === "working").length,
    repair: machines.filter((m) => m.status === "repair").length,
    idle: machines.filter((m) => m.status === "idle").length,
  }

  return (
    <Card className="p-6 space-y-6 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Equipamentos</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.total}</span>
              <span className="text-sm text-muted-foreground">Equipamentos</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">Operando</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{stats.working}</span>
                <span className="text-sm text-muted-foreground">Equipamentos</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-chart-2" />
                <span className="text-sm text-foreground">Em Manutenção</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{stats.repair}</span>
                <span className="text-sm text-muted-foreground">Equipamentos</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-4 w-4 text-chart-2" />
              <span className="text-sm text-foreground">Aguardando Manutenção</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-chart-2">{stats.idle}</span>
              <span className="text-sm text-muted-foreground">Equipamentos</span>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
