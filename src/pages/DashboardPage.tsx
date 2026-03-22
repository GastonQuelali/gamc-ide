import { Construction } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <Construction className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground max-w-md">
          Esta sección está en construcción. Próximamente podrás ver aquí un resumen de tu actividad.
        </p>
      </div>
    </div>
  )
}
