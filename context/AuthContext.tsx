"use client"

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useRef,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  API_ENDPOINTS,
  fetchApi,
  getAuthToken,
  isTokenValid,
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  fetchAuthApi,
} from "../config/api"
import { useToast } from "./ToastContext"

// Interfaces
interface User {
  id: string
  name: string
  email: string
  alumno_id: number
  apoderado_id: number
  intentos?: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isInitializing: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  loginApoderado: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  clearError: () => void
  checkTokenValidity: () => Promise<boolean>
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook de inactividad
const useInactivityTimer = (
  onTimeout: () => void,
  timeoutMs = 5 * 60 * 1000
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(onTimeout, timeoutMs)
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]
    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [onTimeout, timeoutMs])
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const { showToast } = useToast()

  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const logout = async (showNotification = true) => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
      await AsyncStorage.removeItem(USER_DATA_KEY)
      setUser(null)

      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current)
        tokenCheckIntervalRef.current = null
      }

      if (showNotification) {
        showToast("Sesión cerrada correctamente", "info")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      if (showNotification) {
        showToast("Error al cerrar sesión", "error")
      }
    }
  }

  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = await getAuthToken()
      const isValid = await isTokenValid(token)

      if (!isValid && user) {
        console.log("🔑 Token expirado, cerrando sesión automáticamente")
        await logout(false)
        return false
      }

      return isValid
    } catch (error) {
      console.error("Error al verificar el token:", error)
      return false
    }
  }

  // Inactividad del usuario (ej. 10 min)
  useInactivityTimer(() => {
    console.log("🕒 Usuario inactivo. Cerrando sesión...")
    logout()
  }, 10 * 60 * 1000)

  // Verificación periódica del token
  useEffect(() => {
    const startTokenCheck = () => {
      tokenCheckIntervalRef.current = setInterval(() => {
        console.log("🔄 Verificando validez del token...")
        checkTokenValidity()
      }, 5 * 60 * 1000) // cada 5 minutos
    }

    if (user) {
      startTokenCheck()
    }

    return () => {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current)
      }
    }
  }, [user])

  const clearError = () => setError(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (response.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token)

        const profile = await fetchAuthApi(API_ENDPOINTS.PROFILE)
        const alumno = await fetchAuthApi(
          API_ENDPOINTS.ALUMNO + "?persona_id=" + profile.usuario.persona_id
        )

        const userData: User = {
          id: profile.usuario.usuario_id,
          name: profile.usuario.nombre_social,
          email,
          alumno_id: alumno[0].alumno_id,
          apoderado_id: 0,
        }

        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
        setUser(userData)
        showToast("Inicio de sesión exitoso", "success")
      } else {
        throw new Error("No se recibió un token válido")
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al iniciar sesión. Verifica tus credenciales."
      setError(errorMessage)
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginApoderado = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (response.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token)

        const profile = await fetchAuthApi(API_ENDPOINTS.PROFILE_APODERADO)
        const docente = await fetchAuthApi(
          API_ENDPOINTS.APODERADO +
            "?persona_id=" +
            profile.usuario.persona_id
        )

        const userData: User = {
          id: profile.usuario.usuario_id,
          name: profile.usuario.nombre_social,
          email,
          alumno_id: 0,
          apoderado_id: docente[0].apoderado_id,
          intentos: profile.usuario.intentos_inicio_sesion ?? 0,
        }

        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
        setUser(userData)
        showToast("Inicio de sesión exitoso", "success")
      } else {
        throw new Error("No se recibió un token válido")
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al iniciar sesión. Verifica tus credenciales."
      setError(errorMessage)
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: "1",
        name,
        email,
        alumno_id: 0,
        apoderado_id: 0,
      }

      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
      setUser(userData)
      showToast("Registro exitoso", "success")
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al registrarse. Inténtalo de nuevo."
      setError(errorMessage)
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast("Se ha enviado un correo para recuperar tu contraseña", "success")
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "Error al solicitar recuperación de contraseña. Inténtalo de nuevo."
      setError(errorMessage)
      showToast(errorMessage, "error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitializing,
        error,
        login,
        loginApoderado,
        register,
        logout,
        forgotPassword,
        clearError,
        checkTokenValidity,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
