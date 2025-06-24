import {
  fineface,
  neutralface,
  sadface,
  veryfineface,
  verysadface,
} from "@/indexsvfg";
import { Activity } from "data/Activity";
import { obtener_icon } from "data/Icon";
import { MoodOption } from "data/MoodOption";
import {
  PreguntaConRespuestas,
  RespuestaSeleccionada,
} from "data/PreguntaConRespuestas";
import { RespuestaAlumno } from "data/RespuestaAlumno";
const icons: Record<string, any> = {
  fineface,
  neutralface,
  sadface,
  veryfineface,
  verysadface,
};
export function agruparPorPregunta(
  respuestas: RespuestaAlumno[]
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
export function mapearPreguntasaEmociones(
  preguntas: PreguntaConRespuestas[],
  indice: number
): MoodOption[] {
  return preguntas[indice]?.respuestas.map((item: RespuestaSeleccionada) => {
    return {
      id: item.respuesta_posible_id,
      label: item.texto_respuesta,
      icon: obtener_icon(item.icono),
    };
  });
}
export function siguientePregunta(
  navigation: any,
  pantalla: string,
  preguntas: PreguntaConRespuestas[],
  indice: number
) {
  console.log(
   'idice',indice
  );  
  console.log(
   'longitud',preguntas.length-1
  );console.log(
   'ultima',indice == (preguntas.length-1)
  );
 
  
  
  if(indice >= (preguntas.length-1)){
    navigation.navigate('DiaryEntry', { preguntas: preguntas, indice });
  }
  navigation.navigate(pantalla, { preguntas: preguntas, indice });
}
export function mapearActivity(original:RespuestaSeleccionada[]):Activity[] {
  return original.map(item => ({
  id: String(item.respuesta_posible_id),
  label: item.texto_respuesta,
  icon: item.icono
}))
}