import { Component, inject } from '@angular/core';
import { ClinicaService } from '../../servicios/clinica.service';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.html',
  styleUrl: './pie-pagina.css',
})
export class PiePagina {
  protected readonly clinica = inject(ClinicaService);
  readonly anio = new Date().getFullYear();

  readonly redes = [
    { nombre: 'Facebook', icono: 'bi-facebook', url: 'https://www.facebook.com' },
    { nombre: 'Instagram', icono: 'bi-instagram', url: 'https://www.instagram.com' },
    { nombre: 'X', icono: 'bi-twitter-x', url: 'https://x.com' },
    { nombre: 'YouTube', icono: 'bi-youtube', url: 'https://www.youtube.com' },
    { nombre: 'WhatsApp', icono: 'bi-whatsapp', url: 'https://wa.me/573001234567' },
  ];
}
