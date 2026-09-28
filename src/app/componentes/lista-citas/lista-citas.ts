import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClinicaService } from '../../servicios/clinica.service';

/** Tabla de citas agendadas y lista de pacientes (pestaña 3 de la sección 3). */
@Component({
  selector: 'app-lista-citas',
  imports: [DatePipe],
  templateUrl: './lista-citas.html',
  styleUrl: './lista-citas.css',
})
export class ListaCitas {
  protected readonly clinica = inject(ClinicaService);

  /** Paciente por el que se filtran las citas (0 = todos). */
  readonly filtroPaciente = signal(0);

  /** Id de la cita o paciente que espera confirmación antes de borrarse. */
  readonly citaPorCancelar = signal<number | null>(null);
  readonly pacientePorEliminar = signal<number | null>(null);

  readonly citasVisibles = computed(() => {
    const id = this.filtroPaciente();
    const citas = this.clinica.citasOrdenadas();
    return id ? citas.filter((c) => c.pacienteId === id) : citas;
  });

  cambiarFiltro(evento: Event): void {
    this.filtroPaciente.set(Number((evento.target as HTMLSelectElement).value));
  }

  nombrePaciente(id: number): string {
    const paciente = this.clinica.buscarPaciente(id);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente eliminado';
  }

  nombreMedico(id: number): string {
    const medico = this.clinica.buscarMedico(id);
    return medico ? `${medico.titulo} ${medico.nombres} ${medico.apellidos}` : '';
  }

  especialidadMedico(id: number): string {
    const medico = this.clinica.buscarMedico(id);
    return medico ? this.clinica.nombreEspecialidad(medico.especialidadId) : '';
  }

  imagenMedico(id: number): string {
    return this.clinica.buscarMedico(id)?.imagen ?? '';
  }

  citasDePaciente(id: number): number {
    return this.clinica.citas().filter((c) => c.pacienteId === id).length;
  }

  confirmarCancelacion(id: number): void {
    this.clinica.cancelarCita(id);
    this.citaPorCancelar.set(null);
  }

  confirmarEliminacion(id: number): void {
    this.clinica.eliminarPaciente(id);
    this.pacientePorEliminar.set(null);
    if (this.filtroPaciente() === id) this.filtroPaciente.set(0);
  }

  irAAgendar(): void {
    this.clinica.pestanaActiva.set('cita');
  }
}
