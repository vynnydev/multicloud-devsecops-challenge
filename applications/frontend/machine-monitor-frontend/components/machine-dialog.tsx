"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useMachineStore } from "@/lib/store"
import type { Machine, MachineStatus, MachineType } from "@/lib/types"

export function MachineDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addMachine, zones, machines } = useMachineStore()

  const [formData, setFormData] = useState({
    name: "",
    type: "Rebitadeira" as MachineType,
    zoneId: zones[0]?.id || "",
    status: "working" as MachineStatus,
    corridor: "1", // Default to corridor 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const corridorNumber = Number.parseInt(formData.corridor)
    const yPosition =
      corridorNumber === 1 ? 0 : corridorNumber === 2 ? 2 : corridorNumber === 3 ? 4 : corridorNumber === 4 ? 6.5 : 8.5

    // Count existing machines in this corridor to position new machine
    const machinesInCorridor = machines.filter((m) => m.corridor === formData.corridor).length
    const xPosition = (machinesInCorridor % 3) + 1 // Distribute machines across 3 columns (1, 2, 3)

    const newMachine: Machine = {
      id: `machine-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      zoneId: formData.zoneId,
      status: formData.status,
      corridor: formData.corridor,
      position: {
        x: xPosition,
        y: yPosition,
        z: 0,
      },
      metrics: {
        performance: 85 + Math.random() * 10,
        quality: 90 + Math.random() * 8,
        availability: 88 + Math.random() * 10,
        oee: 80 + Math.random() * 15,
      },
      utilization: {
        active: 5 + Math.random() * 2,
        idle: 1 + Math.random() * 1.5,
        downtime: Math.random() * 0.8,
      },
      createdAt: new Date(),
      lastUpdate: new Date(),
    }

    try {
      await addMachine(newMachine)
      setOpen(false)
      setFormData({
        name: "",
        type: "Rebitadeira",
        zoneId: zones[0]?.id || "",
        status: "working",
        corridor: "1",
      })
    } catch (error) {
      console.error("[v0] Erro ao adicionar máquina:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Máquina
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Máquina</DialogTitle>
          <DialogDescription>Registre uma nova máquina industrial no chão de fábrica.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Máquina</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: T-9R"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Máquina</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as MachineType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rebitadeira">Rebitadeira</SelectItem>
                  <SelectItem value="Montadora">Montadora</SelectItem>
                  <SelectItem value="Cortadora">Cortadora</SelectItem>
                  <SelectItem value="Prensa">Prensa</SelectItem>
                  <SelectItem value="Soldadora">Soldadora</SelectItem>
                  <SelectItem value="Furadeira">Furadeira</SelectItem>
                  <SelectItem value="Bomba Centrífuga">Bomba Centrífuga</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zone">Zona</Label>
              <Select value={formData.zoneId} onValueChange={(value) => setFormData({ ...formData, zoneId: value })}>
                <SelectTrigger id="zone">
                  <SelectValue />
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
            <div className="grid gap-2">
              <Label htmlFor="corridor">Corredor</Label>
              <Select
                value={formData.corridor}
                onValueChange={(value) => setFormData({ ...formData, corridor: value })}
              >
                <SelectTrigger id="corridor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Corredor 1</SelectItem>
                  <SelectItem value="2">Corredor 2</SelectItem>
                  <SelectItem value="3">Corredor 3</SelectItem>
                  <SelectItem value="4">Corredor 4</SelectItem>
                  <SelectItem value="5">Corredor 5</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                A máquina será posicionada automaticamente no corredor selecionado
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as MachineStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">Operando</SelectItem>
                  <SelectItem value="idle">Parada</SelectItem>
                  <SelectItem value="repair">Em Manutenção</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Adicionar Máquina"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
