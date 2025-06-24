interface Alumno {
  email: string;
  alumno_id: number;
  url_foto_perfil: string;
  telefono_contacto1: string;
  telefono_contacto2: string;
}

interface Pregunta {
  pregunta_id: number;
  texto_pregunta: string;
  grupo_preguntas:string;
  template_code:string;
  respuestas_posibles:RespuestaPosible[]
}
interface RespuestaPosible {
  respuesta_posible_id: number;
  nombre: string;
  icono?:string;
}
export interface RespuestaApoderado {
  alumno_respuesta_seleccion_id: number;
  alumno_id: number;
  pregunta_id: number;
  respuesta_posible_id: number;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  alumnos: Alumno;
  preguntas: Pregunta;
  respuestas_posibles: RespuestaPosible;
}