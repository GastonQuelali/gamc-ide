import { Users } from "lucide-react"

export function AdminUsuariosPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Próximamente</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            La gestión de usuarios estará disponible en la próxima versión del sistema.
            Los endpoints del backend están en desarrollo.
          </p>
        </div>
      </div>
    </div>
  )
}
