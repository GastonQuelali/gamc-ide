import { useState } from "react"
import type { ReactNode } from "react"
import type { User } from "./authConfig"
import { AuthContext } from "./AuthContext"
import { authApi, setToken, removeToken, type TokenResponse } from "@/lib/api"
import { getCurrentUser, setCurrentUser } from "./authConfig"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response: TokenResponse = await authApi.login({
        nombre: username,
        clave: password,
      })
      
      setToken(response.access_token)
      
      const userData: User = {
        id: response.usuario.persona_id,
        name: response.usuario.nombre,
        email: response.usuario.email || username,
        role: response.usuario.rol,
      }
      
      setUser(userData)
      setCurrentUser(userData)
      setIsLoading(false)
      return true
    } catch {
      console.error("Login failed")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setCurrentUser(null)
    removeToken()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
