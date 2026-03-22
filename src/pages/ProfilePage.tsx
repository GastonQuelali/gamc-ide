import { useState, useEffect } from "react"
import { User, Shield, Clock, Loader2, Save, AlertCircle } from "lucide-react"
import { usePerfil } from "@/hooks/usePerfil"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AvatarUpload } from "@/components/perfil/AvatarUpload"
import { DatosPersonalesForm } from "@/components/perfil/DatosPersonalesForm"
import { DireccionForm } from "@/components/perfil/DireccionForm"
import { NotificacionesForm } from "@/components/perfil/NotificacionesForm"
import type { PerfilUpdate } from "@/types/perfil"

export default function ProfilePage() {
  const { perfil, loading, error, updatePerfil, uploadAvatar } = usePerfil()
  const [activeTab, setActiveTab] = useState("datos")
  const [pendingChanges, setPendingChanges] = useState<PerfilUpdate>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setPendingChanges({})
  }, [perfil])

  const handleFormChange = (changes: Partial<PerfilUpdate>) => {
    setPendingChanges((prev) => ({ ...prev, ...changes }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      await updatePerfil(pendingChanges)
      setPendingChanges({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      setSaveError("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatar(file)
    } catch {
      // Error is handled in the hook
    }
  }

  const formatFecha = (iso: string | null): string => {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getNombreCompleto = (): string => {
    if (!perfil) return ""
    return [perfil.nombre, perfil.apellido].filter(Boolean).join(" ")
  }

  if (error && !perfil) {
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

  if (loading && !perfil) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!perfil) return null

  const hasChanges = Object.keys(pendingChanges).length > 0

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <AvatarUpload
                avatarUrl={perfil.avatar_url}
                nombre={getNombreCompleto()}
                uploading={loading}
                onUpload={handleAvatarUpload}
              />

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">{getNombreCompleto()}</h2>
                <p className="text-muted-foreground capitalize">{perfil.rol}</p>
                {perfil.area && (
                  <p className="text-sm text-muted-foreground">{perfil.area}</p>
                )}
              </div>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{perfil.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Rol:</span>
                  <span className="capitalize">{perfil.rol}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Último acceso:</span>
                </div>
                <p className="text-xs text-muted-foreground pl-7">
                  {formatFecha(perfil.ultimo_login)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="datos">Datos personales</TabsTrigger>
                <TabsTrigger value="direccion">Dirección</TabsTrigger>
                <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
              </TabsList>

              {hasChanges && (
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-sm text-green-600">Guardado</span>
                  )}
                  {saveError && (
                    <span className="text-sm text-destructive">{saveError}</span>
                  )}
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="datos">
              <DatosPersonalesForm
                perfil={perfil}
                onChange={handleFormChange}
                disabled={loading}
              />
            </TabsContent>

            <TabsContent value="direccion">
              <DireccionForm
                perfil={perfil}
                onChange={handleFormChange}
                disabled={loading}
              />
            </TabsContent>

            <TabsContent value="preferencias">
              <NotificacionesForm
                perfil={perfil}
                onChange={handleFormChange}
                disabled={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
