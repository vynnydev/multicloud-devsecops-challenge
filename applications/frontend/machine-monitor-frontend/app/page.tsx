"use client"

import { MachineDialog } from "@/components/machine-dialog"
import { MachineStats } from "@/components/machine-stats"
import { FactoryFloor3D } from "@/components/factory-floor-3d"
import { EquipmentMetrics } from "@/components/equipment-metrics"
import { OEEChart } from "@/components/oee-chart"
import { ZoneTimelineControls } from "@/components/zone-timeline-controls"
import { Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useMachineStore } from "@/lib/store"

export default function Home() {
  const [collapsedPanels, setCollapsedPanels] = useState<Record<string, boolean>>({
    stats: false,
    metrics: false,
    oee: false,
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const { fetchMachinesFromAPI } = useMachineStore()

  const togglePanel = (panelId: string) => {
    setCollapsedPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }))
  }

  useEffect(() => {
    const syncMachines = async () => {
      setIsSyncing(true)
      await fetchMachinesFromAPI()
      setIsSyncing(false)
    }
    syncMachines()
  }, [fetchMachinesFromAPI])

  const handleSync = async () => {
    setIsSyncing(true)
    await fetchMachinesFromAPI()
    setIsSyncing(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Fullscreen 3D Background */}
      <div className="absolute inset-0 w-full h-full">
        <FactoryFloor3D />
      </div>

      {/* Overlay UI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Header Bar */}
        <div className="pointer-events-auto">
          <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold text-xl">M</div>
                </div>
                <h1 className="text-xl font-semibold text-white">Monitor de Máquinas</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="text-white border-white/20 hover:bg-white/10 gap-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Sincronizando..." : "Sincronizar API"}
                </Button>
                <MachineDialog />
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Zone and Timeline Controls */}
          <div className="px-6 py-4">
            <ZoneTimelineControls />
          </div>
        </div>

        {/* Left Sidebar - Stats */}
        <div className="absolute left-6 top-48 pointer-events-auto">
          <MachineStats isCollapsed={collapsedPanels.stats} onToggle={() => togglePanel("stats")} />
        </div>

        {/* Right Sidebar - Charts */}
        <div className="absolute right-6 top-48 w-[380px] space-y-4 pointer-events-auto max-h-[calc(100vh-220px)] overflow-y-auto">
          <EquipmentMetrics isCollapsed={collapsedPanels.metrics} onToggle={() => togglePanel("metrics")} />
          <OEEChart isCollapsed={collapsedPanels.oee} onToggle={() => togglePanel("oee")} />
        </div>
      </div>
    </div>
  )
}
