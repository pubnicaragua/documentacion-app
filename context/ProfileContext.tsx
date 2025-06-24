"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { API_ENDPOINTS, fetchAuthApi } from "../config/api"
import { useToast } from "./ToastContext"
import { useAuth } from "./AuthContext"
import { Apoderado } from "data/Apoderado"

// Interfaces para los datos del perfil
interface Usuario {
  usuario_id: number
  nombre_social: string
  email: string
  telefono_contacto: string
  ultimo_inicio_sesion: string
  estado_usuario: string
  url_foto_perfil: string
}

interface Persona {
  persona_id: number
  tipo_documento: string
  numero_documento: string
  nombres: string
  apellidos: string
  fecha_nacimiento: string
}

interface Rol {
  rol_id: number
  nombre: string
  descripcion: string
}

interface Funcionalidad {
  funcionalidad_id: number
  nombre: string
  descripcion: string
}
interface Idioma{
    activo: boolean
    nombre: string
    idioma_id: number,
    creado_por: number,
    descripcion: string,
    fecha_creacion: string,
    actualizado_por: number,
    url_foto_bandera: string,
    fecha_actualizacion: string
}
interface Colegio{
  colegio_id:number
  nombre:string
}

interface ProfileData {
  apoderados?:Apoderado[]
  usuario: Usuario
  persona: Persona
  rol: Rol
  idioma?:Idioma ,
  colegio?:Colegio,
  funcionalidades: Funcionalidad[]
}

interface ProfileContextType {
  profileData: ProfileData | null
  isLoading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  tareaAgregada:boolean
  diarioAgregado:boolean
  agregarTarea:(valor:boolean)=>void
  agregarDiario:(valor:boolean)=>void

}

// Datos de muestra para desarrollo
const sampleProfileData: ProfileData = {
  usuario: {
    usuario_id: 1,
    nombre_social: "Usuario de Prueba",
    email: "usuario@ejemplo.com",
    telefono_contacto: "+123456789",
    ultimo_inicio_sesion: new Date().toISOString(),
    estado_usuario: "ACTIVO",
    url_foto_perfil: "https://example.com/perfil.jpg",
  },
  persona: {
    persona_id: 1,
    tipo_documento: "DNI",
    numero_documento: "12345678",
    nombres: "Usuario",
    apellidos: "De Prueba",
    fecha_nacimiento: "1990-01-01T00:00:00.000Z",
  },
  rol: {
    rol_id: 1,
    nombre: "Usuario",
    descripcion: "Usuario estándar del sistema",
  },
  funcionalidades: [
    {
      funcionalidad_id: 1,
      nombre: "Dashboard",
      descripcion: "Acceso al panel principal",
    },
  ],
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tareaAgregada, setTareaAgregada] = useState(false)
  const [diarioAgregado, setDiarioAgregado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const { logout } = useAuth()

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Llamada a la API para obtener los datos del perfil
      const data = await fetchAuthApi(API_ENDPOINTS.PROFILE, {
        method: "GET",
      })
      setProfileData(data)
    } catch (error: any) {
    // Si el error es por token expirado, cerrar sesión
      if (error.message === "TOKEN_EXPIRED") {
        showToast("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", "error")
        await logout(false) // No mostrar toast de logout
        return
      }

      const errorMessage = error.message || "Error al obtener datos del perfil"
      setError(errorMessage)
      showToast(errorMessage, "error")

      // Usar datos de muestra en caso de error (solo para desarrollo)
      if (process.env.NODE_ENV === "development") {
        console.log("Usando datos de muestra para desarrollo")
        setProfileData(sampleProfileData)
      }
    } finally {
      setIsLoading(false)
    }
  }
const agregarTarea =(valor:boolean)=>{
  setTareaAgregada(valor)
}
const agregarDiario =(valor:boolean)=>{
  setDiarioAgregado(valor)
}
  // Cargar los datos del perfil al montar el componente
  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        tareaAgregada,
        diarioAgregado,
        agregarTarea,
       agregarDiario,
        isLoading,
        error,
        fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile debe ser usado dentro de un ProfileProvider")
  }
  return context
}
