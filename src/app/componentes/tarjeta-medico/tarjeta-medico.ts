import { Component, input, output } from '@angular/core';
import { Medico } from '../../modelos/clinica.models';

/** Carta con la información de un médico. */
@Component({
  selector: 'app-tarjeta-medico',
  templateUrl: './tarjeta-medico.html',
  styleUrl: './tarjeta-medico.css',
})
export class TarjetaMedico {
  readonly medico = input.required<Medico>();
  readonly especialidad = input<string>('');
  readonly agendar = output<Medico>();

  onAgendar(): void {
    this.agendar.emit(this.medico());
  }
}
