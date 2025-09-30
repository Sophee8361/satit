import {Routes} from '@angular/router';

export default [
  {
    path: 'slot',
    loadComponent: () => import('./setting/slot').then((c) => c.SlotComponent),
    data: {breadcrumb: 'คาบเรียน'}
  },
  {
    path: 'time',
    loadComponent: () => import('./classtime').then((c) => c.ScheduleTableComponent),
    data: {breadcrumb: 'จัดตารางสอน'}
  },
  {
    path: 'staff',
    loadComponent: () => import('./addstaff').then((c) => c.AddStaffComponent),
    data: {breadcrumb: 'กำหนดผู้สอน'}
  },
  {
    path: 'course',
    loadComponent: () => import('./setting/course').then((c) => c.CourseComponent),
    data: {breadcrumb: 'รายวิชา'}
  },
  {
    path: 'teacher',
    loadComponent: () => import('./setting/officer').then((c) => c.OfficerComponent),
    data: {breadcrumb: 'ครูผู้สอน'}
  },
  {
    path: 'schedule',
    loadComponent: () => import('./report/schedule').then((c) => c.ScheduleComponent),
    data: {breadcrumb: 'ตารางสอน'}
  },
  {
    path: 'staffschedule',
    loadComponent: () => import('./report/staffschedule').then((c) => c.StaffscheduleComponent),
    data: {breadcrumb: 'ตารางสอนคุณครู'}
  },
  {
    path: 'examschedule',
    loadComponent: () => import('./examschedule').then((c) => c.ExamScheduleComponent),
    data: {breadcrumb: 'ตารางสอนคุณครู'}
  },

  {
    path: 'repplacschedule',
    loadComponent: () => import('./chekschedule').then((c) => c.CheckScheduleComponent),
    data: {breadcrumb: 'ตารางสอนแทน'}
  },
  {
    path: 'app',
    loadComponent: () => import('./chekschedule').then((c) => c.CheckScheduleComponent),
    data: {breadcrumb: 'App'}
  }

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
