"use client"

import { KanbanBoard } from "@/components/kanban-board"
import { Machine3DCard } from "@/components/machine-3d-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, Filter, Download } from 'lucide-react'

export default function TasksPage() {
  const stats = [
    {
      label: "Total de Tarefas",
      value: 16,
      color: "blue",
    },
    {
      label: "Em Progresso",
      value: 5,
      color: "orange",
    },
    {
      label: "Concluídas Hoje",
      value: 8,
      color: "green",
    },
    {
      label: "Atrasadas",
      value: 2,
      color: "red",
    },
  ]

  const activeMachines = [
    {
      id: "M001",
      name: "Robô Industrial CNC-X500",
      status: "running" as const,
      task: "Corte de peças de precisão - Padrão ST/I-3",
      speed: 85,
      efficiency: 92,
      temperature: 45,
      location: "Linha de Produção 1",
    },
    {
      id: "M002",
      name: "Torno Automático TA-2000",
      status: "running" as const,
      task: "Usinagem de eixos metálicos",
      speed: 78,
      efficiency: 88,
      temperature: 52,
      location: "Linha de Produção 2",
    },
    {
      id: "M003",
      name: "Fresadora CNC F-800",
      status: "idle" as const,
      task: "Aguardando próximo lote",
      speed: 0,
      efficiency: 0,
      temperature: 28,
      location: "Linha de Produção 3",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quadro de Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie tarefas de automação e manutenção de equipamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <div className={`h-6 w-6 rounded-full bg-${stat.color}-500`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Máquinas em Operação</h2>
          <Badge variant="secondary">{activeMachines.filter((m) => m.status === "running").length} ativas</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMachines.map((machine) => (
            <Machine3DCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Tarefas de Manutenção</h2>
        <KanbanBoard />
      </div>
    </div>
  )
}
