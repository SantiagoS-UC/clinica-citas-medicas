import { Injectable, computed, signal } from '@angular/core';
import {
  Cita,
  Especialidad,
  Medico,
  Paciente,
  Pestana,
  Promocion,
  UsuarioRegistro,
} from '../modelos/clinica.models';

/**
 * Información de la clínica y estado compartido entre componentes.
 * Pacientes y citas solo viven en memoria: se pierden al recargar o cerrar la página.
 */
@Injectable({ providedIn: 'root' })
export class ClinicaService {
  readonly promociones: Promocion[] = [
    {
      titulo: 'Chequeo preventivo completo',
      descripcion: '30% de descuento en tu valoración médica integral durante este mes.',
      etiqueta: '-30%',
      imagen: 'img/promo1.jpg',
    },
    {
      titulo: 'Primera sesión de fisioterapia gratis',
      descripcion: 'Agenda tu valoración y recibe tu primera sesión de fisioterapia sin costo.',
      etiqueta: 'Gratis',
      imagen: 'img/promo2.jpg',
    },
    {
      titulo: 'Plan nutricional personalizado',
      descripcion: 'Consulta de nutrición + 3 meses de seguimiento con 20% de descuento.',
      etiqueta: '-20%',
      imagen: 'img/promo3.jpg',
    },
  ];

  readonly especialidades: Especialidad[] = [
    {
      id: 'terapia-neural',
      nombre: 'Terapia Neural',
      icono: 'bi-lightning-charge',
      descripcion:
        'La Terapia Neural regula el sistema nervioso mediante la aplicación de anestésicos locales en puntos específicos del cuerpo, ayudando a aliviar el dolor crónico y a restablecer el equilibrio del organismo.',
    },
    {
      id: 'quiropraxia',
      nombre: 'Quiropraxia',
      icono: 'bi-person-standing',
      descripcion:
        'La Quiropraxia diagnostica y trata alteraciones de la columna vertebral y las articulaciones mediante ajustes manuales, mejorando la postura, la movilidad y reduciendo el dolor.',
    },
    {
      id: 'fisioterapia',
      nombre: 'Fisioterapia',
      icono: 'bi-person-walking',
      descripcion:
        'La Fisioterapia previene, trata y rehabilita lesiones musculares y articulares mediante ejercicio terapéutico, terapia manual y agentes físicos como calor, frío y electroterapia.',
    },
    {
      id: 'nutricion',
      nombre: 'Nutrición y Dietética Terapéutica',
      icono: 'bi-basket2',
      descripcion:
        'La Nutrición y Dietética Terapéutica diseña planes de alimentación personalizados para prevenir y tratar enfermedades como la diabetes, la hipertensión o la obesidad.',
    },
    {
      id: 'acupuntura',
      nombre: 'Acupuntura',
      icono: 'bi-bullseye',
      descripcion:
        'La Acupuntura, técnica de la medicina tradicional china, estimula puntos específicos del cuerpo con agujas muy finas para aliviar el dolor, reducir el estrés y mejorar el bienestar.',
    },
  ];

  readonly medicos: Medico[] = [
    { id: 1, titulo: 'Dr.', nombres: 'Juan', apellidos: 'Pérez Gómez', especialidadId: 'fisioterapia', subespecialidad: 'Fisioterapia deportiva', motivacion: 'Comprometido con tu recuperación.', experiencia: 12, imagen: 'img/medico1.jpg' },
    { id: 2, titulo: 'Dra.', nombres: 'Catalina', apellidos: 'Sánchez Ruiz', especialidadId: 'quiropraxia', subespecialidad: 'Quiropraxia de columna y postura', motivacion: 'La salud es fundamental.', experiencia: 9, imagen: 'img/medico2.jpg' },
    { id: 3, titulo: 'Dr.', nombres: 'Andrés', apellidos: 'Cardozo Muñoz', especialidadId: 'nutricion', subespecialidad: 'Nutrición clínica y terapéutica', motivacion: 'Un alimento sano alarga la vida.', experiencia: 10, imagen: 'img/medico3.jpg' },
    { id: 4, titulo: 'Dra.', nombres: 'Valentina', apellidos: 'Ortiz Mosquera', especialidadId: 'terapia-neural', subespecialidad: 'Terapia neural y dolor crónico', motivacion: 'Sanar desde la raíz es posible.', experiencia: 8, imagen: 'img/medico4.jpg' },
    { id: 5, titulo: 'Dr.', nombres: 'Hernán', apellidos: 'Velasco Rengifo', especialidadId: 'terapia-neural', subespecialidad: 'Odontología neurofocal', motivacion: '30 años de experiencia a tu servicio.', experiencia: 30, imagen: 'img/medico5.jpg' },
    { id: 6, titulo: 'Dra.', nombres: 'Laura', apellidos: 'Muñoz Idrobo', especialidadId: 'nutricion', subespecialidad: 'Nutrición deportiva y pediátrica', motivacion: 'Comer bien es el primer paso al bienestar.', experiencia: 7, imagen: 'img/medico6.jpg' },
    { id: 7, titulo: 'Dr.', nombres: 'Santiago', apellidos: 'Rivera Castillo', especialidadId: 'acupuntura', subespecialidad: 'Acupuntura y medicina china', motivacion: 'Equilibrio y energía para tu día a día.', experiencia: 15, imagen: 'img/medico7.jpg' },
    { id: 8, titulo: 'Dra.', nombres: 'Mariana', apellidos: 'López Chaves', especialidadId: 'fisioterapia', subespecialidad: 'Rehabilitación neurológica', motivacion: 'Cada pequeño avance es una gran victoria.', experiencia: 11, imagen: 'img/medico8.jpg' },
  ];

