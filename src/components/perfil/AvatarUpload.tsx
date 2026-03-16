import { useState, useRef } from "react"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  avatarUrl: string | null
  nombre: string
  uploading?: boolean
  onUpload: (file: File) => void
}

const getInitials = (nombre: string): string => {
  if (!nombre) return "?"
  const parts = nombre.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function AvatarUpload({ avatarUrl, nombre, uploading, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5 MB

    if (!allowedTypes.includes(file.type)) {
      setError("Formato no permitido. Usa: jpg, jpeg, png, webp")
      return false
    }

    if (file.size > maxSize) {
      setError("El archivo supera el tamaño máximo de 5 MB")
      return false
    }

    setError(null)
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!validateFile(file)) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    onUpload(file)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const displayUrl = preview || avatarUrl

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-muted"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-muted">
            <span className="text-4xl font-bold text-muted-foreground">
              {getInitials(nombre)}
            </span>
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Cambiar foto
          </>
        )}
      </Button>
    </div>
  )
}
