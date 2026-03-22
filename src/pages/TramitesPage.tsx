import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useRef } from "react"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useTramites } from "@/hooks/useTramites"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiltrosTramites } from "@/components/tramites/FiltrosTramites"
import { GraficoTiposTramites } from "@/components/tramites/GraficoTiposTramites"
import { GraficoComunasTramites } from "@/components/tramites/GraficoComunasTramites"
import { TablaTramites } from "@/components/tramites/TablaTramites"
import { PaginadorTramites } from "@/components/tramites/PaginadorTramites"

export default function TramitesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialized = useRef(false)

  const {
    tramites,
    total,
    paginas,
    pagina,
    filtros,
    filtrosDisponibles,
    resumen,
    loading,
    error,
    setFiltros,
    setPagina,
    limpiarFiltros,
  } = useTramites()

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const gestion = Number(searchParams.get("gestion")) || new Date().getFullYear()
    const mes = searchParams.get("mes") ? Number(searchParams.get("mes")) : undefined
    const tipo = searchParams.get("tipo") || undefined
    const comuna = searchParams.get("comuna") || undefined
    const estado = searchParams.get("estado") as "en_tramite" | "concluido" || undefined

    setFiltros({ gestion, mes, tipo, comuna, estado })
  }, [])

  const handleTipoClick = (newTipo: string) => {
    setFiltros({ tipo: newTipo })
  }

  const handleComunaClick = (newComuna: string) => {
    setFiltros({ comuna: newComuna })
  }

  const handlePorPaginaChange = (porPagina: number) => {
    setFiltros({ por_pagina: porPagina, pagina: 1 })
  }

  const handleLimpiar = () => {
    limpiarFiltros()
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Trámites</h1>
          <p className="text-muted-foreground">
            Total: {total.toLocaleString("es-BO")} trámites
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <FiltrosTramites
            filtros={filtros}
            filtrosDisponibles={filtrosDisponibles}
            onFilterChange={setFiltros}
            onLimpiar={handleLimpiar}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoTiposTramites resumen={resumen} onTipoClick={handleTipoClick} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por comuna</CardTitle>
          </CardHeader>
          <CardContent>
            <GraficoComunasTramites resumen={resumen} onComunaClick={handleComunaClick} />
          </CardContent>
        </Card>
      </div>

      <TablaTramites tramites={tramites} loading={loading} />

      <div className="mt-4">
        <PaginadorTramites
          pagina={pagina}
          paginas={paginas}
          total={total}
          porPagina={filtros.por_pagina || 20}
          onPaginaChange={setPagina}
          onPorPaginaChange={handlePorPaginaChange}
        />
      </div>
    </div>
  )
}
