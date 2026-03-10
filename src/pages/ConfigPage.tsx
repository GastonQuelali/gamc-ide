import { useState } from "react"
import { User, Bell, Palette, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useTheme } from "@/hooks/useTheme"
import Sidebar from "@/components/Sidebar"

export default function ConfigPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    telefono: "",
    cargo: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    predios: true,
    reportes: false,
  })

  const [language, setLanguage] = useState("es")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Sidebar>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil de Usuario
              </CardTitle>
              <CardDescription>Información personal y credenciales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={profile.telefono}
                    onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                    placeholder="+591 70000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={profile.cargo}
                    onChange={(e) => setProfile({ ...profile, cargo: e.target.value })}
                    placeholder="Técnico Catastral"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
              <CardDescription>Personaliza la interfaz de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre tema claro y oscuro
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecciona el idioma de la interfaz
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage} className="w-40">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="que">Quechua</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>Configura cómo recibes notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por correo</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones por email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de predios</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones sobre cambios en predios
                  </p>
                </div>
                <Switch
                  checked={notifications.predios}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, predios: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reportes automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe reportes semanales
                  </p>
                </div>
                <Switch
                  checked={notifications.reportes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, reportes: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>Configuración de seguridad de la cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cambiar contraseña</Label>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu contraseña regularmente
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Cambiar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {saved ? "Guardado!" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}