  /** Horarios de atención en los que se pueden agendar citas. */
  readonly horarios = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
  ];

  /** Id de la especialidad seleccionada en la barra lateral ('' = todas). */
  readonly especialidadSeleccionada = signal<string>('');

  /** Pestaña visible en la sección de registro. */
  readonly pestanaActiva = signal<Pestana>('paciente');

  /** Médico y paciente que se preseleccionan al abrir "Agendar cita". */
  readonly medicoParaCita = signal<Medico | null>(null);
  readonly pacienteParaCita = signal<Paciente | null>(null);

  readonly pacientes = signal<Paciente[]>([]);
  readonly citas = signal<Cita[]>([]);

  readonly especialidadActual = computed(
    () => this.especialidades.find((e) => e.id === this.especialidadSeleccionada()) ?? null,
  );

  readonly medicosFiltrados = computed(() => {
    const id = this.especialidadSeleccionada();
    return id ? this.medicos.filter((m) => m.especialidadId === id) : this.medicos;
  });

  /** Citas ordenadas por fecha y hora, listas para mostrarse en la tabla. */
  readonly citasOrdenadas = computed(() =>
    [...this.citas()].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)),
  );

  seleccionarEspecialidad(id: string): void {
    this.especialidadSeleccionada.set(id);
  }

  /** Se llama desde el botón "Agendar cita" de cada médico. */
  agendarCita(medico: Medico): void {
    this.medicoParaCita.set(medico);
    this.pestanaActiva.set('cita');
  }

  cantidadMedicos(especialidadId: string): number {
    return this.medicos.filter((m) => m.especialidadId === especialidadId).length;
  }

  nombreEspecialidad(especialidadId: string): string {
    return this.especialidades.find((e) => e.id === especialidadId)?.nombre ?? '';
  }

  buscarMedico(id: number): Medico | undefined {
    return this.medicos.find((m) => m.id === id);
  }

  buscarPaciente(id: number): Paciente | undefined {
    return this.pacientes().find((p) => p.id === id);
  }

  // Pacientes

  /** Guarda un paciente nuevo. Devuelve un mensaje de error si ya existe. */
  registrarPaciente(usuario: UsuarioRegistro): { paciente?: Paciente; error?: string } {
    const documentoRepetido = this.pacientes().some(
      (p) => p.tipoDocumento === usuario.tipoDocumento && p.numeroDocumento === usuario.numeroDocumento,
    );
    if (documentoRepetido) return { error: 'Ya existe un paciente registrado con ese documento.' };

    const correo = usuario.correo.trim().toLowerCase();
    if (this.pacientes().some((p) => p.correo === correo)) {
      return { error: 'Ese correo ya está registrado con otro paciente.' };
    }

    // La contraseña no se guarda porque la página no tiene inicio de sesión que la use
    const { contrasena: _, ...datos } = usuario;
    const paciente: Paciente = {
      ...datos,
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      correo,
      id: Date.now(),
      fechaRegistro: new Date().toISOString(),
    };

    this.pacientes.update((lista) => [...lista, paciente]);
    return { paciente };
  }

  /** Elimina un paciente y, con él, sus citas. */
  eliminarPaciente(id: number): void {
    this.pacientes.update((lista) => lista.filter((p) => p.id !== id));
    this.citas.update((lista) => lista.filter((c) => c.pacienteId !== id));
  }

  // Citas

  /** Indica si el médico ya tiene una cita en esa fecha y hora. */
  horarioOcupado(medicoId: number, fecha: string, hora: string): boolean {
    return this.citas().some((c) => c.medicoId === medicoId && c.fecha === fecha && c.hora === hora);
  }

  /** Guarda una cita nueva. Devuelve un mensaje de error si no se puede agendar. */
  guardarCita(datos: Omit<Cita, 'id'>): { cita?: Cita; error?: string } {
    if (this.horarioOcupado(datos.medicoId, datos.fecha, datos.hora)) {
      return { error: 'El médico ya tiene una cita en ese horario. Escoge otra hora.' };
    }
    const pacienteOcupado = this.citas().some(
      (c) => c.pacienteId === datos.pacienteId && c.fecha === datos.fecha && c.hora === datos.hora,
    );
    if (pacienteOcupado) {
      return { error: 'El paciente ya tiene otra cita en esa misma fecha y hora.' };
    }

    const cita: Cita = { ...datos, id: Date.now() };
    this.citas.update((lista) => [...lista, cita]);
    return { cita };
  }

  cancelarCita(id: number): void {
    this.citas.update((lista) => lista.filter((c) => c.id !== id));
  }
}
