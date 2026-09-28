import { Component } from '@angular/core';

interface RedSocial {
  nombre: string;
  icono: string;
  url: string;
}

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
})
export class Encabezado {
  readonly nombreClinica = 'Clínica Salud Integral';
  readonly lema = 'Medicina integrativa para tu bienestar';

  readonly redes: RedSocial[] = [
    { nombre: 'Facebook', icono: 'bi-facebook', url: 'https://www.facebook.com' },
    { nombre: 'Instagram', icono: 'bi-instagram', url: 'https://www.instagram.com' },
    { nombre: 'X', icono: 'bi-twitter-x', url: 'https://x.com' },
    { nombre: 'WhatsApp', icono: 'bi-whatsapp', url: 'https://wa.me/573001234567' },
  ];
}
