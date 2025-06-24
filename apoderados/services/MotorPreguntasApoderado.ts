import { ApoderadoRespuestaSeleccion } from "../data/ApoderadoRespuesta";
import { PreguntaConRespuestas } from "../data/PreguntaConRespuestas";
import { RespuestaApoderado } from "../data/RespuestaApoderado";

export function agruparPorPregunta(
  respuestas: RespuestaApoderado[]
): PreguntaConRespuestas[] {
  const resultado: Record<number, PreguntaConRespuestas> = {};
  for (const respuesta of respuestas) {
    if (!resultado[respuesta.pregunta_id]) {
      resultado[respuesta.pregunta_id] = {
        pregunta_id: respuesta.pregunta_id,
        grupo_preguntas: respuesta.preguntas.grupo_preguntas,
        template_code: respuesta.preguntas.template_code,
        texto_pregunta: respuesta.preguntas.texto_pregunta,
        respuestas: [],
      };
    }
    resultado[respuesta.pregunta_id].respuestas =
      respuesta.preguntas.respuestas_posibles.map((item) => {
        return {
          respuesta_posible_id: item.respuesta_posible_id,
          texto_respuesta: item.nombre,
          icono: item.icono || "",
        };
      });
  }

  return Object.values(resultado);
}
export function siguientePregunta(
  navigation: any,
  pantalla: string,
  preguntas: PreguntaConRespuestas[],
  indice: number
) {
  if (indice > preguntas.length - 1) {
    navigation.navigate("TestCompletion");
  }else{
    navigation.navigate(pantalla, { preguntas: preguntas, indice });
  }
}
