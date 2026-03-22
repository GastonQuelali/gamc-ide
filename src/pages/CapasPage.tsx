import { useState, useEffect } from "react"
import { Copy, Check, Search, Filter, MapPin, Wifi, WifiOff, LayoutGrid, List, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { capasVisorApi, type CapaGIS } from "@/lib/api"

export default function CapasPage() {
  const [capas, setCapas] = useState<CapaGIS[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterTipo, setFilterTipo] = useState("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  useEffect(() => {
    loadCapas()
  }, [])

  const loadCapas = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await capasVisorApi.getPublicas()
      setCapas(data)
    } catch (err) {
      setError("Error al cargar las capas")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCapas = capas.filter(capa => {
    const matchesSearch = capa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "all" || capa.tipo_servicio === filterTipo
    const matchesEstado = filterEstado === "all" || 
      (filterEstado === "online" && capa.activa) ||
      (filterEstado === "offline" && !capa.activa)
    return matchesSearch && matchesTipo && matchesEstado
  })

  const totalPages = Math.ceil(filteredCapas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCapas = filteredCapas.slice(startIndex, startIndex + itemsPerPage)

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

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Capas Geográfica</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar capa..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={(v) => { setFilterEstado(v); setCurrentPage(1) }}>
              <option value="all">Todos los estados</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="mantenimiento">En revisión</option>
            </Select>
            <Select value={filterTipo} onValueChange={(v) => { setFilterTipo(v); setCurrentPage(1) }}>
              <option value="all">Todos los tipos</option>
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
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar:</span>
                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredCapas.length} capas encontradas
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
                    <th className="text-left p-3 font-medium">Actualización</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCapas.map((capa, index) => {
                    const estado = getEstado(capa)
                    const rowNumber = startIndex + index + 1
                    return (
                      <tr key={capa.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 text-center font-medium text-muted-foreground">
                          {rowNumber}
                        </td>
                        <td className="p-3">
                          <div className="w-20 h-14 rounded overflow-hidden bg-muted">
                            {capa.thumbnail_url ? (
                              <img 
                                src={capa.thumbnail_url} 
                                alt={capa.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                Sin imagen
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{capa.nombre}</div>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo_servicio)}`}>
                            {capa.tipo_servicio || "Desconocido"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded max-w-[180px] truncate">
                              {capa.url_servicio}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 flex-shrink-0"
                              onClick={() => copyToClipboard(capa.url_servicio, capa.id)}
                            >
                              {copiedId === capa.id ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
                            {getEstadoIcon(estado)}
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground text-sm">
                          {capa.actualizado_en ? new Date(capa.actualizado_en).toLocaleDateString() : "-"}
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
                    <div className="absolute top-2 left-2 bg-background/80 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                      {rowNumber}
                    </div>
                    <div className="h-32 bg-muted">
                      {capa.thumbnail_url ? (
                        <img 
                          src={capa.thumbnail_url} 
                          alt={capa.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-medium text-sm mb-1">{capa.nombre}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo_servicio)}`}>
                        {capa.tipo_servicio || "Desconocido"}
                      </span>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
                          {getEstadoIcon(estado)}
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(capa.url_servicio, capa.id)}
                        >
                          {copiedId === capa.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filteredCapas.length === 0 && !loading && (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron capas con los filtros seleccionados
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCapas.length)} de {filteredCapas.length} capas
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
