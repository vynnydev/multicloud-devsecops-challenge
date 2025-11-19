"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Activity, Gauge, Zap, Sparkles, Brain } from 'lucide-react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

interface Machine3DCardProps {
  machine: {
    id: string
    name: string
    status: "running" | "idle" | "maintenance"
    task: string
    speed: number
    efficiency: number
    temperature: number
    location: string
  }
}

function RoboticArm() {
  return (
    <group position={[0, -0.5, 0]} scale={1.2}>
      {/* Base with metallic finish */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.6, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} envMapIntensity={2} />
      </mesh>

      {/* Lower arm segment */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#fb923c" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Joint sphere */}
      <mesh position={[0.4, 2, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Upper arm segment */}
      <mesh position={[1, 2.3, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#fb923c" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Wrist joint */}
      <mesh position={[1.5, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* End effector/gripper */}
      <mesh position={[1.5, 3.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Gripper fingers */}
      <mesh position={[1.45, 3.3, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.55, 3.3, -0.15]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cable details */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.1 + i * 0.05, 1.5, 0.2]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function CNCLathe() {
  return (
    <group position={[0, -0.8, 0]} scale={0.35}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.4, 2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} envMapIntensity={1.8} />
      </mesh>

      {/* Bed rails */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[5.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#34495e" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Headstock */}
      <mesh position={[-2.5, 1.2, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 1.5]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Spindle */}
      <mesh position={[-3, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Chuck */}
      <mesh position={[-3.3, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.25, 64]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.95} roughness={0.1} envMapIntensity={2} />
      </mesh>

      {/* Chuck jaws */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2
        return (
          <mesh
            key={i}
            position={[-3.3, 1.2 + Math.cos(angle) * 0.3, Math.sin(angle) * 0.3]}
            castShadow
          >
            <boxGeometry args={[0.12, 0.35, 0.06]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.15} />
          </mesh>
        )
      })}

      {/* Turret */}
      <mesh position={[0.5, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 12]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Tool holders on turret */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6
        return (
          <mesh
            key={i}
            position={[0.5 + Math.cos(angle) * 0.35, 1.3, Math.sin(angle) * 0.35]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.25, 0.08]} />
            <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.25} />
          </mesh>
        )
      })}

      {/* Tailstock */}
      <mesh position={[2, 0.9, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 1]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Tailstock quill */}
      <mesh position={[2.4, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Control panel */}
      <mesh position={[3, 1.2, -0.8]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Control screen */}
      <mesh position={[3.05, 1.4, -0.8]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.03]} />
        <meshStandardMaterial color="#1e3a5f" emissive="#2e5c8a" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>

      {/* Emergency stop button */}
      <mesh position={[3.05, 0.8, -0.75]} rotation={[Math.PI / 2, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.4} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function CNCMillingMachine() {
  return (
    <group position={[0, -0.8, 0]} scale={0.4}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.6, 3.5]} />
        <meshStandardMaterial color="#2874a6" metalness={0.85} roughness={0.2} envMapIntensity={1.8} />
      </mesh>

      {/* Work table */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[3, 0.3, 2.5]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.15} envMapIntensity={2} />
      </mesh>

      {/* T-slots on table */}
      {[-0.6, 0, 0.6].map((z, i) => (
        <mesh key={i} position={[0, 0.92, z]} castShadow>
          <boxGeometry args={[2.9, 0.04, 0.12]} />
          <meshStandardMaterial color="#34495e" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* Column */}
      <mesh position={[0, 2.5, -1.2]} castShadow>
        <boxGeometry args={[0.8, 3.5, 1.5]} />
        <meshStandardMaterial color="#2874a6" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Saddle */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1.2]} />
        <meshStandardMaterial color="#2874a6" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Spindle head */}
      <mesh position={[0, 3.8, 0.4]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Spindle */}
      <mesh position={[0, 2.6, 0.4]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 32]} />
        <meshStandardMaterial color="#ecf0f1" metalness={0.95} roughness={0.05} envMapIntensity={2.5} />
      </mesh>

      {/* Tool holder/collet */}
      <mesh position={[0, 1.5, 0.4]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.35, 32]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* End mill tool */}
      <mesh position={[0, 1.1, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.7, 16]} />
        <meshStandardMaterial color="#f39c12" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Tool flutes */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI * 2) / 4
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.045, 1.1, 0.4 + Math.sin(angle) * 0.045]}
            castShadow
          >
            <boxGeometry args={[0.015, 0.55, 0.015]} />
            <meshStandardMaterial color="#d68910" metalness={0.85} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Control panel */}
      <mesh position={[1.8, 1.8, 1.2]} rotation={[0, -Math.PI / 6, 0]} castShadow>
        <boxGeometry args={[0.6, 1, 0.15]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Control screen */}
      <mesh position={[1.82, 2, 1.2]} rotation={[0, -Math.PI / 6, 0]}>
        <boxGeometry args={[0.45, 0.35, 0.02]} />
        <meshStandardMaterial color="#1e3a5f" emissive="#3498db" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>

      {/* Coolant nozzle */}
      <mesh position={[-0.4, 2, 0.8]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.025, 0.35, 16]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Machine3DModel({ machineName }: { machineName: string }) {
  if (machineName.includes("Robô") || machineName.includes("Robot")) {
    return <RoboticArm />
  } else if (machineName.includes("Torno") || machineName.includes("Lathe")) {
    return <CNCLathe />
  } else if (machineName.includes("Fresadora") || machineName.includes("Mill")) {
    return <CNCMillingMachine />
  }
  
  // Default to robotic arm if no match
  return <RoboticArm />
}

