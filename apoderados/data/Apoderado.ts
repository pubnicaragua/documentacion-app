export interface Apoderado{
   "activo": boolean,
        "alumno_id": number,
        "apoderados": {
            "activo": boolean,
            "personas": {
                "nombres": string,
                "apellidos": string,
                "genero_id": number,
                "persona_id": number,
                "tipo_documento": string,
                "estado_civil_id": number,
                "fecha_nacimiento": string,
                "numero_documento": string
            },
            "colegio_id": number,
            "creado_por": number,
            "persona_id": number,
            "apoderado_id": number,
            "profesion_id": number,
            "fecha_creacion": string,
            "tipo_oficio_id": number,
            "actualizado_por": number,
            "email_contacto1": string,
            "email_contacto2": string,
            "telefono_contacto1": string,
            "telefono_contacto2": string,
            "fecha_actualizacion": string
        },
        "creado_por": number,
        "apoderado_id": number,
        "observaciones": string,
        "estado_usuario": string,
        "fecha_creacion": string,
        "tipo_apoderado": string,
        "actualizado_por": number,
        "alumno_apoderado_id": number,
        "fecha_actualizacion": string
    
}