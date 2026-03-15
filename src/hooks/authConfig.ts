interface User {
  id: string
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register?: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

export type { User, AuthContextType }

const USERS_KEY = "gamc_users"
const CURRENT_USER_KEY = "gamc_current_user"

export const getStoredUsers = (): Array<{ name: string; email: string; password: string }> => {
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) return JSON.parse(stored)
  const defaultUsers = [
    { name: "Admin", email: "admin@gamc.gob.bo", password: "admin123" },
    { name: "Usuario Demo", email: "demo@gamc.gob.bo", password: "demo123" },
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

export const saveUserToStorage = (user: { name: string; email: string; password: string }) => {
  const users = getStoredUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUserByEmail = (email: string): { name: string; email: string; password: string } | undefined => {
  const users = getStoredUsers()
  return users.find((u) => u.email === email)
}

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  if (stored) return JSON.parse(stored)
  return null
}

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}
