import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralModule } from '../../modules/general/general.module';
import { UserService } from '../../../services/user.service';
import { lastValueFrom } from 'rxjs';
import { MensajeriaService } from '../../../services/mensajeria.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GeneralModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  private fb = inject(FormBuilder)
  private userService = inject(UserService)
  private mensajeriaService = inject(MensajeriaService)

  profileForm: FormGroup = this.fb.group({
    rut: [''],
    nombre: [''],
    fono: [''],
    email: [''],
    newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),Validators.minLength(8), Validators.maxLength(50)]],
    newPassword2: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),Validators.minLength(8), Validators.maxLength(50)]]
  })
  changePassword: boolean = false
  buttonText: string = 'Cambiar contraseña'

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  async ngOnInit() {
    await this.obtenerUsuario()
  }

  private async obtenerUsuario() {
    try {
      const response = await lastValueFrom(this.userService.findUserbyEmail())
      this.profileForm.get('rut')?.setValue(response.usuario.run)
      this.profileForm.get('nombre')?.setValue(`${response.usuario.nombre} ${response.usuario.apellido_paterno} ${response.usuario.apellido_materno}`)
      this.profileForm.get('fono')?.setValue(response.usuario.fono)
      this.profileForm.get('email')?.setValue(response.usuario.email)
    } catch (error: any) {
      console.error(error)
    }
  }

  isChangePassword() {
    if (!this.changePassword) {
      this.changePassword = true
      this.buttonText = 'Cancelar cambios'
    } else {
      this.changePassword = false
      this.buttonText = 'Cambiar contraseña'
    }
  }

  async updatePassword() {
    try {

      if (!this.userService.validarPerfilForm(this.profileForm)) {
        return
      }

      const newPassword = this.profileForm.get('newPassword')?.value

      await lastValueFrom(this.userService.actualizarDatos(newPassword))

      this.mensajeriaService.mostrarMensajeExito('Contraseña actualizada!')

    } catch (error: any) {
      console.error(error)
    }
  }

  hasErrors(campo: string, typeError: string) {
    return this.profileForm.get(campo)?.touched && this.profileForm.get(campo)?.hasError(typeError)
  }


}

