// URL base de la API
export const API_BASE_URL = "https://api-almaia.onrender.com/api/v1";

// Endpoints de la API
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/alumnos/perfil`,
  PROFILE_GENERAL: `${API_BASE_URL}/perfil/obtener`,
  PROFILE_APODERADO: `${API_BASE_URL}/apoderados/perfil`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`, // Endpoint para verificar el token (ajusta según tu API)
  TAREAS: `${API_BASE_URL}/colegios/alumnos_tareas`,
  RACHA: `${API_BASE_URL}/alumnos/racha`,
  REGISTRO_SEMANAL: `${API_BASE_URL}/alumnos/registro_semanal`,
  LOGROS: `${API_BASE_URL}/alumnos/logros`,
  ALUMNOS_RESPUESTAS: `${API_BASE_URL}/preguntas/respuestas_selecccion`,
  ALUMNOS_APODERADOS: `${API_BASE_URL}/apoderados/alumnos_apoderados`,
  ALUMNO: `${API_BASE_URL}/alumnos`,
  ALUMNO_DETALLE: `${API_BASE_URL}/alumnos/detalle`,
  DOCENTE: `${API_BASE_URL}/docentes`,
  APODERADO: `${API_BASE_URL}/apoderados/apoderados`,
  APODERADO_RESPUESTAS: `${API_BASE_URL}/apoderados/apoderados_respuestas`,
  APODERADO_RESPONDER: `${API_BASE_URL}/apoderados/responder_preguntas`,
  ALERTA: `${API_BASE_URL}/alumnos/alertas`,
  MATERIAS: `${API_BASE_URL}/colegios/materias`,
  DIARIO: `${API_BASE_URL}/alumnos/diarios`,
  USUARIO: `${API_BASE_URL}/auth/usuarios`,
    USUARIO_CLAVE: `${API_BASE_URL}/auth/usuarios/generar_clave`,
  GUARDARESPUESTA: `${API_BASE_URL}/preguntas/responder`,
  GUARDARESPUESTATEXTO: `${API_BASE_URL}/preguntas/responder_texto`,
  GUARDARESPUESTAMULTIPLE: `${API_BASE_URL}/preguntas/responder_multiple`,
    CALENDARIO: `${API_BASE_URL}/colegios/calendarios_fechas_importantes`,
  INFORMES: `${API_BASE_URL}/informes/alumnos`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/update-password`,
};

// Función para obtener el token de autenticación
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clave para almacenar el token en AsyncStorage
export const AUTH_TOKEN_KEY = "auth_token";
export const USER_DATA_KEY = "user_data";

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

// Función para verificar si el token es válido
export const isTokenValid = async (token: string | null): Promise<boolean> => {
  if (!token) return false;

  try {
    // Opción 1: Verificar el token localmente (si es un JWT)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) return false;

    const payload = JSON.parse(atob(tokenParts[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos

    if (Date.now() >= expirationTime) {
      console.log("🔑 Token expirado");
      return false;
    }

    return true;

    // Opción 2: Verificar el token con el servidor (descomenta si prefieres esta opción)
    /*
    const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
    */
  } catch (error) {
    //console.error("Error al verificar el token:", error);
    return false;
  }
};

// Función para decodificar base64 (necesaria para JWT)
function atob(str: string): string {
  return Buffer.from(str, "base64").toString("binary");
}

// Función para hacer peticiones a la API
export const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    console.log(`🔍 Haciendo petición a: ${url}`);
    console.log("📦 Opciones:", options);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    console.log(
      `🔄 Respuesta recibida: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error en la respuesta: ${errorText}`);

      let errorMessage = "Error en la solicitud a la API";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();

    if (!text) {
      console.warn("⚠️ La respuesta está vacía");
      return null; // O devuelve {} si lo prefieres
    }

    try {
      const data = JSON.parse(text);
      console.log("✅ Datos recibidos:", data);
      return data;
    } catch (error) {
      console.error("❌ Error al parsear JSON:", error);
      throw new Error("Respuesta JSON malformada");
    }
  } catch (error: any) {
    if (error.message === "Network request failed") {
      console.error("❌ Error de red:", error);
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    }

    console.error("❌ Error en la solicitud a la API:", error);
    throw error;
  }
};


// Función para hacer peticiones autenticadas a la API
export const fetchAuthApi = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();

  if (!token) {
    //throw new Error("No hay token de autenticación");
  }
  return fetchApi(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
