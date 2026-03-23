import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Map, Plus, Settings, Loader2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { mapasAdminApi } from "@/lib/api"
import type { TemaMapa } from "@/types/mapa.types"

const LOCAL_MAPAS_KEY = "gamc_local_mapas"

function getLocalMapas(): TemaMapa[] {
  const stored = localStorage.getItem(LOCAL_MAPAS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveLocalMapas(mapas: TemaMapa[]) {
  localStorage.setItem(LOCAL_MAPAS_KEY, JSON.stringify(mapas))
}

export function AdminMapasPage() {
  const navigate = useNavigate()
  const [mapas, setMapas] = useState<TemaMapa[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newMapa, setNewMapa] = useState({
    nombre: "",
    slug: "",
    icono: "MapIcon",
    descripcion: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMapas()
  }, [])

  const loadMapas = async () => {
    setLoading(true)
    try {
      const apiMapas = await mapasAdminApi.getAll()
      const localMapas = getLocalMapas()
      const allMapas = [...localMapas, ...apiMapas.filter(
        (apiMapa) => !localMapas.some((local) => local.slug === apiMapa.slug)
      )]
      setMapas(allMapas)
    } catch (err) {
      console.error("Error loading mapas:", err)
      setMapas(getLocalMapas())
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActivo = async (id: number, activo: boolean) => {
    setTogglingId(id)
    const localMapas = getLocalMapas()
    const isLocal = localMapas.some((m) => m.id === id)
    
    if (isLocal) {
      const updated = localMapas.map((m) => m.id === id ? { ...m, activo: !activo } : m)
      saveLocalMapas(updated)
      setMapas(updated)
    } else {
      try {
        await mapasAdminApi.toggleActivo(id, !activo)
      } catch (err) {
        console.error("Error toggling mapa:", err)
      }
    }
    
    setMapas((prev) =>
      prev.map((m) => m.id === id ? { ...m, activo: !activo } : m)
    )
    setTogglingId(null)
  }

  const handleCreateMapa = async () => {
    if (!newMapa.nombre || !newMapa.slug) {
      setError("El nombre y slug son obligatorios")
      return
    }

    if (mapas.some((m) => m.slug === newMapa.slug)) {
      setError("Ya existe un mapa con este slug")
      return
    }

    setCreating(true)
    setError(null)

    try {
      const created = await mapasAdminApi.create({
        nombre: newMapa.nombre,
        slug: newMapa.slug,
        icono: newMapa.icono,
        descripcion: newMapa.descripcion,
        activo: true,
      })

      const localMapas = getLocalMapas()
      const updated = [...localMapas, created]
      saveLocalMapas(updated)
      
      setMapas((prev) => [...prev, created])
      setIsCreateOpen(false)
      setNewMapa({ nombre: "", slug: "", icono: "MapIcon", descripcion: "" })
      
      navigate(`/admin/mapas/${created.slug}/config`)
    } catch (err) {
      console.error("Error creating mapa:", err)
      setError("Error al crear el mapa. Intenta de nuevo.")
    } finally {
      setCreating(false)
    }
  }

  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mapas Temáticos</h1>
          <p className="text-muted-foreground">
            Gestiona los mapas temáticos disponibles en la plataforma
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Crear Nuevo Mapa
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-sm">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-sm">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-sm">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mapas.map((mapa) => (
                <tr key={mapa.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Map className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{mapa.nombre}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {mapa.descripcion}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{mapa.slug}</code>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleActivo(mapa.id, mapa.activo)}
                      disabled={togglingId === mapa.id}
                      className="flex items-center gap-2"
                    >
                      {mapa.activo ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600">Activo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Inactivo</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/mapas/${mapa.slug}/config`)}
                        className="gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Configurar Capas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/mapa/${mapa.slug}`, "_blank")}
                      >
                        Ver Mapa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {mapas.length === 0 && (
            <div className="text-center py-12">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay mapas temáticos creados</p>
              <Button className="mt-4 gap-2" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Crear el primer mapa
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Mapa</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo mapa temático. Podrás configurar las capas después.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Mapa de Zonas Verdes"
                value={newMapa.nombre}
                onChange={(e) =>
                  setNewMapa({
                    ...newMapa,
                    nombre: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="mapa-zonas-verdes"
                value={newMapa.slug}
                onChange={(e) =>
                  setNewMapa({ ...newMapa, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                }
              />
              <p className="text-xs text-muted-foreground">
                URL: /mapa/{newMapa.slug || "slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                placeholder="Breve descripción del mapa..."
                value={newMapa.descripcion}
                onChange={(e) =>
                  setNewMapa({ ...newMapa, descripcion: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMapa} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear y Configurar Capas
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
