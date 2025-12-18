"use client"

import { Home, MapIcon, Satellite, Database, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: MapIcon, label: "Weather Maps" },
  { icon: Satellite, label: "Satellite Images" },
  { icon: Database, label: "Data Archive" },
  { icon: Info, label: "About" },
  { icon: Phone, label: "Contact" },
]

export function Navigation() {
  return (
    <nav className="bg-secondary border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Button key={item.label} variant={item.active ? "default" : "ghost"} size="sm" className="shrink-0 gap-2">
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
