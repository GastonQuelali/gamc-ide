import { useState, useCallback } from 'react'

interface UseClipboardOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { onSuccess, onError, timeout = 2000 } = options

  const copy = useCallback(async (text: string, id: number) => {
    try {
      // Método 1: Clipboard API moderna
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setCopiedId(id)
        onSuccess?.()
        setTimeout(() => setCopiedId(null), timeout)
        return true
      }
      
      // Método 2: Fallback execCommand (para navegadores antiguos)
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
        setCopiedId(id)
        onSuccess?.()
        setTimeout(() => setCopiedId(null), timeout)
        return true
      } else {
        throw new Error('execCommand failed')
      }
    } catch (error) {
      console.error('Error al copiar:', error)
      onError?.(error as Error)
      // Fallback visual: prompt con la URL
      prompt('Copia manualmente la URL:', text)
      return false
    }
  }, [onSuccess, onError, timeout])

  return { copy, copiedId }
}
