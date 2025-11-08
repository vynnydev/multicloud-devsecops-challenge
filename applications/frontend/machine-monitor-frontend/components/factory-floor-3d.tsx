"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Text } from "@react-three/drei"
import { useMachineStore } from "@/lib/store"
import type { Machine, MachineType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRef, useMemo, useEffect } from "react"
import * as THREE from "three"
import { Wrench, Trash2 } from "lucide-react"

function getStatusColor(status: string): string {
  switch (status) {
    case "working":
      return "#10b981" // emerald-500
    case "idle":
      return "#f59e0b" // amber-500
    case "repair":
      return "#ef4444" // red-500
    case "offline":
      return "#6b7280" // gray-500
    default:
      return "#6b7280"
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "working":
      return "Operando"
    case "idle":
      return "Parada"
    case "repair":
      return "Em Manutenção"
    case "offline":
      return "Offline"
    default:
      return "Desconhecido"
  }
}

function getMachineTypeLabel(type: MachineType): string {
  return type // Already in Portuguese
}

interface MachineModelProps {
  machine: Machine
  isSelected: boolean
  onClick: () => void
}

interface AnimatedMachineBodyProps {
  type: MachineType
  status: string
}

function AnimatedIndustrialMachineBody({ type, status }: AnimatedMachineBodyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const armRef = useRef<THREE.Mesh>(null)
  const bladeRef = useRef<THREE.Mesh>(null)
  const drillRef = useRef<THREE.Mesh>(null)
  const pumpRotorRef = useRef<THREE.Mesh>(null)
  const pumpImpellerRef = useRef<THREE.Mesh>(null)

  const animationSpeed = status === "working" ? 1 : status === "idle" ? 0.3 : 0

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (type === "Rebitadeira" && headRef.current) {
      headRef.current.position.y = 0.7 + Math.sin(time * 8 * animationSpeed) * 0.15
    }

    if (type === "Montadora" && armRef.current) {
      groupRef.current!.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh && idx > 0) {
          child.rotation.z = Math.sin(time * 2 * animationSpeed + idx) * 0.3
        }
      })
    }

    if (type === "Cortadora" && bladeRef.current) {
      bladeRef.current.position.y = 0.4 + Math.sin(time * 3 * animationSpeed) * 0.2
    }

    if (type === "Prensa" && headRef.current) {
      headRef.current.position.y = 0.5 + Math.sin(time * 1.5 * animationSpeed) * 0.3
    }

    if (type === "Soldadora" && armRef.current) {
      armRef.current.rotation.z = -Math.PI / 6 + Math.sin(time * 2 * animationSpeed) * 0.2
    }

    if (type === "Furadeira" && drillRef.current) {
      drillRef.current.rotation.y = time * 10 * animationSpeed
      drillRef.current.position.y = 0.4 + Math.sin(time * 4 * animationSpeed) * 0.1
    }

    if (type === "Bomba Centrífuga") {
      if (pumpRotorRef.current) {
        pumpRotorRef.current.rotation.z = time * 8 * animationSpeed
      }
      if (pumpImpellerRef.current) {
        pumpImpellerRef.current.rotation.y = time * 12 * animationSpeed
      }
    }

    if (groupRef.current && status === "working") {
      groupRef.current.position.y = Math.sin(time * 20) * 0.01
    }
  })

  switch (type) {
    case "Rebitadeira":
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.3, 1.2, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh ref={headRef} position={[0, 0.7, 0]} castShadow>
            <coneGeometry args={[0.15, 0.3, 16]} />
            <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.5, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      )

    case "Montadora":
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <boxGeometry args={[1, 0.8, 0.6]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh ref={armRef} position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
            <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
            <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.35]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.1]} />
            <meshStandardMaterial color="#27272a" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      )

    case "Cortadora":
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.6, 0.8]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh ref={bladeRef} position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.8, 0.1, 0.05]} />
            <meshStandardMaterial color="#e5e5e5" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0.2, 0.3]} castShadow>
            <boxGeometry args={[1, 0.4, 0.1]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.3} roughness={0.6} transparent opacity={0.5} />
          </mesh>
        </group>
      )

    case "Prensa":
      return (
        <group ref={groupRef}>
          <mesh position={[-0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
            <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
            <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh ref={headRef} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.9, 0.3, 0.7]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[1, 0.2, 0.8]} />
            <meshStandardMaterial color="#71717a" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      )

    case "Soldadora":
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.9, 0.7]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh ref={armRef} position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.6, 0.5, 0]} castShadow>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshStandardMaterial color="#ea580c" metalness={0.9} roughness={0.1} />
          </mesh>
          {status === "working" && <pointLight position={[0.6, 0.5, 0]} color="#fbbf24" intensity={2} distance={2} />}
          <mesh position={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#18181b" metalness={0.1} roughness={0.9} />
          </mesh>
        </group>
      )

    case "Furadeira":
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1.3, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh ref={drillRef} position={[0, 0.4, 0]} castShadow>
            <coneGeometry args={[0.05, 0.5, 8]} />
            <meshStandardMaterial color="#e5e5e5" metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[0.6, 0.15, 0.6]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      )

    case "Bomba Centrífuga":
      return (
        <group ref={groupRef}>
          {/* Main pump casing - cylindrical body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.7, 24]} />
            <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Top cap */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 0.1, 24]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* Bottom cap */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.35, 0.1, 24]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* Inlet pipe */}
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Outlet pipe */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Motor housing on side */}
          <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
            <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.25} />
          </mesh>

          {/* Rotating shaft indicator */}
          <mesh ref={pumpRotorRef} position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial color="#e5e5e5" metalness={0.95} roughness={0.05} />
          </mesh>

          {/* Impeller blades (visible through transparent section) */}
          <group ref={pumpImpellerRef} position={[0, 0, 0]}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]} position={[0.25, 0, 0]} castShadow>
                <boxGeometry args={[0.3, 0.05, 0.08]} />
                <meshStandardMaterial color="#93c5fd" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
          </group>

          {/* Base mounting plate */}
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[1, 0.1, 0.7]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Status indicator light for pump operation */}
          {status === "working" && (
            <>
              <mesh position={[0.3, 0.3, 0.5]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
              </mesh>
              <pointLight position={[0.3, 0.3, 0.5]} color="#22c55e" intensity={1.5} distance={2} />
            </>
          )}
        </group>
      )

    default:
      return (
        <group ref={groupRef}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )
  }
}

