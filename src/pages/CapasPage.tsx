import { useState } from "react"
import { Copy, Check, Search, Filter, MapPin, Wifi, WifiOff, LayoutGrid, List } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

interface Capa {
  id: number
  nombre: string
  url: string
  tipo: string
  estado: "online" | "offline" | "mantenimiento"
  thumbnail: string
  fechaActualizacion: string
}

const capasMock: Capa[] = [
  { id: 1, nombre: "Predios CBA", url: "http://192.168.105.219:6080/arcgis/rest/services/catastro/predios_cba/MapServer", tipo: "Feature Layer", estado: "online", thumbnail: "https://picsum.photos/seed/predios/150/100", fechaActualizacion: "2024-01-15" },
  { id: 2, nombre: "Manzana DB", url: "http://192.168.105.219:6080/arcgis/rest/services/catastro/manzana/MapServer", tipo: "Map Image", estado: "online", thumbnail: "https://picsum.photos/seed/manzana/150/100", fechaActualizacion: "2024-01-10" },
  { id: 3, nombre: "Vías Urbanas", url: "http://192.168.105.219:6080/arcgis/rest/services/planificacion/vias/MapServer", tipo: "Feature Layer", estado: "online", thumbnail: "https://picsum.photos/seed/vias/150/100", fechaActualizacion: "2024-01-08" },
  { id: 4, nombre: "Uso de Suelo", url: "http://192.168.105.219:6080/arcgis/rest/services/planificacion/usoSuelo/MapServer", tipo: "Map Image", estado: "online", thumbnail: "https://picsum.photos/seed/uso/150/100", fechaActualizacion: "2024-01-05" },
  { id: 5, nombre: "Imagen 2019", url: "http://192.168.105.219:6080/arcgis/rest/services/imagenes/CBA_2018500/MapServer", tipo: "Tile Layer", estado: "online", thumbnail: "https://picsum.photos/seed/img2019/150/100", fechaActualizacion: "2023-12-20" },
  { id: 6, nombre: "Imagen 2018", url: "http://192.168.105.219:6080/arcgis/rest/services/imagenes/CBA_2018500/MapServer", tipo: "Tile Layer", estado: "offline", thumbnail: "https://picsum.photos/seed/img2018/150/100", fechaActualizacion: "2023-12-15" },
  { id: 7, nombre: "Límites Catastrales", url: "http://192.168.105.219:6080/arcgis/rest/services/catastro/limites/MapServer", tipo: "Feature Layer", estado: "mantenimiento", thumbnail: "https://picsum.photos/seed/limites/150/100", fechaActualizacion: "2023-11-30" },
  { id: 8, nombre: "Edificaciones", url: "http://192.168.105.219:6080/arcgis/rest/services/catastro/edificaciones/MapServer", tipo: "Feature Layer", estado: "online", thumbnail: "https://picsum.photos/seed/edif/150/100", fechaActualizacion: "2023-11-25" },
  { id: 9, nombre: "Zonas Verdes", url: "http://192.168.105.219:6080/arcgis/rest/services/medioambiente/zonasVerdes/MapServer", tipo: "Map Image", estado: "online", thumbnail: "https://picsum.photos/seed/zonas/150/100", fechaActualizacion: "2023-11-20" },
  { id: 10, nombre: "Red Vial", url: "http://192.168.105.219:6080/arcgis/rest/services/infraestructura/redVial/MapServer", tipo: "Feature Layer", estado: "offline", thumbnail: "https://picsum.photos/seed/redvial/150/100", fechaActualizacion: "2023-11-15" },
  { id: 11, nombre: "Servicios Públicos", url: "http://192.168.105.219:6080/arcgis/rest/services/servicios/serviciosPublicos/MapServer", tipo: "Feature Layer", estado: "online", thumbnail: "https://picsum.photos/seed/servicios/150/100", fechaActualizacion: "2023-11-10" },
  { id: 12, nombre: "Catastro Rural", url: "http://192.168.105.219:6080/arcgis/rest/services/catastro/rural/MapServer", tipo: "Map Image", estado: "mantenimiento", thumbnail: "https://picsum.photos/seed/rural/150/100", fechaActualizacion: "2023-10-30" },
]

const ITEMS_PER_PAGE = 6

export default function CapasPage() {
  const [capas] = useState<Capa[]>(capasMock)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterTipo, setFilterTipo] = useState("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredCapas = capas.filter(capa => {
    const matchesSearch = capa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "all" || capa.estado === filterEstado
    const matchesTipo = filterTipo === "all" || capa.tipo === filterTipo
    return matchesSearch && matchesEstado && matchesTipo
  })

  const totalPages = Math.ceil(filteredCapas.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCapas = filteredCapas.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Feature Layer": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Map Image": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Tile Layer": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Capas Geográficas</h1>

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
                <option value="mantenimiento">Mantenimiento</option>
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
              <span className="text-sm text-muted-foreground">
                {filteredCapas.length} capas encontradas
              </span>
            </div>

            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Previsualización</th>
                      <th className="text-left p-3 font-medium">Nombre / Tipo</th>
                      <th className="text-left p-3 font-medium">URL Servicio</th>
                      <th className="text-left p-3 font-medium">Estado</th>
                      <th className="text-left p-3 font-medium">Actualización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCapas.map((capa) => (
                      <tr key={capa.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="w-20 h-14 rounded overflow-hidden bg-muted">
                            <img 
                              src={capa.thumbnail} 
                              alt={capa.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{capa.nombre}</div>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo)}`}>
                            {capa.tipo}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded max-w-[180px] truncate">
                              {capa.url}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 flex-shrink-0"
                              onClick={() => copyToClipboard(capa.url, capa.id)}
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
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(capa.estado)}`}>
                            {getEstadoIcon(capa.estado)}
                            {capa.estado.charAt(0).toUpperCase() + capa.estado.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground text-sm">
                          {capa.fechaActualizacion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCapas.map((capa) => (
                  <div key={capa.id} className="border rounded-lg overflow-hidden hover:bg-muted/50">
                    <div className="h-32 bg-muted">
                      <img 
                        src={capa.thumbnail} 
                        alt={capa.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="font-medium text-sm mb-1">{capa.nombre}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTipoColor(capa.tipo)}`}>
                        {capa.tipo}
                      </span>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(capa.estado)}`}>
                          {getEstadoIcon(capa.estado)}
                          {capa.estado.charAt(0).toUpperCase() + capa.estado.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(capa.url, capa.id)}
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
                ))}
              </div>
            )}

            {filteredCapas.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron capas con los filtros seleccionados
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCapas.length)} de {filteredCapas.length} capas
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
    </Sidebar>
  )
}
