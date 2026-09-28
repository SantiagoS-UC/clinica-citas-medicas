import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ClinicaService } from '../../servicios/clinica.service';
import { Paciente, UsuarioRegistro } from '../../modelos/clinica.models';

/** La fecha de nacimiento debe ser anterior a hoy. */
const fechaPasada: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  return new Date(control.value) < new Date() ? null : { fechaFutura: true };
};

/** Contraseña y confirmación deben coincidir. */
const contrasenasIguales: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const contrasena = grupo.get('contrasena')?.value;
  const confirmar = grupo.get('confirmarContrasena')?.value;
  return contrasena && confirmar && contrasena !== confirmar ? { noCoinciden: true } : null;
};

type Campo =
  | 'nombres' | 'apellidos' | 'tipoDocumento' | 'numeroDocumento' | 'fechaNacimiento' | 'sexo'
  | 'telefono' | 'correo' | 'contrasena' | 'confirmarContrasena' | 'terminos';

/** Formulario para registrar pacientes nuevos (pestaña 1 de la sección 3). */
@Component({
  selector: 'app-formulario-paciente',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-paciente.html',
  styleUrl: './formulario-paciente.css',
})
export class FormularioPaciente {
  private readonly fb = inject(FormBuilder);
  protected readonly clinica = inject(ClinicaService);

  private readonly soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{2,}$/;

  readonly formulario = this.fb.nonNullable.group(
    {
      nombres: ['', [Validators.required, Validators.pattern(this.soloLetras)]],
      apellidos: ['', [Validators.required, Validators.pattern(this.soloLetras)]],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
      fechaNacimiento: ['', [Validators.required, fechaPasada]],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^3\d{9}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      confirmarContrasena: ['', Validators.required],
      terminos: [false, Validators.requiredTrue],
    },
    { validators: contrasenasIguales },
  );

  /** Mensajes de error visibles por campo (se llenan al perder el foco o al registrar). */
  readonly errores = signal<Partial<Record<Campo, string>>>({});
  /** Campos que ya fueron validados (para pintar verde/rojo). */
  readonly validados = signal<Partial<Record<Campo, boolean>>>({});
  readonly mensajeError = signal('');
  /** Último paciente registrado, para ofrecer agendarle una cita. */
  readonly pacienteRegistrado = signal<Paciente | null>(null);

  constructor() {
    // Selects, radios y checkbox se validan apenas el usuario cambia su valor
    const camposDeSeleccion: Campo[] = ['tipoDocumento', 'sexo', 'terminos'];
    for (const campo of camposDeSeleccion) {
      const control: AbstractControl = this.formulario.controls[campo];
      control.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        if (control.dirty) this.validarCampo(campo);
      });
    }
  }

  /** Devuelve el mensaje de error de un campo o '' si es válido. */
  private mensajeErrorCampo(campo: Campo): string {
    const control = this.formulario.controls[campo];
    const e = control.errors;

    if (campo === 'confirmarContrasena' && !e && this.formulario.hasError('noCoinciden')) {
      return 'Las contraseñas no coinciden.';
    }
    if (!e) return '';

    if (e['required']) {
      const obligatorios: Record<string, string> = {
        tipoDocumento: 'Seleccione el tipo de documento.',
        sexo: 'Seleccione una opción.',
        terminos: 'Debe aceptar los términos y condiciones.',
        confirmarContrasena: 'Confirme la contraseña.',
      };
      return obligatorios[campo] ?? 'Este campo es obligatorio.';
    }
    if (e['fechaFutura']) return 'La fecha debe ser anterior a hoy.';
    if (e['email']) return 'Ingrese un correo electrónico válido.';
    if (e['pattern']) {
      const formatos: Record<string, string> = {
        nombres: 'Solo letras, mínimo 2 caracteres.',
        apellidos: 'Solo letras, mínimo 2 caracteres.',
        numeroDocumento: 'Debe tener entre 6 y 10 dígitos.',
        telefono: 'Debe tener 10 dígitos y empezar por 3.',
        contrasena: 'Mínimo 8 caracteres, con letras y números.',
      };
      return formatos[campo] ?? 'Formato no válido.';
    }
    return 'Valor no válido.';
  }

  /** Valida un campo: se llama al cambiar el foco (blur / change). */
  validarCampo(campo: Campo): boolean {
    const mensaje = this.mensajeErrorCampo(campo);
    this.errores.update((err) => ({ ...err, [campo]: mensaje }));
    this.validados.update((val) => ({ ...val, [campo]: true }));

    // Si cambia la contraseña y la confirmación ya se validó, se revisa de nuevo
    if (campo === 'contrasena' && this.validados()['confirmarContrasena']) {
      this.validarCampo('confirmarContrasena');
    }
    return mensaje === '';
  }

  esInvalido(campo: Campo): boolean {
    return !!this.errores()[campo];
  }

  esValido(campo: Campo): boolean {
    return !!this.validados()[campo] && !this.errores()[campo];
  }

  /** Valida todo el formulario al dar click en "Registrar". */
  registrar(): void {
    const campos = Object.keys(this.formulario.controls) as Campo[];
    let valido = true;
    for (const campo of campos) {
      valido = this.validarCampo(campo) && valido;
    }

    this.mensajeError.set('');
    if (!valido || this.formulario.invalid) {
      this.pacienteRegistrado.set(null);
      return;
    }

    const { terminos, confirmarContrasena, ...datos } = this.formulario.getRawValue();
    const usuario: UsuarioRegistro = datos;
    const resultado = this.clinica.registrarPaciente(usuario);

    if (resultado.error) {
      this.mensajeError.set(resultado.error);
      this.pacienteRegistrado.set(null);
      return;
    }

    this.pacienteRegistrado.set(resultado.paciente ?? null);
    this.limpiar(false);
  }

  limpiar(borrarMensaje = true): void {
    this.formulario.reset();
    this.errores.set({});
    this.validados.set({});
    if (borrarMensaje) {
      this.pacienteRegistrado.set(null);
      this.mensajeError.set('');
    }
  }

  /** Lleva a la pestaña "Agendar cita" con el paciente recién registrado. */
  agendarParaPaciente(paciente: Paciente): void {
    this.clinica.pacienteParaCita.set(paciente);
    this.clinica.pestanaActiva.set('cita');
  }
}
