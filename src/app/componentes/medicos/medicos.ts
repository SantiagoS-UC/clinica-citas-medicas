import { Component, inject } from '@angular/core';
import { ClinicaService } from '../../servicios/clinica.service';
import { Medico } from '../../modelos/clinica.models';
import { BarraEspecialidades } from '../barra-especialidades/barra-especialidades';
import { TarjetaMedico } from '../tarjeta-medico/tarjeta-medico';

/** Sección 2: barra lateral de especialidades + cartas de médicos. */
@Component({
  selector: 'app-medicos',
  imports: [BarraEspecialidades, TarjetaMedico],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class Medicos {
  protected readonly clinica = inject(ClinicaService);

  agendarCita(medico: Medico): void {
    this.clinica.agendarCita(medico);
  }
}
