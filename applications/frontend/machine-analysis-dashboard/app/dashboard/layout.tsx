"use client"

import React from "react"
import { CreditCard, Sun, Moon, Bell, Sparkles, Settings, Wrench, Truck, Workflow, TestTube, CalendarDays, Search, FileText } from 'lucide-react'
import { useTheme } from "@/contexts/theme-context"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ListChecks, Activity, Package, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { useState } from "react"
import { NotificationsPanel } from "@/components/notifications-panel"
import { AIAssistantPopup } from "@/components/ai-assistant-popup"
import { Badge } from "@/components/ui/badge"
import { CommandPalette } from "@/components/command-palette"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const user = {
    name: "João Silva",
    email: "joao.silva@cognitiva.com",
  }

  const navigation = [
    {
      name: "Tarefas",
      href: "/dashboard/tasks",
      icon: ListChecks,
    },
    {
      name: "Análise de Máquinas",
      href: "/dashboard/analysis",
      icon: LayoutDashboard,
    },
    {
      name: "Relatórios",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      name: "Monitoramento",
      href: "/dashboard/monitoring",
      icon: Activity,
    },
    {
      name: "Oficina Virtual",
      href: "/dashboard/workshops",
      icon: Wrench,
    },
    {
      name: "Transporte & Reboque",
      href: "/dashboard/transport",
      icon: Truck,
    },
    {
      name: "Automatizar Fluxos",
      href: "/dashboard/workflows",
      icon: Workflow,
    },
    {
      name: "Inventário",
      href: "/dashboard/inventory",
      icon: Package,
    },
    {
      name: "Diagnósticos",
      href: "/dashboard/diagnostics",
      icon: BarChart3,
    },
    {
      name: "Faturamento",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    console.log("[v0] Logout clicked (auth disabled for development)")
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 border-r border-blue-700 transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-blue-700">
            <div>
              <h1 className="text-xl font-bold text-white">Cognitiva Analytics</h1>
              <p className="text-xs text-blue-200 mt-1">Análise Preditiva</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-blue-200 hover:text-white hover:bg-blue-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-blue-100 hover:text-white hover:bg-blue-700/50",
                      isActive && "bg-blue-600 text-white hover:bg-blue-500",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-blue-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "Usuário"}</p>
                <p className="text-xs text-blue-200 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-red-500/10 border-red-400/20 hover:bg-red-500/20 text-red-300 hover:text-red-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 flex justify-center max-w-2xl mx-auto">
              <Button
                variant="outline"
                onClick={() => setCommandPaletteOpen(true)}
                className="gap-2 bg-muted/50 hover:bg-blue-600/10 hover:border-blue-500/50 w-full max-w-xl justify-start text-muted-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Buscar funcionalidades...</span>
                <kbd className="ml-auto px-2 py-0.5 bg-background border border-border rounded text-xs">
                  ⌘K
                </kbd>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative bg-transparent"
                title="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAiAssistantOpen(true)}
                className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/20 hover:from-purple-500/20 hover:to-blue-500/20"
                title="Assistente de IA"
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-transparent"
                title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AIAssistantPopup open={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  )
}
