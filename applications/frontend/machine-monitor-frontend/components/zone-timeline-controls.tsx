"use client"

import { useMachineStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function ZoneTimelineControls() {
  const { zones, selectedZone, selectZone } = useMachineStore()
  const [currentTime, setCurrentTime] = useState(10.42) // 10:25 in decimal hours

  // Generate timeline markers
  const timeMarkers = []
  for (let hour = 10; hour <= 11; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const time = hour + minute / 60
      timeMarkers.push({
        time,
        label: `${hour}:${minute.toString().padStart(2, "0")}`,
      })
    }
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
      <div className="flex items-center gap-6">
        {/* Zone Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Selecionar Zona</span>
          <Select value={selectedZone || undefined} onValueChange={selectZone}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Selecione uma zona" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-1 h-10">
            {timeMarkers.map((marker, index) => {
              const isActive = Math.abs(marker.time - currentTime) < 0.25
              const isMainHour = marker.label.endsWith(":00")

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center flex-1 group cursor-pointer"
                  onClick={() => setCurrentTime(marker.time)}
                >
                  {/* Time marker dot */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isActive ? "bg-primary scale-150" : isMainHour ? "bg-foreground/40" : "bg-foreground/20"
                    }`}
                  />

                  {/* Time label */}
                  {(isMainHour || index % 3 === 0) && (
                    <span
                      className={`absolute top-6 text-[10px] transition-colors ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {marker.label}
                    </span>
                  )}

                  {/* Active time range highlight */}
                  {isActive && <div className="absolute inset-0 bg-primary/20 -mx-2 rounded animate-pulse" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
