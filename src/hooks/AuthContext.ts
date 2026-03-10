import { createContext } from "react"
import type { AuthContextType } from "./authConfig"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
