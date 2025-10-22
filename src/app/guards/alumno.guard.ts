import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { User } from '../models/interfaces';
import { lastValueFrom } from 'rxjs';

export const alumnoGuard: CanActivateFn = async (route, state) => {

  const userService: UserService = inject(UserService);
  const url = state.url;
  const router: Router = inject(Router)

  try {
    const usuario: User = await lastValueFrom(userService.findUserbyEmail());
    if(usuario.tipo_usuario_id === 2 && url.startsWith('/alumno')){
      router.navigate(['/no_autorizado'])
      return false
    }

    return true
  } catch (error: any) {
    router.navigate(['/login']); 
    return false;
  }

  return true;
};
