"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Clock, MapPin, Wrench, Factory, Building2, Activity, AlertTriangle, CheckCircle2, TrendingUp, Download, Filter, Search, Brain, Thermometer, Zap, Gauge } from 'lucide-react'
import { Machine3DViewer } from "@/components/machine-3d-viewer"
import { Input } from "@/components/ui/input"

const locations = [
  { id: "oficina-centro", name: "Oficina Centro Automotiva", type: "workshop" },
  { id: "industria-textil", name: "Indústria Textil São Paulo", type: "industry" },
  { id: "hospital-equipamentos", name: "Hospital Santa Maria", type: "medical" },
  { id: "garagem-frota", name: "Garagem de Frota Volvo", type: "garage" }
]

const machinesByLocation: Record<string, any[]> = {
  "oficina-centro": [
    { id: "1", name: "Bomba Centrífuga BC-2000", type: "centrifugal-pump", reportsCount: 12 },
    { id: "2", name: "Torno CNC T-3000", type: "cnc-lathe", reportsCount: 8 },
    { id: "3", name: "Motor V8 Turbo", type: "car-engine", reportsCount: 15 },
  ],
  "industria-textil": [
    { id: "5", name: "Fresadora Universal FU-500", type: "milling-machine", reportsCount: 10 },
    { id: "6", name: "Prensa Hidráulica PH-3000", type: "hydraulic-press", reportsCount: 6 },
  ],
  "hospital-equipamentos": [
    { id: "9", name: "Ressonância Magnética MRI-2000", type: "mri-machine", reportsCount: 20 },
    { id: "10", name: "Tomógrafo CT-5000", type: "ct-scanner", reportsCount: 18 },
  ],
  "garagem-frota": [
    { id: "12", name: "Ônibus Elétrico Volvo 7900", type: "electric-bus", reportsCount: 14 },
  ]
}

const mockReportsByMachine: Record<string, any[]> = {
  "1": [
    { id: "R-2025-001", date: "15 Jan 2025", time: "14:30", status: "excellent", healthScore: 98 },
    { id: "R-2025-002", date: "10 Jan 2025", time: "09:15", status: "good", healthScore: 92 },
    { id: "R-2024-089", date: "28 Dez 2024", time: "16:45", status: "warning", healthScore: 78 },
    { id: "R-2024-085", date: "20 Dez 2024", time: "11:20", status: "excellent", healthScore: 96 },
    { id: "R-2024-080", date: "15 Dez 2024", time: "08:30", status: "good", healthScore: 91 },
  ]
}

export default function ReportsPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0].id)
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const currentMachines = machinesByLocation[selectedLocation] || []
  const currentReports = selectedMachine ? (mockReportsByMachine[selectedMachine.id] || []) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-600"
      case "good": return "bg-blue-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle2 className="h-5 w-5" />
      case "good": return <TrendingUp className="h-5 w-5" />
      case "warning": return <AlertTriangle className="h-5 w-5" />
      case "critical": return <AlertTriangle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Relatórios de Análise
            </h1>
            <p className="text-lg text-muted-foreground">
              Histórico completo de análises e diagnósticos preditivos
            </p>
          </div>
        </div>

        {!selectedReport ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location & Machine Selection */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Selecionar Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={selectedLocation} onValueChange={(value) => {
                    setSelectedLocation(value)
                    setSelectedMachine(null)
                    setSelectedReport(null)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          <div className="flex items-center gap-2">
                            {loc.type === "workshop" && <Wrench className="h-4 w-4" />}
                            {loc.type === "industry" && <Factory className="h-4 w-4" />}
                            {loc.type === "garage" && <Building2 className="h-4 w-4" />}
                            {loc.type === "medical" && <Activity className="h-4 w-4" />}
                            {loc.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-purple-600" />
                    Máquinas ({currentMachines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentMachines.map((machine) => (
                      <Card
                        key={machine.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMachine?.id === machine.id ? 'ring-2 ring-blue-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedMachine(machine)
                          setSelectedReport(null)
                        }}
                      >
                        <CardContent className="p-3">
                          <p className="font-medium text-sm">{machine.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {machine.reportsCount} relatórios
                            </Badge>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <div className="lg:col-span-2">
              {selectedMachine ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        Relatórios - {selectedMachine.name}
                      </span>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentReports.map((report) => (
                        <Card
                          key={report.id}
                          className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                          onClick={() => setSelectedReport(report)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getStatusColor(report.status)} text-white`}>
                                  {getStatusIcon(report.status)}
                                </div>
                                <div>
                                  <p className="font-semibold">{report.id}</p>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {report.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {report.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{report.healthScore}%</div>
                                <p className="text-xs text-muted-foreground">Saúde</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              Ver Relatório Completo
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center p-12">
                    <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Selecione uma máquina</p>
                    <p className="text-muted-foreground mt-2">
                      Escolha uma máquina para visualizar seus relatórios
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // Detailed Report View
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedMachine.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedReport.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedReport.time}
                    </span>
                    <Badge className={getStatusColor(selectedReport.status)}>
                      {selectedReport.id}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                    Voltar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Left Column - Metrics */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Saúde Geral</span>
                        <Gauge className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600">{selectedReport.healthScore}%</div>
                      <div className="text-xs text-muted-foreground mt-1">Excelente</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Temperatura</span>
                        <Thermometer className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="text-2xl font-bold">72°C</div>
                      <div className="text-xs text-green-600 mt-1">✓ Normal</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Vibração</span>
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">2.3 mm/s</div>
                      <div className="text-xs text-green-600 mt-1">✓ Dentro do limite</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Consumo</span>
                        <Zap className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold">8.5 kW</div>
                      <div className="text-xs text-green-600 mt-1">✓ Eficiente</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center - 3D Visualization */}
                <div className="col-span-2">
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
                        <Machine3DViewer 
                          machineName={selectedMachine.name}
                          machineType={selectedMachine.type}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Analysis */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        Análise IA
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Todos os sistemas operacionais</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Componentes críticos verificados</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Operando em condições ideais</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-blue-600" />
                        Próximas Ações
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                          <p className="font-medium">Manutenção em 30 dias</p>
                          <p className="text-muted-foreground mt-1">Lubrificação dos rolamentos</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                          <p className="font-medium">Calibração em 15 dias</p>
                          <p className="text-muted-foreground mt-1">Sensores de temperatura</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
