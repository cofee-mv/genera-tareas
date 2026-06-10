// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./features/auth/registro/registro.component').then(m => m.RegistroComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'proyectos',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/proyectos/lista/lista-proyectos.component').then(m => m.ListaProyectosComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./features/proyectos/form/proyecto-form.component').then(m => m.ProyectoFormComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/proyectos/detalle/detalle-proyecto.component').then(m => m.DetalleProyectoComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () =>
              import('./features/proyectos/form/proyecto-form.component').then(m => m.ProyectoFormComponent)
          }
        ]
      },
      {
        path: 'tareas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/tareas/lista/lista-tareas.component').then(m => m.ListaTareasComponent)
          },
          {
            path: 'nueva',
            loadComponent: () =>
              import('./features/tareas/form/tarea-form.component').then(m => m.TareaFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/tareas/detalle/detalle-tarea.component').then(m => m.DetalleTareaComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () =>
              import('./features/tareas/form/tarea-form.component').then(m => m.TareaFormComponent),
          }
        ]
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/usuarios/lista/lista-usuarios.component').then(m => m.ListaUsuariosComponent)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.component').then(m => m.PerfilComponent),
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
