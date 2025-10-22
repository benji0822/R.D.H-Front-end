interface Area_trabajo {
    id: number,
    nombre: string
}

export interface Alumno {
    fono: number,
    run: string,
    nombre: string,
    email: string
}

export interface Resumen {
    actividades: number,
    actividades_area: number,
    area: string,
    alumnos: number
}

export interface InfoAlumno {
    actividades_area: number,
    actividades_mes: number,
    alumno: Alumno
}

export interface Actividad {
    area_trabajo: Area_trabajo
    area_trabajo_id: number,
    estado: true,
    fecha_actividad: Date,
    hora_inic_activdad: Date,
    hora_term_actividad: Date,
    id_actividad: number,
    run_alumno: string,
}

export interface ActividadAlumno {
    area: string,
    fecha: string,
    fin: string,
    inicio: string,
    estado:boolean
}

export interface SolicitudAlumno{
    area:string,
    fecha: string,
    fin:string,
    inicio:string,
    nombre: string
}

export interface Solicitud {
    id:number,
    fecha:string,
    alumno:string,
    estado:boolean
}

export interface Administrador {
    id: number,
    run: string,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    fono: number,
    email: string,
    password: string,
    tipo_usuario_id: number,
    area_trabajo_id: number,
    area_trabajo: Area_trabajo
}

export interface Detalles {
    id: number,
    run: string,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    fono: number,
    email: string,
    password: string,
    tipo_usuario_id: number,
    area_trabajo_id: number,
    area_trabajo: Area_trabajo,
    horasTotales: number,
    horasTotalesMes: number,
    actividadesMes: Actividad[]
}

export interface ModeloOc {
    "N° OC": number,
    ALUMNO: string,
    "RUT Alumno": string,
    "Total BH OC": Number
}