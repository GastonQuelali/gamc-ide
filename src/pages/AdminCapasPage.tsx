import { useState, useEffect } from "react"
import { Copy, Check, Search, Filter, MapPin, Wifi, WifiOff, LayoutGrid, List, Loader2, Save, X, Settings, RefreshCw, Upload, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { capasAdminApi, type CapaGIS, type CapaGISUpdate } from "@/lib/api"
import { usePagination } from "@/hooks/usePagination"
import { useFilters, type FilterConfig } from "@/hooks/useFilters"

export default function AdminCapasPage() {
  const [capas, setCapas] = useState<CapaGIS[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedCapa, setSelectedCapa] = useState<CapaGIS | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState<CapaGISUpdate>({})
  const [saving, setSaving] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const filterConfigs: FilterConfig[] = [
    { key: "search", type: "search", label: "Buscar" },
    { key: "filterEstado", type: "select", label: "Estado" },
    { key: "filterActiva", type: "select", label: "Activa" },
    { key: "filterPublica", type: "select", label: "Pública" },
    { key: "filterTipo", type: "select", label: "Tipo" },
  ]

  const { filterValues, setFilter, filteredData } = useFilters<CapaGIS>({
    data: capas,
    filters: filterConfigs,
  })

  const searchTerm = String(filterValues.search || "")
  const filterEstado = String(filterValues.filterEstado || "all")
  const filterActiva = String(filterValues.filterActiva || "all")
  const filterPublica = String(filterValues.filterPublica || "all")
  const filterTipo = String(filterValues.filterTipo || "all")

  const {
    paginatedItems: paginatedCapas,
    currentPage,
    totalPages,
    startIndex,
    setPage,
    setItemsPerPage,
    itemsPerPage,
    canGoNext,
    canGoPrev,
  } = usePagination(filteredData, { initialItemsPerPage: 50 })

  useEffect(() => {
    loadCapas()
  }, [])

  const loadCapas = async () => {
    setLoading(true)
    setError(null)
    try {
      const capasData = await capasAdminApi.getAll()
      setCapas(capasData)
    } catch (err) {
      setError("Error al cargar las capas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      await capasAdminApi.import()
      await loadCapas()
      setShowImportModal(false)
    } catch (err) {
      console.error("Error importing capas:", err)
    } finally {
      setImporting(false)
    }
  }

  const handleEdit = (capa: CapaGIS) => {
    setSelectedCapa(capa)
    setEditData({
      nombre: capa.nombre,
      descripcion: capa.descripcion,
      activa: capa.activa,
      publica: capa.publica,
      visible: capa.visible,
      opacidad: capa.opacity,
      orden: capa.orden,
      grupo: capa.grupo,
    })
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if (!selectedCapa) return
    setSaving(true)
    try {
      await capasAdminApi.update(selectedCapa.id, editData)
      await loadCapas()
      setShowEditModal(false)
      setSelectedCapa(null)
    } catch (err) {
      console.error("Error saving capa:", err)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getEstado = (capa: CapaGIS) => {
    if (!capa.activa) return "offline"
    if (capa.publica) return "online"
    return "mantenimiento"
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "online": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "offline": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "mantenimiento": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "online": return <Wifi className="h-3 w-3" />
      case "offline": return <WifiOff className="h-3 w-3" />
      case "mantenimiento": return <MapPin className="h-3 w-3" />
      default: return null
    }
  }

  const getTipoColor = (tipo: string | null) => {
    switch (tipo) {
      case "Feature Layer": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Map Image": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Tile Layer": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Administración de Capas</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar de ArcGIS
            </Button>
            <Button variant="outline" onClick={loadCapas}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        <Card className="mb-4 p-4 bg-blue-50 dark:bg-blue-950">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">{capas.length}</span> capas en base de datos
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" style={{ marginTop: '0.5rem' }} />
                <Input
                  placeholder="Buscar capa..."
                  value={searchTerm}
                  onChange={(e) => { setFilter("search", e.target.value) }}
                  className="pl-9"
                />
              </div>
              <Select value={filterEstado} onValueChange={(v) => setFilter("filterEstado", v)}>
                <option value="all">Estado: Todos</option>
                <option value="online">Estado: Online</option>
                <option value="offline">Estado: Offline</option>
                <option value="mantenimiento">Estado: En revisión</option>
              </Select>
              <Select value={filterActiva} onValueChange={(v) => setFilter("filterActiva", v)}>
                <option value="all">Activa: Todas</option>
                <option value="yes">Activa: Sí</option>
                <option value="no">Activa: No</option>
              </Select>
              <Select value={filterPublica} onValueChange={(v) => setFilter("filterPublica", v)}>
                <option value="all">Pública: Todas</option>
                <option value="yes">Pública: Sí</option>
                <option value="no">Pública: No</option>
              </Select>
              <Select value={filterTipo} onValueChange={(v) => setFilter("filterTipo", v)}>
                <option value="all">Tipo: Todos</option>
                <option value="Feature Layer">Feature Layer</option>
                <option value="Map Image">Map Image</option>
                <option value="Tile Layer">Tile Layer</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Vista:</span>
                  <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Mostrar:</span>
                  <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Select>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredData.length} capas encontradas
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cargando capas...</span>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={loadCapas}>Reintentar</Button>
              </div>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium w-16">#</th>
                      <th className="text-left p-3 font-medium">Previsualización</th>
                      <th className="text-left p-3 font-medium">Nombre / Tipo</th>
                      <th className="text-left p-3 font-medium">URL Servicio</th>
                      <th className="text-left p-3 font-medium">Estado</th>
                      <th className="text-left p-3 font-medium">Activa</th>
                      <th className="text-left p-3 font-medium">Pública</th>
                      <th className="text-left p-3 font-medium w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCapas.map((capa, index) => {
                      const estado = getEstado(capa)
                      const rowNumber = startIndex + index + 1
                      return (
                        <tr key={capa.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 text-center font-medium text-muted-foreground">{rowNumber}</td>
                          <td className="p-3">
                            <div className="w-20 h-14 rounded overflow-hidden bg-muted">
                              {capa.thumbnail_url ? (
                                <img src={capa.thumbnail_url} alt={capa.nombre} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Sin imagen</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="font-medium cursor-pointer hover:text-primary flex items-center gap-1"
                                onClick={() => window.open(capa.url_servicio, '_blank')}
                                title="Abrir en nueva pestaña"
                              >
                                {capa.nombre}
                                <ExternalLink className="h-3 w-3 opacity-50 hover:opacity-100" />
                              </div>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo_servicio)}`}>
                                {capa.tipo_servicio || "Desconocido"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <code className="text-xs bg-muted px-2 py-1 rounded max-w-[140px] truncate cursor-pointer hover:bg-muted/80" onClick={() => window.open(capa.url_servicio, '_blank')} title="Abrir URL">
                                {capa.url_servicio}
                              </code>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => copyToClipboard(capa.url_servicio, capa.id)} title="Copiar URL">
                                {copiedId === capa.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
                              {getEstadoIcon(estado)}
                              {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </span>
                          </td>
                          <td className="p-3">
                            {capa.activa ? <span className="text-green-600">Sí</span> : <span className="text-red-600">No</span>}
                          </td>
                          <td className="p-3">
                            {capa.publica ? <span className="text-green-600">Sí</span> : <span className="text-gray-500">No</span>}
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(capa)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedCapas.map((capa, index) => {
                  const estado = getEstado(capa)
                  const rowNumber = startIndex + index + 1
                  return (
                    <div key={capa.id} className="border rounded-lg overflow-hidden hover:bg-muted/50 relative">
                      <div className="absolute top-2 left-2 bg-background/80 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium z-10">
                        {rowNumber}
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80" onClick={() => handleEdit(capa)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-32 bg-muted">
                        {capa.thumbnail_url ? (
                          <img src={capa.thumbnail_url} alt={capa.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
                        )}
                      </div>
                      <div className="p-3">
                        <div 
                          className="font-medium text-sm mb-1 cursor-pointer hover:text-primary flex items-center gap-1"
                          onClick={() => window.open(capa.url_servicio, '_blank')}
                          title="Abrir en nueva pestaña"
                        >
                          {capa.nombre}
                          <ExternalLink className="h-3 w-3 opacity-50 hover:opacity-100" />
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo_servicio)}`}>
                          {capa.tipo_servicio || "Desconocido"}
                        </span>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
                            {getEstadoIcon(estado)}
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(capa.url_servicio, capa.id)} title="Copiar URL">
                              {copiedId === capa.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {filteredData.length === 0 && !loading && (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron capas con los filtros seleccionados
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} capas
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={!canGoPrev} onClick={() => setPage(currentPage - 1)}>Anterior</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button key={page} variant={currentPage === page ? "default" : "ghost"} size="sm" className="w-8" onClick={() => setPage(page)}>{page}</Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={!canGoNext} onClick={() => setPage(currentPage + 1)}>Siguiente</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {showEditModal && selectedCapa && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Editar Capa
                  <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={editData.nombre || ""} onChange={(e) => setEditData({ ...editData, nombre: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input value={editData.descripcion || ""} onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Grupo</Label>
                  <Input value={editData.grupo || ""} onChange={(e) => setEditData({ ...editData, grupo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input type="number" value={editData.orden || 0} onChange={(e) => setEditData({ ...editData, orden: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Opacidad ({editData.opacidad || 1})</Label>
                  <Input type="number" step="0.1" min="0" max="1" value={editData.opacidad || 1} onChange={(e) => setEditData({ ...editData, opacidad: Number(e.target.value) })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Activa</Label>
                  <Switch checked={editData.activa ?? false} onCheckedChange={(checked) => setEditData({ ...editData, activa: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Pública</Label>
                  <Switch checked={editData.publica ?? false} onCheckedChange={(checked) => setEditData({ ...editData, publica: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Visible</Label>
                  <Switch checked={editData.visible ?? true} onCheckedChange={(checked) => setEditData({ ...editData, visible: checked })} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                  <Button className="flex-1" onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Importar Capas de ArcGIS
                  <Button variant="ghost" size="icon" onClick={() => setShowImportModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se importarán todas las capas disponibles en ArcGIS Server.
                  Las capas se importarán como inactivas y no públicas.
                </p>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowImportModal(false)}>Cancelar</Button>
                  <Button className="flex-1" onClick={handleImport} disabled={importing}>
                    <Upload className="h-4 w-4 mr-2" />
                    {importing ? "Importando..." : "Importar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  )
}
