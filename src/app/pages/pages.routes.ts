import {Routes} from '@angular/router';
import { AuthGuard } from '../../../../exam/src/app/pages/auth/auth.guard';


export default [
  {
    path: 'student',
    loadChildren: () => import('./student/student.routes'),
    data: {breadcrumb: 'นักเรียน'}
  },
  {path: '**', redirectTo: '/notfound'}
] as Routes;
