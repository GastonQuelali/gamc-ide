import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  Layers,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMapaConfig } from "@/hooks/useMapaConfig"
import type { TemaMapa } from "@/types/mapa.types"

const ICONOS_DISPONIBLES: Record<string, React.ComponentType<{ className?: string }>> = {
  MapIcon,
  Layers,
}

function TemaItem({ tema, isActive, onClick }: { tema: TemaMapa; isActive: boolean; onClick: () => void }) {
  const IconComponent = ICONOS_DISPONIBLES[tema.icono] || MapIcon

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <IconComponent className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium truncate">{tema.nombre}</span>
    </button>
  )
}

export function SidebarTemas() {
  const navigate = useNavigate()
  const params = useParams()
  const slugActual = params.slug || ""
  const { temas, loading } = useMapaConfig()
  const [collapsed, setCollapsed] = useState(false)

  const handleTemaClick = (slug: string) => {
    navigate(`/mapa/${slug}`)
  }

  return (
    <div
      className={`relative flex flex-col bg-card border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-semibold text-sm">Mapas Temáticos</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : temas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {collapsed ? "" : "No hay mapas disponibles"}
          </p>
        ) : (
          <div className="space-y-1">
            {temas.map((tema) => (
              <TemaItem
                key={tema.id}
                tema={tema}
                isActive={slugActual === tema.slug}
                onClick={() => handleTemaClick(tema.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
