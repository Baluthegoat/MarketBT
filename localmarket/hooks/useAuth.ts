// hooks/useAuth.ts
import { useState } from "react"
import { loginUser, registerUser } from "../services/authService"

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await loginUser(email, password)
    } finally {
      setLoading(false)
    }
  }

  
  const register = async (email: string, password: string) => {
    setLoading(true)
    try {
      await registerUser(email, password)
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading }
}