function MachineModel({ machine, isSelected, onClick }: MachineModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const statusColor = getStatusColor(machine.status)

  const posX = (machine.position.x - 4) * 2.5
  const posZ = (machine.position.y - 4) * 2.5

  useFrame((state) => {
    if (ringRef.current && machine.status === "working") {
      const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.3 + 1
      ringRef.current.scale.set(pulse, pulse, 1)
    }
  })

  return (
    <group ref={meshRef} position={[posX, 0, posZ]} onClick={onClick}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.8, 32]} />
        <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
        <meshStandardMaterial color="#71717a" metalness={0.6} roughness={0.4} />
      </mesh>

      <mesh ref={ringRef} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.55, 32]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={machine.status === "working" ? 1.2 : 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[0, 1.5, 0]}>
        <AnimatedIndustrialMachineBody type={machine.type} status={machine.status} />

        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1.5} />
        </mesh>

        <pointLight
          position={[0, 0.8, 0]}
          color={statusColor}
          intensity={machine.status === "working" ? 2 : 1.5}
          distance={3}
        />
      </group>

      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {machine.name}
      </Text>

      <Text
        position={[0, 2.7, 0]}
        fontSize={0.13}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {machine.type}
      </Text>

      {machine.corridor && (
        <Text
          position={[0, 2.45, 0]}
          fontSize={0.15}
          color="#14b8a6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Corredor {machine.corridor}
        </Text>
      )}

      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.1, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function ConveyorBelt({ yPosition, length = 20 }: { yPosition: number; length?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material.map) {
        material.map.offset.x += 0.001
      }
    }
  })

  return (
    <group position={[0, 0, (yPosition - 4) * 2.5]}>
      <mesh position={[0, 0, 0]} receiveShadow ref={meshRef}>
        <boxGeometry args={[length, 0.15, 2.2]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.5} />
      </mesh>

      <mesh position={[length / 2 - 0.1, 0.2, 1.2]}>
        <boxGeometry args={[length, 0.1, 0.1]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[length / 2 - 0.1, 0.2, -1.2]}>
        <boxGeometry args={[length, 0.1, 0.1]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
      </mesh>

      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x * 3, -0.4, 0]}>
          <mesh position={[0, 0, 1]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
            <meshStandardMaterial color="#27272a" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, -1]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
            <meshStandardMaterial color="#27272a" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CorridorLabels() {
  const numbers = [
    { label: "1", x: -10, z: -8 },
    { label: "2", x: -10, z: -3 },
    { label: "3", x: -10, z: 2 },
    { label: "4", x: -10, z: 7.5 },
    { label: "5", x: -10, z: 12.5 },
  ]

  return (
    <group>
      {numbers.map((num) => (
        <Text
          key={num.label}
          position={[num.x, 0.1, num.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.8}
          color="#14b8a6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {num.label}
        </Text>
      ))}
    </group>
  )
}

function FactoryScene() {
  const { machines, selectMachine, selectedMachine, selectedZone, initializeDefaultMachines } = useMachineStore()

  useEffect(() => {
    console.log("[v0] FactoryScene mounted, machines count:", machines.length)
    if (machines.length === 0) {
      console.log("[v0] No machines found, initializing defaults...")
      initializeDefaultMachines()
    }
  }, [])

  const filteredMachines = useMemo(() => {
    console.log("[v0] Filtering machines - total:", machines.length, "selectedZone:", selectedZone)
    if (!selectedZone) return machines
    const filtered = machines.filter((m) => m.zoneId === selectedZone)
    console.log("[v0] Filtered machines count:", filtered.length)
    return filtered
  }, [machines, selectedZone])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#14b8a6" />

      <Environment preset="warehouse" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.8} />
      </mesh>

      <gridHelper args={[40, 40, "#1e3a3a", "#1e3a3a"]} position={[0, 0, 0]} />

      <ConveyorBelt yPosition={0} />
      <ConveyorBelt yPosition={2} />
      <ConveyorBelt yPosition={4} />
      {/* Gap between corridor 4 and 5 */}
      <ConveyorBelt yPosition={6.5} />
      <ConveyorBelt yPosition={8.5} />

      {filteredMachines.map((machine) => (
        <MachineModel
          key={machine.id}
          machine={machine}
          isSelected={selectedMachine === machine.id}
          onClick={() => selectMachine(selectedMachine === machine.id ? null : machine.id)}
        />
      ))}

      <CorridorLabels />

      <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={45} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </>
  )
}

