import { Component } from '@angular/core';
import { Encabezado } from './componentes/encabezado/encabezado';
import { BarraNavegacion } from './componentes/barra-navegacion/barra-navegacion';
import { Carrusel } from './componentes/carrusel/carrusel';
import { Medicos } from './componentes/medicos/medicos';
import { Registro } from './componentes/registro/registro';
import { PiePagina } from './componentes/pie-pagina/pie-pagina';

@Component({
  selector: 'app-root',
  imports: [Encabezado, BarraNavegacion, Carrusel, Medicos, Registro, PiePagina],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
