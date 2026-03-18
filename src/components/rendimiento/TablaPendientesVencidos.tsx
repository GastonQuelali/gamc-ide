import { useState, useMemo } from "react"
import { AlertCircle, Clock, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { TramitePendiente } from "@/types/rendimiento"

interface TablaPendientesVencidosProps {
  data: TramitePendiente[]
  loading: boolean
}

const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const formatFecha = (iso: string | null): string => {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const limpiarTipo = (s: string): string => {
  return s.replace(/\r\n/g, " ").trim()
}

export function TablaPendientesVencidos({ data, loading }: TablaPendientesVencidosProps) {
  const [query, setQuery] = useState("")

  const filteredData = useMemo(() => {
    if (!query) return data
    const lowerQuery = query.toLowerCase()
    return data.filter(
      (t) =>
        toTitleCase(t.nombre_funcionario).toLowerCase().includes(lowerQuery) ||
        t.solicitante.toLowerCase().includes(lowerQuery)
    )
  }, [data, query])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.dias_en_espera - a.dias_en_espera)
  }, [filteredData])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trámites Pendientes y Vencidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trámites Pendientes y Vencidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por funcionario o solicitante..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Nro Trámite</th>
                <th className="text-left p-2 font-medium">Funcionario</th>
                <th className="text-left p-2 font-medium">Unidad</th>
                <th className="text-left p-2 font-medium">Tipo</th>
                <th className="text-left p-2 font-medium">Solicitante</th>
                <th className="text-left p-2 font-medium">Fecha ingreso</th>
                <th className="text-left p-2 font-medium">Días en espera</th>
                <th className="text-left p-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    {query ? "No se encontraron resultados" : "No hay trámites pendientes"}
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.id_tramite} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono">{item.nro_tramite}</td>
                    <td className="p-2 font-medium">{toTitleCase(item.nombre_funcionario)}</td>
                    <td className="p-2 text-muted-foreground">{item.unidad}</td>
                    <td className="p-2 text-muted-foreground max-w-[200px] truncate" title={item.tipo_tramite}>
                      {limpiarTipo(item.tipo_tramite).substring(0, 30)}
                    </td>
                    <td className="p-2">{item.solicitante}</td>
                    <td className="p-2">{formatFecha(item.fecha_ingreso)}</td>
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.es_vencido
                            ? "bg-red-100 text-red-700"
                            : item.dias_en_espera >= 20
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.dias_en_espera}
                      </span>
                    </td>
                    <td className="p-2">
                      {item.es_vencido ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertCircle className="h-3 w-3" />
                          Vencido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <Clock className="h-3 w-3" />
                          En espera
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
