import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "types";

export function mapearTareasPorMes(tareas:any) {
  const mesesMap = new Map();

  tareas.forEach((tarea: {
    tipo_tarea: any; fecha_programacion: string; alumno_tarea_id: any; materias: { nombre: any; }; descripcion_tarea: any; color: any; 
}) => {
    const fecha = parseISO(tarea.fecha_programacion);
    const mes = format(fecha, "MMMM", { locale: es });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

    if (!mesesMap.has(mesCapitalizado)) {
      mesesMap.set(mesCapitalizado, []);
    }

    mesesMap.get(mesCapitalizado).push({
      id: tarea.alumno_tarea_id,
      subject: tarea.materias?.nombre || "Sin materia",
      description: tarea.descripcion_tarea,
      dueDate: format(fecha, "dd 'de' MMMM 'a las' hh:mm a", { locale: es }),
      color: tarea.color || "#000000",
      tipo_tarea:tarea.tipo_tarea
    });
  });

  // Convertimos el Map en el formato solicitado
  let id = 1;
  const resultado = [];

  for (const [mes, items] of mesesMap.entries()) {
    resultado.push({
      id: id++,
      month: mes,
      items,
    });
  }

  return resultado;
}
export function mapearTareas(tareas: any): Task[] { 
  return tareas.map((tarea: {
    fecha_programacion: string;
    alumno_tarea_id: any;
    materias: { nombre: any };
    descripcion_tarea: any;
    color: any;
  }) => {
    const fecha = parseISO(tarea.fecha_programacion);
    return {
      id: tarea.alumno_tarea_id,
      subject: tarea.materias?.nombre || "Sin materia",
      description: tarea.descripcion_tarea,
      dueDate: format(fecha, "dd 'de' MMMM 'a las' hh:mm a", { locale: es }),
      color: tarea.color || "#000000",
    };
  });
}