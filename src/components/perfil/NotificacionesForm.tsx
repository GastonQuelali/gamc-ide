import { Bell, Mail, Phone, Newspaper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { Perfil, PerfilUpdate } from "@/types/perfil"

interface NotificacionesFormProps {
  perfil: Perfil
  onChange: (data: Partial<PerfilUpdate>) => void
  disabled?: boolean
}

export function NotificacionesForm({ perfil, onChange, disabled }: NotificacionesFormProps) {
  const handleToggle = (key: keyof PerfilUpdate) => {
    onChange({ [key]: !perfil[key as keyof Perfil] })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Notificaciones push</p>
              <p className="text-sm text-muted-foreground">Recibe alertas en el navegador</p>
            </div>
          </div>
          <Switch
            checked={perfil.notif_push}
            onCheckedChange={() => handleToggle("notif_push")}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Notificaciones por email</p>
              <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
            </div>
          </div>
          <Switch
            checked={perfil.notif_email}
            onCheckedChange={() => handleToggle("notif_email")}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">Recibe mensajes por WhatsApp</p>
            </div>
          </div>
          <Switch
            checked={perfil.notif_whatsapp}
            onCheckedChange={() => handleToggle("notif_whatsapp")}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Boletín informativo</p>
              <p className="text-sm text-muted-foreground">Recibe noticias y actualizaciones</p>
            </div>
          </div>
          <Switch
            checked={perfil.notif_newsletter}
            onCheckedChange={() => handleToggle("notif_newsletter")}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  )
}
