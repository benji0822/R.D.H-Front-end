import { Component, inject, signal } from '@angular/core';
import { GeneralModule } from '../../../shared/modules/general/general.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServicesService } from '../../../services/auth-services.service';
import { Router } from '@angular/router';
import { MensajeriaService } from '../../../services/mensajeria.service';

@Component({
  selector: 'app-login',
  imports: [GeneralModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //servicios
  private authService = inject(AuthServicesService)
  private fb = inject(FormBuilder)
  private mensajeriaService: MensajeriaService = inject(MensajeriaService)
  private router: Router = inject(Router)


  //variables publicas
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)],]
  })

  cargando: boolean = false


  //visibilidad para el campo de contraseña
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  //contador de caracteres
  showCounter(field: string): number {
    return this.loginForm.get(field)?.value.length || 0
  }


  //validar campos y mostrarlo en pantalla
  hasErrors(campo: string, typeError: string) {
    return this.loginForm.get(campo)?.touched && this.loginForm.get(campo)?.hasError(typeError)
  }

  login() {
    this.cargando = true
    //validar campos
    if (!this.validarCampos()) {
      this.mensajeriaService.mostrarMensajeError('Por favor verifica los campos o las credenciales!');
      this.cargando = false
      return
    }

    const email:string = this.loginForm.get('email')?.value;

    const valores = {
      email: email.toLocaleLowerCase(),
      password: this.loginForm.get('password')?.value
    }

    this.authService.login(valores).subscribe({
      next: (response) => {
        console.log(response)
        sessionStorage.setItem('token', response.token);
        if (response.tipo_usuario_id === 1) {
          this.router.navigate(['/alumno']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: (err: any) => {
        this.mensajeriaService.mostrarMensajeError('No se ha podido iniciar sesión, verifica tus credenciales o intenta más tarde.');
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      }
    })
  }


  //metodo para validar campos
  validarCampos(): boolean {

    if (this.loginForm.get('email')?.hasError('email') || this.loginForm.get('email')?.hasError('required')) {
      return false
    }
    if (this.loginForm.get('password')?.hasError('required')) {
      return false
    }
    if (this.loginForm.get('password')?.hasError('minlength') || this.loginForm.get('password')?.hasError('maxlength')) {
      return false
    }
    if (this.loginForm.get('email')?.hasError('minlength') || this.loginForm.get('email')?.hasError('maxlength')) {
      return false
    }
    if (this.loginForm.get('email')?.hasError('pattern')) {
      return false
    }

    return true
  }

}
