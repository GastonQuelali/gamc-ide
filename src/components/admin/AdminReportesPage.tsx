import { useState, useEffect } from "react"
import { FileText, Download, RefreshCw, Loader2, Users, Layers, Map } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usuariosApi, capasAdminApi, mapasAdminApi, type Usuario } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface ReporteEstadistica {
  label: string
  valor: number | string
  icono: React.ReactNode
  color: string
}

export function AdminReportesPage() {
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [capasCount, setCapasCount] = useState(0)
  const [mapasCount, setMapasCount] = useState(0)
  const [capasActivas, setCapasActivas] = useState(0)
  const [capasPublicas, setCapasPublicas] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usuariosData, capasData, mapasData] = await Promise.all([
        usuariosApi.getAll().catch(() => []),
        capasAdminApi.getAll().catch(() => []),
        mapasAdminApi.getAll().catch(() => []),
      ])

      setUsuarios(usuariosData)
      setCapasCount(capasData.length)
      setMapasCount(mapasData.length)
      setCapasActivas(capasData.filter((c: { activa: boolean }) => c.activa).length)
      setCapasPublicas(capasData.filter((c: { publica: boolean }) => c.publica).length)
    } catch (err) {
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const usuariosPorRol = usuarios.reduce((acc, user) => {
    acc[user.rol] = (acc[user.rol] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const usuariosActivos = usuarios.filter((u) => u.activo).length

  const estadisticas: ReporteEstadistica[] = [
    {
      label: "Total Usuarios",
      valor: usuarios.length,
      icono: <Users className="h-6 w-6" />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Usuarios Activos",
      valor: usuariosActivos,
      icono: <Users className="h-6 w-6" />,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Total Capas",
      valor: capasCount,
      icono: <Layers className="h-6 w-6" />,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Capas Activas",
      valor: capasActivas,
      icono: <Layers className="h-6 w-6" />,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Capas Públicas",
      valor: capasPublicas,
      icono: <Layers className="h-6 w-6" />,
      color: "bg-cyan-500/10 text-cyan-600",
    },
    {
      label: "Mapas Temáticos",
      valor: mapasCount,
      icono: <Map className="h-6 w-6" />,
      color: "bg-orange-500/10 text-orange-600",
    },
  ]

  const handleExportarCSV = (tipo: string) => {
    let csv = ""
    let filename = ""

    if (tipo === "usuarios") {
      csv = "ID,Nombre,Email,Rol,Activo,Último Login\n"
      csv += usuarios
        .map(
          (u) =>
            `${u.id},"${u.nombre} ${u.apellido || ""}",${u.email || ""},${u.rol},${u.activo},${u.ultimo_login || "Nunca"}`
        )
        .join("\n")
      filename = "reporte_usuarios.csv"
    } else if (tipo === "capas") {
      csv = "Nombre,URL,Activa,Pública,Visible,Grupo\n"
      filename = "reporte_capas.csv"
    }

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Estadísticas y reportes del sistema
          </p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {estadisticas.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.valor}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      {stat.icono}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Usuarios por Rol</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportarCSV("usuarios")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </CardTitle>
                <CardDescription>Distribución de usuarios según su rol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(usuariosPorRol).map(([rol, count]) => (
                    <div key={rol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            rol === "admin"
                              ? "destructive"
                              : rol === "supervisor"
                                ? "default"
                                : rol === "inspector"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {rol}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(count / usuarios.length) * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Estado de Capas</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportarCSV("capas")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </CardTitle>
                <CardDescription>Resumen del estado de las capas GIS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span className="text-sm font-medium">Activas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{
                            width: capasCount > 0 ? `${(capasActivas / capasCount) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="font-semibold">{capasActivas}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Inactivas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-500"
                          style={{
                            width: capasCount > 0 ? `${((capasCount - capasActivas) / capasCount) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="font-semibold">{capasCount - capasActivas}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                    <span className="text-sm font-medium">Públicas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-cyan-200 dark:bg-cyan-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-600"
                          style={{
                            width: capasCount > 0 ? `${(capasPublicas / capasCount) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="font-semibold">{capasPublicas}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <span className="text-sm font-medium">Privadas</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600"
                          style={{
                            width: capasCount > 0 ? `${((capasCount - capasPublicas) / capasCount) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="font-semibold">{capasCount - capasPublicas}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Exportar Reportes
                </CardTitle>
                <CardDescription>
                  Genera archivos CSV con los datos del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleExportarCSV("usuarios")}
                  >
                    <Users className="h-6 w-6" />
                    <span>Reporte de Usuarios</span>
                    <span className="text-xs text-muted-foreground">CSV</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleExportarCSV("capas")}
                  >
                    <Layers className="h-6 w-6" />
                    <span>Reporte de Capas</span>
                    <span className="text-xs text-muted-foreground">CSV</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                    onClick={() => handleExportarCSV("mapas")}
                  >
                    <Map className="h-6 w-6" />
                    <span>Reporte de Mapas</span>
                    <span className="text-xs text-muted-foreground">CSV</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
