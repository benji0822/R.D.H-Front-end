export interface LoginResponse {
    tipo_usuario_id: number
}

export interface User {
    id: number,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    fono: number,
    tipo_usuario_id: number,
    run: string,
    password: string
}

export interface Actividad {
    id_actividad?: number,
    fecha_actividad: string,
    hora_inic_activdad: string,
    hora_term_actividad: string,
    area_trabajo_id: number,
    run_alumno: string,
    estado: boolean,
    area_trabajo?: { id: number, nombre: string }
}

export interface ActividadResponse {
    actividades: Actividad[]
}

export interface DetallesAlumno {
    actividadesPorMes: Actividad[]
    horasTotalesMes?: number,
    horasAreaMes?: {
        difusion: number,
        extension: number,
        comunicacion: number,
        desarrolloLaboral: number
    }
}

export interface AreaTrabajo {
    id: number,
    nombre: string
}