export function FactoryFloor3D() {
  const { machines, selectMachine, selectedMachine, updateMachineStatus, deleteMachine, sendToMaintenance } =
    useMachineStore()
  const selectedMachineData = machines.find((m) => m.id === selectedMachine)

  const handleSendToMaintenance = async () => {
    if (selectedMachine) {
      const success = await sendToMaintenance(selectedMachine)
      if (success) {
        console.log("[v0] Machine sent to maintenance successfully")
      } else {
        console.error("[v0] Failed to send machine to maintenance")
      }
    }
  }

  const handleDelete = async () => {
    if (selectedMachine && selectedMachineData) {
      const confirmed = window.confirm(`Tem certeza que deseja remover a máquina "${selectedMachineData.name}"?`)
      if (confirmed) {
        await deleteMachine(selectedMachine)
        selectMachine(null)
      }
    }
  }

  return (
    <div className="w-full h-full">
      <Canvas shadows className="w-full h-full">
        <FactoryScene />
      </Canvas>

      {selectedMachineData && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <Card className="p-4 bg-slate-900/95 backdrop-blur-md border-teal-500/50 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-lg">{selectedMachineData.name}</h3>
                  <Badge variant="outline" className="text-xs border-teal-500/50 text-teal-400">
                    {getStatusLabel(selectedMachineData.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{selectedMachineData.type}</p>
                <p className="text-xs text-gray-500">
                  {selectedMachineData.corridor && `Corredor ${selectedMachineData.corridor} • `}
                  Posição: ({selectedMachineData.position.x}, {selectedMachineData.position.y})
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div className="text-gray-400">Eficiência:</div>
                <div className="font-semibold text-right text-teal-400">
                  {selectedMachineData.metrics.oee.toFixed(1)}%
                </div>
                <div className="text-gray-400">Desempenho:</div>
                <div className="font-semibold text-right text-teal-400">
                  {selectedMachineData.metrics.performance.toFixed(1)}%
                </div>
                <div className="text-gray-400">Qualidade:</div>
                <div className="font-semibold text-right text-teal-400">
                  {selectedMachineData.metrics.quality.toFixed(1)}%
                </div>
                <div className="text-gray-400">Disponibilidade:</div>
                <div className="font-semibold text-right text-teal-400">
                  {selectedMachineData.metrics.availability.toFixed(1)}%
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant={selectedMachineData.status === "repair" ? "secondary" : "default"}
                  onClick={handleSendToMaintenance}
                  disabled={selectedMachineData.status === "repair"}
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  {selectedMachineData.status === "repair" ? "Em Manutenção" : "Enviar p/ Manutenção"}
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Remover Máquina
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
