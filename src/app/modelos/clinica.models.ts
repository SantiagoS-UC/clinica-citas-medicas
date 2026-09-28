/** Promoción que se muestra en el carrusel (sección 1). */
export interface Promocion {
  titulo: string;
  descripcion: string;
  etiqueta: string;
  imagen: string;
}

/** Especialidad médica que aparece en la barra lateral (sección 2). */
export interface Especialidad {
  id: string;
  nombre: string;
  icono: string; // clase de Bootstrap Icons
  descripcion: string;
}

/** Médico de la clínica (sección 2). */
export interface Medico {
  id: number;
  titulo: 'Dr.' | 'Dra.';
  nombres: string;
  apellidos: string;
  especialidadId: string;
  subespecialidad: string;
  motivacion: string;
  experiencia: number; // años
  imagen: string;
}

/** Datos que diligencia un usuario nuevo en el registro (sección 3). */
export interface UsuarioRegistro {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: string;
  telefono: string;
  correo: string; // dato con el que el usuario confirma su registro
  contrasena: string;
}

/** Paciente registrado (sin la contraseña). */
export interface Paciente extends Omit<UsuarioRegistro, 'contrasena'> {
  id: number;
  fechaRegistro: string;
}

/** Cita agendada entre un paciente y un médico. */
export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string; // formato AAAA-MM-DD
  hora: string; // formato HH:mm
  motivo: string;
}

/** Pestañas de la sección de registro. */
export type Pestana = 'paciente' | 'cita' | 'citas';
