import { Navigate } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { UserRole } from "@/types/kpi"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (roles.length > 0 && user.role && !roles.includes(user.role as UserRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">
            No tienes permisos para acceder a esta página. Contacta al administrador si crees que esto es un error.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>
            <Button onClick={() => window.location.href = "/dashboard"}>
              Ir al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
