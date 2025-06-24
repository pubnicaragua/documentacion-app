export interface AlumnoRespuestaSeleccion {
    alumno_respuesta_id?: number;  // Opcional porque tiene el "?"
    alumno_id: number;
    pregunta_id: number;
    respuesta_posible_id: number;
}