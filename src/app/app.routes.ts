import { Routes } from '@angular/router';
import { AlumnoDashboardComponent } from './alumno/pages/alumno-dashboard/alumno-dashboard.component';
import { AdminDashboardComponent } from './admin/pages/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { SolicitudesComponent } from './admin/pages/admin-dashboard/components/solicitudes/solicitudes.component';
import { AdminTablaComponent } from './admin/pages/admin-dashboard/components/admin-tabla/admin-tabla.component';
import { HistorialResumenComponent } from './alumno/pages/alumno-dashboard/components/historial-resumen/historial-resumen.component';
import { ActividadFormComponent } from './alumno/pages/alumno-dashboard/components/actividad-form/actividad-form.component';
import { TablaHorasComponent } from './alumno/pages/alumno-dashboard/components/tabla-horas/tabla-horas.component';
import { alumnoGuard } from './guards/alumno.guard';
import { adminGuard } from './guards/admin.guard';
import { PerfilComponent } from './shared/components/perfil/perfil.component';
import { GestorOcComponent } from './admin/pages/admin-dashboard/components/gestor-oc/gestor-oc.component';



export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'alumno',
        component: AlumnoDashboardComponent,
        canActivate: [authGuardGuard, alumnoGuard],
        canActivateChild: [authGuardGuard, alumnoGuard],
        children: [
            { path: 'registro_horas', component: ActividadFormComponent },
            { path: 'historial', component: HistorialResumenComponent },
            { path: 'horas_mes', component: TablaHorasComponent },
            { path: 'perfil', component: PerfilComponent },
            { path: '', redirectTo: 'registro_horas', pathMatch: 'full' },
        ]
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuardGuard, adminGuard],
        canActivateChild: [authGuardGuard, adminGuard],
        children: [
            { path: 'solicitudes', component: SolicitudesComponent },
            { path: 'alumnos', component: AdminTablaComponent },
            { path: 'gestor_oc', component: GestorOcComponent },
            { path: 'perfil', component: PerfilComponent },
            { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
        ]
    },
    {
        path: 'perfil',
        component: PerfilComponent,

    },
    //ruta login component
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuardGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [authGuardGuard]
    },
    {
        path: 'no_autorizado',
        component: UnauthorizedComponent,
    },
    {
        path: '**',
        redirectTo: '/login',

    },

];
