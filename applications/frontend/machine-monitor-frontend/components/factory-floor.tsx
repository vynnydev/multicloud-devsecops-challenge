"use client"

import { useMachineStore } from "@/lib/store"
import type { Machine } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

function toIsometric(x: number, y: number, z = 0) {
  const tileWidth = 80
  const tileHeight = 40

  const isoX = ((x - y) * tileWidth) / 2
  const isoY = ((x + y) * tileHeight) / 2 - z * 30

  return { x: isoX, y: isoY }
}

// Get status color for machine visualization
function getStatusColor(status: string): { fill: string; stroke: string; label: string } {
  switch (status) {
    case "working":
      return { fill: "hsl(var(--chart-1))", stroke: "hsl(var(--chart-1) / 0.8)", label: "Working" }
    case "idle":
      return { fill: "hsl(var(--chart-3))", stroke: "hsl(var(--chart-3) / 0.8)", label: "Idle" }
    case "repair":
      return { fill: "hsl(var(--chart-2))", stroke: "hsl(var(--chart-2) / 0.8)", label: "Repair" }
    case "offline":
      return { fill: "hsl(var(--muted))", stroke: "hsl(var(--muted-foreground) / 0.3)", label: "Offline" }
    default:
      return { fill: "hsl(var(--muted))", stroke: "hsl(var(--muted-foreground) / 0.3)", label: "Unknown" }
  }
}

interface MachineNodeProps {
  machine: Machine
  isSelected: boolean
  onClick: () => void
}

