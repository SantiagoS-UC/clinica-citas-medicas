import { Component, inject } from '@angular/core';
import { ClinicaService } from '../../servicios/clinica.service';

/** Barra lateral con las especialidades y la descripción de la seleccionada. */
@Component({
  selector: 'app-barra-especialidades',
  templateUrl: './barra-especialidades.html',
  styleUrl: './barra-especialidades.css',
})
export class BarraEspecialidades {
  protected readonly clinica = inject(ClinicaService);

  seleccionar(id: string, evento: Event): void {
    evento.preventDefault();
    this.clinica.seleccionarEspecialidad(id);
  }
}
