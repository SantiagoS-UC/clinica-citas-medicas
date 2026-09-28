import { Component, effect, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClinicaService } from '../../servicios/clinica.service';

type CampoCita = 'pacienteId' | 'medicoId' | 'fecha' | 'hora' | 'motivo';

/** Devuelve la fecha de hoy en formato AAAA-MM-DD según la hora local. */
function fechaDeHoy(): string {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

/** Formulario para agendar una cita (pestaña 2 de la sección 3). */
@Component({
  selector: 'app-agendar-cita',
  imports: [ReactiveFormsModule],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita {
  private readonly fb = inject(FormBuilder);
  protected readonly clinica = inject(ClinicaService);

  readonly hoy = fechaDeHoy();

  readonly formulario = this.fb.group({
    pacienteId: this.fb.control<number | null>(null, Validators.required),
    medicoId: this.fb.control<number | null>(null, Validators.required),
    fecha: this.fb.nonNullable.control('', Validators.required),
    hora: this.fb.nonNullable.control('', Validators.required),
    motivo: this.fb.nonNullable.control('', Validators.maxLength(200)),
  });

  readonly errores = signal<Partial<Record<CampoCita, string>>>({});
  readonly validados = signal<Partial<Record<CampoCita, boolean>>>({});
  readonly mensajeExito = signal('');
  readonly mensajeError = signal('');

  constructor() {
    // Los selects se validan apenas el usuario escoge una opción
    const selects: CampoCita[] = ['pacienteId', 'medicoId', 'hora'];
    for (const campo of selects) {
      const control: AbstractControl = this.formulario.controls[campo];
      control.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        if (control.dirty) this.validarCampo(campo);
      });
    }

    this.formulario.controls.medicoId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.revisarHora());
    this.formulario.controls.fecha.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.revisarHora());

    // Si se llegó desde la tarjeta de un médico o desde el registro de un paciente,
    // se dejan seleccionados en el formulario.
    effect(() => {
      const medico = this.clinica.medicoParaCita();
      if (medico) this.formulario.controls.medicoId.setValue(medico.id);
    });
    effect(() => {
      const paciente = this.clinica.pacienteParaCita();
      if (paciente) this.formulario.controls.pacienteId.setValue(paciente.id);
    });
  }

  /** Una hora no se puede escoger si el médico ya está ocupado o si ya pasó. */
  horaNoDisponible(hora: string): boolean {
    const { medicoId, fecha } = this.formulario.getRawValue();
    if (!fecha) return false;
    if (fecha === this.hoy && hora <= this.horaActual()) return true;
    return medicoId !== null && this.clinica.horarioOcupado(medicoId, fecha, hora);
  }

  private horaActual(): string {
    return new Date().toTimeString().slice(0, 5);
  }

  private mensajeErrorCampo(campo: CampoCita): string {
    const { medicoId, fecha, hora, motivo } = this.formulario.getRawValue();
    const control = this.formulario.controls[campo];

    if (control.hasError('required')) {
      const mensajes: Record<string, string> = {
        pacienteId: 'Seleccione el paciente.',
        medicoId: 'Seleccione el médico.',
        fecha: 'Seleccione la fecha de la cita.',
        hora: 'Seleccione la hora de la cita.',
      };
      return mensajes[campo];
    }
    if (campo === 'fecha' && fecha < this.hoy) return 'La fecha no puede ser anterior a hoy.';
    if (campo === 'hora' && fecha === this.hoy && hora <= this.horaActual()) return 'Esa hora ya pasó.';
    if (campo === 'hora' && medicoId !== null && this.clinica.horarioOcupado(medicoId, fecha, hora)) {
      return 'El médico ya tiene una cita a esa hora.';
    }
    if (campo === 'motivo' && motivo.length > 200) return 'Máximo 200 caracteres.';
    return '';
  }

  /** Valida un campo al perder el foco o al cambiar su valor. */
  validarCampo(campo: CampoCita): boolean {
    const mensaje = this.mensajeErrorCampo(campo);
    this.errores.update((err) => ({ ...err, [campo]: mensaje }));
    this.validados.update((val) => ({ ...val, [campo]: true }));
    return mensaje === '';
  }

  /** Al cambiar médico o fecha, la hora escogida puede dejar de estar disponible. */
  revisarHora(): void {
    if (this.validados().hora) this.validarCampo('hora');
  }

  esInvalido(campo: CampoCita): boolean {
    return !!this.errores()[campo];
  }

  esValido(campo: CampoCita): boolean {
    return !!this.validados()[campo] && !this.errores()[campo];
  }

  agendar(): void {
    const campos: CampoCita[] = ['pacienteId', 'medicoId', 'fecha', 'hora', 'motivo'];
    let valido = true;
    for (const campo of campos) {
      valido = this.validarCampo(campo) && valido;
    }
    this.mensajeExito.set('');
    this.mensajeError.set('');
    if (!valido) return;

    const { pacienteId, medicoId, fecha, hora, motivo } = this.formulario.getRawValue();
    const resultado = this.clinica.guardarCita({
      pacienteId: pacienteId!,
      medicoId: medicoId!,
      fecha,
      hora,
      motivo: motivo.trim(),
    });

    if (resultado.error) {
      this.mensajeError.set(resultado.error);
      return;
    }

    const paciente = this.clinica.buscarPaciente(pacienteId!);
    const medico = this.clinica.buscarMedico(medicoId!);
    this.mensajeExito.set(
      `Cita agendada para ${paciente?.nombres} ${paciente?.apellidos} con ` +
        `${medico?.titulo} ${medico?.nombres} ${medico?.apellidos} el ${formatDate(fecha, 'dd-MM-yyyy', 'en-US')} a las ${hora}.`,
    );
    this.limpiar(false);
  }

  limpiar(borrarMensajes = true): void {
    this.formulario.reset();
    this.errores.set({});
    this.validados.set({});
    this.clinica.medicoParaCita.set(null);
    this.clinica.pacienteParaCita.set(null);
    if (borrarMensajes) {
      this.mensajeExito.set('');
      this.mensajeError.set('');
    }
  }

  irARegistro(): void {
    this.clinica.pestanaActiva.set('paciente');
  }
}