function MachineNode({ machine, isSelected, onClick }: MachineNodeProps) {
  const { x, y } = toIsometric(machine.position.x, machine.position.y, 0)
  const statusColors = getStatusColor(machine.status)

  return (
    <g
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 hover:brightness-110"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* Pedestal base - isometric cylinder */}
      <ellipse cx={0} cy={5} rx={25} ry={12} fill="hsl(var(--muted))" opacity={0.6} />

      {/* Pedestal body */}
      <path
        d="M -25,5 L -25,-35 Q -25,-40 -20,-42 L 20,-42 Q 25,-40 25,-35 L 25,5 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--border))"
        strokeWidth={1}
        opacity={0.8}
      />

      {/* Pedestal top */}
      <ellipse cx={0} cy={-35} rx={25} ry={12} fill="hsl(var(--muted-foreground))" opacity={0.4} />

      {/* Machine body - isometric box */}
      {/* Top face */}
      <path
        d="M -20,-45 L 0,-55 L 20,-45 L 0,-35 Z"
        fill={statusColors.fill}
        stroke={statusColors.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        opacity={0.95}
      />

      {/* Left face */}
      <path
        d="M -20,-45 L -20,-75 L 0,-85 L 0,-55 Z"
        fill={statusColors.fill}
        stroke={statusColors.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        opacity={0.8}
        filter="brightness(0.85)"
      />

      {/* Right face */}
      <path
        d="M 20,-45 L 20,-75 L 0,-85 L 0,-55 Z"
        fill={statusColors.fill}
        stroke={statusColors.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        opacity={0.7}
        filter="brightness(0.7)"
      />

      {/* Status indicator ring */}
      <circle
        cx={0}
        cy={-60}
        r={12}
        fill="none"
        stroke={statusColors.stroke}
        strokeWidth={2.5}
        opacity={0.9}
        className={machine.status === "working" ? "animate-pulse" : ""}
      />

      {/* Inner status dot */}
      <circle cx={0} cy={-60} r={5} fill={statusColors.stroke} opacity={0.9} />

      {/* Machine label with background */}
      <rect x={-30} y={15} width={60} height={18} rx={4} fill="hsl(var(--background))" opacity={0.9} />
      <text x={0} y={27} textAnchor="middle" className="text-[11px] font-semibold" fill="currentColor">
        {machine.name}
      </text>

      {/* Selection indicator */}
      {isSelected && (
        <>
          <circle cx={0} cy={-95} r={6} fill="hsl(var(--primary))" className="animate-bounce" />
          <circle
            cx={0}
            cy={-60}
            r={20}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </>
      )}
    </g>
  )
}

interface ConveyorBeltProps {
  startX: number
  startY: number
  endX: number
  endY: number
  centerOffsetX: number
  centerOffsetY: number
}

function ConveyorBelt({ startX, startY, endX, endY, centerOffsetX, centerOffsetY }: ConveyorBeltProps) {
  const startIso = toIsometric(startX, startY, 0)
  const endIso = toIsometric(endX, endY, 0)

  const beltWidth = 35

  // Calculate perpendicular offset for 3D effect
  const dx = endIso.x - startIso.x
  const dy = endIso.y - startIso.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const perpX = (-dy / length) * (beltWidth / 2)
  const perpY = (dx / length) * (beltWidth / 2)

  return (
    <g>
      {/* Belt shadow */}
      <line
        x1={startIso.x + centerOffsetX}
        y1={startIso.y + centerOffsetY + 3}
        x2={endIso.x + centerOffsetX}
        y2={endIso.y + centerOffsetY + 3}
        stroke="hsl(var(--background))"
        strokeWidth={beltWidth + 4}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />

      {/* Belt base (dark) */}
      <line
        x1={startIso.x + centerOffsetX}
        y1={startIso.y + centerOffsetY}
        x2={endIso.x + centerOffsetX}
        y2={endIso.y + centerOffsetY}
        stroke="hsl(var(--muted))"
        strokeWidth={beltWidth}
        strokeOpacity={0.6}
        strokeLinecap="round"
      />

      {/* Belt top surface with grid pattern */}
      <line
        x1={startIso.x + centerOffsetX}
        y1={startIso.y + centerOffsetY}
        x2={endIso.x + centerOffsetX}
        y2={endIso.y + centerOffsetY}
        stroke="hsl(var(--muted-foreground))"
        strokeWidth={beltWidth - 4}
        strokeOpacity={0.4}
        strokeLinecap="round"
      />

      {/* Animated movement lines */}
      <line
        x1={startIso.x + centerOffsetX}
        y1={startIso.y + centerOffsetY}
        x2={endIso.x + centerOffsetX}
        y2={endIso.y + centerOffsetY}
        stroke="hsl(var(--primary))"
        strokeWidth={3}
        strokeOpacity={0.5}
        strokeDasharray="15 15"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="30" dur="2s" repeatCount="indefinite" />
      </line>

      {/* Belt edges for 3D effect */}
      <line
        x1={startIso.x + centerOffsetX + perpX}
        y1={startIso.y + centerOffsetY + perpY}
        x2={endIso.x + centerOffsetX + perpX}
        y2={endIso.y + centerOffsetY + perpY}
        stroke="hsl(var(--border))"
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      <line
        x1={startIso.x + centerOffsetX - perpX}
        y1={startIso.y + centerOffsetY - perpY}
        x2={endIso.x + centerOffsetX - perpX}
        y2={endIso.y + centerOffsetY - perpY}
        stroke="hsl(var(--border))"
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
    </g>
  )
}

export function FactoryFloor() {
  const { machines, selectMachine, selectedMachine, initializeDefaultMachines } = useMachineStore()
  const [hoveredMachine, setHoveredMachine] = useState<string | null>(null)

  useEffect(() => {
    initializeDefaultMachines()
  }, [initializeDefaultMachines])

  // Calculate center offset for better positioning
  const centerOffsetX = 350
  const centerOffsetY = 150

  const handleMachineClick = (machineId: string) => {
    selectMachine(selectedMachine === machineId ? null : machineId)
  }

  // Draw grid lines for reference
  const gridSize = 11
  const gridLines = []

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const { x, y } = toIsometric(i, j, 0)
      gridLines.push(
        <g key={`grid-${i}-${j}`} transform={`translate(${x + centerOffsetX}, ${y + centerOffsetY})`}>
          <circle r={2} fill="hsl(var(--border))" opacity={0.3} />
        </g>,
      )
    }
  }

  const selectedMachineData = machines.find((m) => m.id === selectedMachine)

  const conveyorPaths = [
    { startX: 0, startY: 2, endX: 8, endY: 2 },
    { startX: 0, startY: 4, endX: 8, endY: 4 },
    { startX: 0, startY: 6, endX: 8, endY: 6 },
  ]

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 h-full min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Factory Floor Layout</h2>
          <p className="text-sm text-muted-foreground">Interactive 3D isometric view</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-chart-1/20 border border-chart-1/30">
            <div className="w-3 h-3 rounded-sm bg-chart-1" />
            <span className="text-xs">Working</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-chart-2/20 border border-chart-2/30">
            <div className="w-3 h-3 rounded-sm bg-chart-2" />
            <span className="text-xs">Repair</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-chart-3/20 border border-chart-3/30">
            <div className="w-3 h-3 rounded-sm bg-chart-3" />
            <span className="text-xs">Idle</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background/50 to-muted/20">
        {machines.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Loading factory floor...</p>
            </div>
          </div>
        ) : (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            className="text-foreground"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="floorGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Floor gradient */}
            <rect width="100%" height="100%" fill="url(#floorGradient)" />

            {/* Grid dots */}
            {gridLines}

            {/* Conveyor belts - drawn first (background layer) */}
            {conveyorPaths.map((path, index) => (
              <ConveyorBelt
                key={`conveyor-${index}`}
                startX={path.startX}
                startY={path.startY}
                endX={path.endX}
                endY={path.endY}
                centerOffsetX={centerOffsetX}
                centerOffsetY={centerOffsetY}
              />
            ))}

            {/* Machines - drawn on top */}
            {machines.map((machine) => (
              <g key={machine.id} transform={`translate(${centerOffsetX}, ${centerOffsetY})`}>
                <MachineNode
                  machine={machine}
                  isSelected={selectedMachine === machine.id}
                  onClick={() => handleMachineClick(machine.id)}
                />
              </g>
            ))}
          </svg>
        )}

        {/* Machine info overlay */}
        {selectedMachineData && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-4 bg-card/95 backdrop-blur border-primary/50">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{selectedMachineData.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {getStatusColor(selectedMachineData.status).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedMachineData.type}</p>
                  <p className="text-xs text-muted-foreground">
                    Position: ({selectedMachineData.position.x}, {selectedMachineData.position.y})
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="text-muted-foreground">OEE:</div>
                  <div className="font-semibold text-right">{selectedMachineData.metrics.oee.toFixed(1)}%</div>
                  <div className="text-muted-foreground">Performance:</div>
                  <div className="font-semibold text-right">{selectedMachineData.metrics.performance.toFixed(1)}%</div>
                  <div className="text-muted-foreground">Quality:</div>
                  <div className="font-semibold text-right">{selectedMachineData.metrics.quality.toFixed(1)}%</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -16;
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Card>
  )
}
