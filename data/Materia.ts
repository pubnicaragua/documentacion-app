interface Colegio {
  nombre: string;
  colegio_id: number;
}

export interface Materia {
  materia_id: number;
  colegio_id: number;
  nombre: string;
  codigo: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  colegios: Colegio;
}