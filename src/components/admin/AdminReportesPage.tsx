import { BarChart3 } from "lucide-react"

export function AdminReportesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Visualiza y genera reportes del sistema
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Próximamente</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Los reportes estarán disponibles en la próxima versión del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
