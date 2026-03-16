import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Perfil, PerfilUpdate } from "@/types/perfil"

interface DatosPersonalesFormProps {
  perfil: Perfil
  onChange: (data: Partial<PerfilUpdate>) => void
  disabled?: boolean
}

const GENERO_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
  { value: "prefiero_no_decir", label: "Prefiero no decir" },
]

export function DatosPersonalesForm({ perfil, onChange, disabled }: DatosPersonalesFormProps) {
  const handleChange = (key: keyof PerfilUpdate, value: string) => {
    onChange({ [key]: value || undefined })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={perfil.nombre || ""}
              onChange={(e) => handleChange("nombre", e.target.value)}
              disabled={disabled}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              value={perfil.apellido || ""}
              onChange={(e) => handleChange("apellido", e.target.value)}
              disabled={disabled}
              placeholder="Tu apellido"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={perfil.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={disabled}
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={perfil.telefono || ""}
              onChange={(e) => handleChange("telefono", e.target.value)}
              disabled={disabled}
              placeholder="591-70000000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              value={perfil.fecha_nacimiento || ""}
              onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genero">Género</Label>
            <select
              id="genero"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={perfil.genero || ""}
              onChange={(e) => handleChange("genero", e.target.value)}
              disabled={disabled}
            >
              <option value="">Seleccionar...</option>
              {GENERO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