export function Machine3DCard({ machine }: Machine3DCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const statusColors = {
    running: "bg-green-500",
    idle: "bg-yellow-500",
    maintenance: "bg-red-500",
  }

  const statusLabels = {
    running: "Em Operação",
    idle: "Ocioso",
    maintenance: "Manutenção",
  }

  const handleAIAnalysis = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 3000)
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 ${analyzing ? "ring-2 ring-purple-500" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{machine.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{machine.location}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="gap-1.5">
              <div className={`h-2 w-2 rounded-full ${statusColors[machine.status]} animate-pulse`} />
              {statusLabels[machine.status]}
            </Badge>
            {analyzing && (
              <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
                <Brain className="h-3 w-3" />
                Analisando...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={`relative bg-gradient-to-br from-background to-muted/30 rounded-lg overflow-hidden transition-all duration-300 ${expanded ? "h-64" : "h-32"}`}
        >
          {analyzing && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse z-10 pointer-events-none" />
          )}
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[3, 2, 3]} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
            
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#add8e6" />
            <pointLight position={[0, 2, 2]} intensity={0.6} color="#4a90e2" />
            <spotLight position={[0, 5, 0]} angle={0.3} penumbra={0.5} intensity={0.8} castShadow />
            
            <Machine3DModel machineName={machine.name} />
            
            <Environment preset="warehouse" />
            
            {/* Ground plane for shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.3} />
            </mesh>
          </Canvas>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Gauge className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Velocidade</p>
              <p className="text-sm font-semibold">{machine.speed}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Activity className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Eficiência</p>
              <p className="text-sm font-semibold">{machine.efficiency}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Zap className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Temp.</p>
              <p className="text-sm font-semibold">{machine.temperature}°C</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Tarefa Atual:</p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAIAnalysis}
              className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-500"
            >
              <Sparkles className="h-3 w-3" />
              Analisar com IA
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{machine.task}</p>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Horas de Operação</p>
                <p className="text-sm font-medium">248.5h</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Última Manutenção</p>
                <p className="text-sm font-medium">há 15 dias</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Próxima Revisão</p>
                <p className="text-sm font-medium">em 14 dias</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ciclos Completados</p>
                <p className="text-sm font-medium">12,430</p>
              </div>
            </div>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="w-full">
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Mostrar Menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver Mais Detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
