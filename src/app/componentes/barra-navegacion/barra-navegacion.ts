import { Component } from '@angular/core';

interface EnlaceMenu {
  texto: string;
  icono: string;
  destino: string;
}

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css',
})
export class BarraNavegacion {
  /** Enlaces a las 3 secciones de la página. */
  readonly enlaces: EnlaceMenu[] = [
    { texto: 'Promociones', icono: 'bi-tag-fill', destino: '#promociones' },
    { texto: 'Médicos', icono: 'bi-people-fill', destino: '#medicos' },
    { texto: 'Registro', icono: 'bi-person-plus', destino: '#registro' },
  ];
}
