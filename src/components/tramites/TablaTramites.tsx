import { useState, Fragment } from "react"
import { Clock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Tramite } from "@/types/tramites"

interface TablaTramitesProps {
  tramites: Tramite[]
  loading?: boolean
}

const formatFecha = (iso: string | null): string => {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const formatNum = (n: number | null): string => {
  if (n === null || n === undefined) return "—"
  return n.toLocaleString("es-BO")
}

const formatNroTramite = (nroTramite: number, gestion: number): string => {
  const str = String(nroTramite)
  const numStr = str.slice(-6).padStart(6, "0")
  return `${numStr} / ${gestion}`
}

export function TablaTramites({ tramites, loading }: TablaTramitesProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 border-b bg-muted/50" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tramites.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No se encontraron trámites con los filtros seleccionados
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-sm w-8"></th>
              <th className="text-left p-3 font-medium text-sm">Nro Trámite</th>
              <th className="text-left p-3 font-medium text-sm">Tipo</th>
              <th className="text-left p-3 font-medium text-sm">Solicitante</th>
              <th className="text-left p-3 font-medium text-sm">CI</th>
              <th className="text-left p-3 font-medium text-sm">Fecha</th>
              <th className="text-left p-3 font-medium text-sm">Estado</th>
              <th className="text-left p-3 font-medium text-sm">Comuna</th>
              <th className="text-left p-3 font-medium text-sm">Fojas</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map((tramite) => (
              <Fragment key={tramite.idTramite}>
                <tr
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === tramite.idTramite ? null : tramite.idTramite)}
                >
                  <td className="p-3">
                    {expandedRow === tramite.idTramite ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="p-3 font-mono text-sm">
                    {formatNroTramite(tramite.nroTramite, tramite.gestion)}
                  </td>
                  <td className="p-3 text-sm max-w-[200px] truncate" title={tramite.tramitetipo || ""}>
                    {tramite.tramitetipo?.replace(/\r\n/g, " ").trim() || "—"}
                  </td>
                  <td className="p-3 text-sm">{tramite.solicitante || "—"}</td>
                  <td className="p-3 text-sm font-mono">{tramite.docSolicitante || "—"}</td>
                  <td className="p-3 text-sm">{formatFecha(tramite.fechaIngreso)}</td>
                  <td className="p-3">
                    {tramite.estado === "concluido" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3" />
                        Concluido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Clock className="h-3 w-3" />
                        En trámite
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm">{tramite.comuna || "—"}</td>
                  <td className="p-3 text-sm">{formatNum(tramite.nroFojas)}</td>
                </tr>
                {expandedRow === tramite.idTramite && (
                  <tr className="bg-muted/30">
                    <td colSpan={9} className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo detalle:</span>
                          <p className="font-medium">{tramite.tipotramite?.replace(/\r\n/g, " ").trim() || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Propietario:</span>
                          <p className="font-medium">{tramite.propietario || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CI Propietario:</span>
                          <p className="font-medium font-mono">{tramite.docPropietario || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fecha salida:</span>
                          <p className="font-medium">{formatFecha(tramite.fechaSalida)}</p>
                        </div>
                        {tramite.observacion && (
                          <div className="col-span-2 md:col-span-4">
                            <span className="text-muted-foreground">Observación:</span>
                            <p className="font-medium">{tramite.observacion}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
