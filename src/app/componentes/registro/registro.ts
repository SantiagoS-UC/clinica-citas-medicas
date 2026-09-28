import { Component, inject } from '@angular/core';
import { ClinicaService } from '../../servicios/clinica.service';
import { Pestana } from '../../modelos/clinica.models';
import { FormularioPaciente } from '../formulario-paciente/formulario-paciente';
import { AgendarCita } from '../agendar-cita/agendar-cita';
import { ListaCitas } from '../lista-citas/lista-citas';

interface OpcionPestana {
  id: Pestana;
  texto: string;
  textoCorto: string; // se muestra en celulares
  icono: string;
}

/**
 * Sección 3: registro de pacientes y citas.
 * Se organiza en pestañas para no agregar secciones nuevas a la página.
 */
@Component({
  selector: 'app-registro',
  imports: [FormularioPaciente, AgendarCita, ListaCitas],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  protected readonly clinica = inject(ClinicaService);

  readonly pestanas: OpcionPestana[] = [
    { id: 'paciente', texto: 'Registro de paciente', textoCorto: 'Paciente', icono: 'bi-person-plus' },
    { id: 'cita', texto: 'Agendar cita', textoCorto: 'Cita', icono: 'bi-calendar-plus' },
    { id: 'citas', texto: 'Citas registradas', textoCorto: 'Citas', icono: 'bi-calendar-week' },
  ];

  cambiarPestana(id: Pestana): void {
    this.clinica.pestanaActiva.set(id);
  }
}
