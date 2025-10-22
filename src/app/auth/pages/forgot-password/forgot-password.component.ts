import { Component, inject } from '@angular/core';
import { GeneralModule } from '../../../shared/modules/general/general.module';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServicesService } from '../../../services/auth-services.service';
import { MensajeriaService } from '../../../services/mensajeria.service';

@Component({
  selector: 'app-forgot-password',
  imports: [GeneralModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthServicesService)
  private mensajeService = inject(MensajeriaService)

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email,Validators.minLength(5), Validators.maxLength(50),Validators.pattern(/^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/)]]
  })
  cargando: boolean = false

  //contador de caracteres
  showCounter(field: string): number {
    return this.forgotForm.get(field)?.value.length || 0
  }

  //mostrar error
  hasError(typeError: string): boolean {
    if (this.forgotForm.get('email')?.touched && this.forgotForm.get('email')?.hasError(typeError)) {
      return true
    }
    return false
  }

  async recuperarClave() {
    this.cargando = true

    if (this.forgotForm.get('email')?.hasError('email') || this.forgotForm.get('email')?.hasError('required')) {
      this.mensajeService.mostrarMensajeError('Por favor verifica tu correo electronico!')
      this.cargando = false
      return
    }

    const email:string = this.forgotForm.get('email')?.value
    const valores = email.toLocaleLowerCase()

    try {
      await lastValueFrom(this.authService.recuperarClave(valores))
      this.mensajeService.mostrarMensajeExito('Contraseña actualizada!, en instantes te llegara un correo con tu nueva contraseña!')
    } catch (error: any) {
      this.mensajeService.mostrarMensajeError('Ha ocurrido un error al actualizar tu contraseña!')
      console.log(error)
    } finally {
      this.cargando = false
    }

  }


}
