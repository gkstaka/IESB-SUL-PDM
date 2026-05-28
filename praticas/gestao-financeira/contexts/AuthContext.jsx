import { createContext, useCallback, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../services/api"

export const AuthContext = createContext()

const STORAGE_KEY = "@money:auth"

export default function AuthState({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)  // true enquanto verifica sessão salva

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (raw) {
        const stored = JSON.parse(raw)
        api.setToken(stored.token)
        try {
          // tenta renovar o token — se expirou cai no catch e força login
          const result = await api.refresh()
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result))
          api.setToken(result.token)
          setToken(result.token)
          setUser(result.user)
        } catch {
          await AsyncStorage.removeItem(STORAGE_KEY)
          api.setToken(null)
        }
      }
      setLoading(false)
    })
  }, [])

  const persist = useCallback(async (result) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    api.setToken(result.token)
    setToken(result.token)
    setUser(result.user)
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await api.login(email, password)
    console.log("token recebido:", result.token)
    await persist(result)
  }, [persist])

  const register = useCallback(async (name, email, password) => {
    const result = await api.register(name, email, password)
    await persist(result)
  }, [persist])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY)
    api.setToken(null)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
