import { Routes } from '@angular/router';
import { AppLayout } from './layout/components/app.layout';
import { AuthGuard } from './pages/auth/auth.guard';
import { LandingLayout } from './layout/components/app.landinglayout';


export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/student/liststundet').then((c) => c.ListStudentComponent),
        data: {breadcrumb: 'E-Commerce Dashboard'}
      },
      {
        path: 'pages',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/pages.routes'),
        data: {breadcrumb: 'ระเบียนประวัติ'}
      },
      {
        path: 'times',
        canActivate: [AuthGuard],
        loadChildren: () => import('./time/time.routes'),
        data: {breadcrumb: 'ตารางเรียน'}
      },
      {
        path: 'apps',
        loadChildren: () => import('./apps/apps.routes'),
        data: {breadcrumb: 'Apps'}
      }
    ]
  },
  {
    path: 'auth',
    component: LandingLayout,
    //   canActivate: [LoginGuard],
    loadChildren: () => import('./pages/auth/auth.routes')
  }
];
