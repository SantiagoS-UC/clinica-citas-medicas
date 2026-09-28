import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { ClinicaService } from '../../servicios/clinica.service';

/** Objeto global que crea el JavaScript de Bootstrap (cargado en index.html). */
declare const bootstrap: any;

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class Carrusel {
  protected readonly clinica = inject(ClinicaService);
  protected readonly promociones = this.clinica.promociones;

  private readonly carrusel = viewChild<ElementRef<HTMLElement>>('carrusel');

  constructor() {
    // Solo en el navegador: se asegura que el carrusel avance automáticamente
    afterNextRender(() => {
      const elemento = this.carrusel()?.nativeElement;
      if (elemento && typeof bootstrap !== 'undefined') {
        bootstrap.Carousel.getOrCreateInstance(elemento, { interval: 5000, ride: 'carousel' }).cycle();
      }
    });
  }
}
