import { CanActivateFn, Router } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { lastValueFrom } from 'rxjs';
import { User } from '../models/interfaces';

export const authGuardGuard: CanActivateFn = async (route, state) => {
  const authService: AuthServicesService = inject(AuthServicesService);
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);
  const url = state.url;

  const publicRoutes = ['/login', '/forgot-password', '/no_autorizado'];
  if (publicRoutes.includes(url)) {
    return true;
  }

  try {
    await lastValueFrom(authService.isAuthenticated());
    const usuario: User = await lastValueFrom(userService.findUserbyEmail());

    if (usuario.tipo_usuario_id === 1 && !url.startsWith('/alumno')) {
      await router.navigate(['/alumno']);
      return false;
    }

    if (usuario.tipo_usuario_id === 2 && !url.startsWith('/admin')) {
      await router.navigate(['/admin']);
      return false;
    }

    return true; // Ya está en la ruta correcta
  } catch (error: any) {
    await router.navigate(['/login']);
    return false;
  }
};
