import { useState } from "react"
import type { ReactNode } from "react"
import type { User } from "./authConfig"
import { AuthContext } from "./AuthContext"
import {
  findUserByEmail,
  saveUserToStorage,
  getCurrentUser,
  setCurrentUser,
} from "./authConfig"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())
  const isLoading = false

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = findUserByEmail(email)
    if (foundUser && foundUser.password === password) {
      const userData: User = {
        id: crypto.randomUUID(),
        name: foundUser.name,
        email: foundUser.email,
      }
      setUser(userData)
      setCurrentUser(userData)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (findUserByEmail(email)) {
      return false
    }
    saveUserToStorage({ name, email, password })
    const userData: User = {
      id: crypto.randomUUID(),
      name,
      email,
    }
    setUser(userData)
    setCurrentUser(userData)
    return true
  }

  const logout = () => {
    setUser(null)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
