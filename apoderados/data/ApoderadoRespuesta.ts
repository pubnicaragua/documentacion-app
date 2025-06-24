export interface ApoderadoRespuestaSeleccion {
    alumno_respuesta_id?: number;  // Opcional porque tiene el "?"
    alumno_id: number;
    apoderado_id: number;
    pregunta_id: number;
    respuesta_posible_id: number;
    texto_respuesta:string;
    estado_respuesta:string;
}