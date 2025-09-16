import {Routes} from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () => import('./liststundet').then((c) => c.ListStudentComponent),
    data: {breadcrumb: 'แสดงข้อมูล'}
  },
  {
    path: 'pay',
    loadComponent: () => import('./enrollfee').then((c) => c.EnrollfeeComponent),
    data: {breadcrumb: 'ตรวจสอบหนี้'}
  },
  // {
  //   path: 'detail',
  //   loadComponent: () => import('./detail').then((c) => c.Detail),
  //   data: {breadcrumb: 'Detail'}
  // },
  // {
  //   path: 'edit',
  //   loadComponent: () => import('./edit').then((c) => c.Edit),
  //   data: {breadcrumb: 'Edit'}
  // }
] as Routes;
