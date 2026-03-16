import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Perfil, PerfilUpdate, Direccion } from "@/types/perfil"

interface DireccionFormProps {
  perfil: Perfil
  onChange: (data: Partial<PerfilUpdate>) => void
  disabled?: boolean
}

export function DireccionForm({ perfil, onChange, disabled }: DireccionFormProps) {
  const direccion = perfil.direccion || {}

  const handleChange = (key: keyof Direccion, value: string) => {
    const nuevaDireccion: Direccion = {
      ...direccion,
      [key]: value || undefined,
    }
    onChange({ direccion: nuevaDireccion })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="calle">Calle / Avenida</Label>
          <Input
            id="calle"
            value={direccion.calle || ""}
            onChange={(e) => handleChange("calle", e.target.value)}
            disabled={disabled}
            placeholder="Av. Principal"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barrio">Barrio</Label>
            <Input
              id="barrio"
              value={direccion.barrio || ""}
              onChange={(e) => handleChange("barrio", e.target.value)}
              disabled={disabled}
              placeholder="Centro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              value={direccion.ciudad || ""}
              onChange={(e) => handleChange("ciudad", e.target.value)}
              disabled={disabled}
              placeholder="Cochabamba"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zona">Zona</Label>
            <Input
              id="zona"
              value={direccion.zona || ""}
              onChange={(e) => handleChange("zona", e.target.value)}
              disabled={disabled}
              placeholder="Zona Central"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referencia">Referencia</Label>
            <Input
              id="referencia"
              value={direccion.referencia || ""}
              onChange={(e) => handleChange("referencia", e.target.value)}
              disabled={disabled}
              placeholder="Frente al parque"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
