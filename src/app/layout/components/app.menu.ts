import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppMenuitem} from './app.menuitem';

@Component({
  selector: '[app-menu]',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `
})
export class AppMenu {
  model: any[] = [
    // {
    //   label: 'Dashboards',
    //   icon: 'pi pi-home',
    //   items: [
    //     {
    //       label: 'Marketing',
    //       icon: 'pi pi-fw pi-gauge',
    //       routerLink: ['/']
    //     },
    //     {
    //       label: 'E-Commerce',
    //       icon: 'pi pi-fw pi-warehouse',
    //       routerLink: ['/dashboard-ecommerce']
    //     },
    //     {
    //       label: 'Banking',
    //       icon: 'pi pi-fw pi-building-columns',
    //       routerLink: ['/dashboard-banking']
    //     }
    //   ]
    // },
    // {separator: true},
    {
      label: 'ประวัตินักเรียน',
      icon: 'pi pi-th-large',
      items: [
        {
          label: 'ประวัตินักเรียน',
          icon: 'pi pi-user',   // 👤 เปลี่ยนเป็น icon บุคคล
          items: [
            {
              label: 'แสดงรายชื่อนักเรียน',
              icon: 'pi pi-users',   // 👥 รายชื่อหลายคน
              routerLink: ['/pages/student/list']
            },
            {
              label: 'Detail',
              icon: 'pi pi-info-circle',   // ℹ️ แสดงรายละเอียด
              routerLink: ['/pages/empty']
            },
            {
              label: 'Edit',
              icon: 'pi pi-pencil',   // ✏️ แก้ไข
              routerLink: ['/apps/blog/edit']
            }
          ]
        },
        {
          label: 'ตรวจสอบภาระหนี้',
          icon: 'pi pi-wallet',   // 👛 หรือ pi pi-money-bill
          routerLink: ['/pages/student/pay']
        },

        // {
        //   label: 'Files',
        //   icon: 'pi pi-fw pi-folder',
        //   routerLink: ['/apps/files']
        // },
        {
          label: 'รายงาน',
          icon: 'pi pi-fw pi-envelope',
          items: [
            {
              label: 'รายงาน1',
              icon: 'pi pi-fw pi-inbox',
              routerLink: ['/apps/mail/inbox']
            },
            {
              label: 'รายงาน2',
              icon: 'pi pi-fw pi-pencil',
              routerLink: ['/apps/mail/compose']
            },
            {
              label: 'รายงาน3',
              icon: 'pi pi-fw pi-comment',
              routerLink: ['/apps/mail/detail/1000']
            }
          ]
        },

        // {
        //   label: 'Task List',
        //   icon: 'pi pi-fw pi-check-square',
        //   routerLink: ['/apps/tasklist']
        // }
      ]
    },
    {separator: true},
    {
      label: 'ตารางเรียนตารางสอน',
      icon: 'pi pi-fw pi-star-fill',
      items: [
        {
          label: 'จัดผู้สอน',
          icon: 'pi pi-user-edit',   // 👨‍🏫 เหมาะกับการกำหนด/แก้ไขครูผู้สอน
          routerLink: ['/time/staff']
        },
        {
          label: 'จัดตารางสอน',
          icon: 'pi pi-calendar',   // 📅 เหมาะกับการวางตารางสอน
          routerLink: ['/time/time']
        },
        {
          label: 'จัดตารางสอนแทน',
          icon: 'pi pi-calendar',   // 📅 เหมาะกับการวางตารางสอน
          routerLink: ['/time/repplacschedule']
        },
        {
          label: 'จัดตารางสอบ',
          icon: 'pi pi-calendar',   // 📅 เหมาะกับการวางตารางสอน
          routerLink: ['/time/examschedule']
        },
        {
          label: 'รายงาน',
          icon: 'pi pi-fw pi-chart-bar', // Changed from pi-envelope
          items: [
            {
              label: 'ตารางสอน',
              icon: 'pi pi-calendar', // Changed from pi-time-edit
              routerLink: ['/time/schedule']
            },
            {
              label: 'ตารางสอนคุณครู',
              icon: 'pi pi-calendar', // Changed from pi-time-edit
              routerLink: ['/time/staffschedule']
            }
          ]
        },



        {
          label: 'ตั้งค่า',
          icon: 'pi pi-fw pi-id-card',
          items: [
            {
              label: 'คาบเรียน',
              icon: 'pi pi-clock',   // ⏰ เหมาะกับเวลา/คาบเรียน
              routerLink: ['/time/slot']
            },
            {
              label: 'กลุ่มวิชา',
              icon: 'pi pi-book',   // 📚 เหมาะกับวิชา/การเรียน
              routerLink: ['/time/course']
            },
            {
              label: 'อาจารย์ประจำชั้น',
              icon: 'pi pi-users',   // 👨‍🏫👩‍🏫 เหมาะกับครู/ผู้สอน
              routerLink: ['/time/staffs']
            },
            {
              label: 'ครูผู้สอน',
              icon: 'pi pi-users',   // 👨‍🏫👩‍🏫 เหมาะกับครู/ผู้สอน
              routerLink: ['/time/teacher']
            }
          ]
        },


        // {
        //   label: 'Button',
        //   icon: 'pi pi-fw pi-box',
        //   routerLink: ['/uikit/button']
        // },
        // {
        //   label: 'Table',
        //   icon: 'pi pi-fw pi-table',
        //   routerLink: ['/uikit/table']
        // },
        // {
        //   label: 'List',
        //   icon: 'pi pi-fw pi-list',
        //   routerLink: ['/uikit/list']
        // },
        // {
        //   label: 'Tree',
        //   icon: 'pi pi-fw pi-share-alt',
        //   routerLink: ['/uikit/tree']
        // },
        // {
        //   label: 'Panel',
        //   icon: 'pi pi-fw pi-tablet',
        //   routerLink: ['/uikit/panel']
        // },
        // {
        //   label: 'Overlay',
        //   icon: 'pi pi-fw pi-clone',
        //   routerLink: ['/uikit/overlay']
        // },
        // {
        //   label: 'Media',
        //   icon: 'pi pi-fw pi-image',
        //   routerLink: ['/uikit/media']
        // },
        // {
        //   label: 'Menu',
        //   icon: 'pi pi-fw pi-bars',
        //   routerLink: ['/uikit/menu']
        // },
        // {
        //   label: 'Message',
        //   icon: 'pi pi-fw pi-comment',
        //   routerLink: ['/uikit/message']
        // },
        // {
        //   label: 'File',
        //   icon: 'pi pi-fw pi-file',
        //   routerLink: ['/uikit/file']
        // },
        // {
        //   label: 'Chart',
        //   icon: 'pi pi-fw pi-chart-bar',
        //   routerLink: ['/uikit/charts']
        // },
        // {
        //   label: 'Timeline',
        //   icon: 'pi pi-fw pi-calendar',
        //   routerLink: ['/uikit/timeline']
        // },
        // {
        //   label: 'Misc',
        //   icon: 'pi pi-fw pi-circle-off',
        //   routerLink: ['/uikit/misc']
        // }
      ]
    },
 //   {separator: true},
  //   {
  //     label: 'Prime Blocks',
  //     icon: 'pi pi-fw pi-prime',
  //     items: [
  //       {
  //         label: 'Free Blocks',
  //         icon: 'pi pi-fw pi-eye',
  //         routerLink: ['/blocks']
  //       },
  //       {
  //         label: 'All Blocks',
  //         icon: 'pi pi-fw pi-globe',
  //         url: ['https://primeblocks.org'],
  //         target: '_blank'
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'Utilities',
  //     icon: 'pi pi-fw pi-compass',
  //     items: [
  //       {
  //         label: 'Figma',
  //         icon: 'pi pi-fw pi-pencil',
  //         url: ['https://www.figma.com/design/eMNbyxsMp3H0PQbMyyGK77/Preview-%7C-Poseidon?node-id=0-1&t=wJRSplRnKvjqju9S-1'],
  //         target: '_blank'
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'Pages',
  //     icon: 'pi pi-fw pi-briefcase',
  //     items: [
  //       {
  //         label: 'Landing',
  //         icon: 'pi pi-fw pi-globe',
  //         routerLink: ['/landing']
  //       },
  //       {
  //         label: 'Auth',
  //         icon: 'pi pi-fw pi-user',
  //         items: [
  //           {
  //             label: 'Login',
  //             icon: 'pi pi-fw pi-sign-in',
  //             routerLink: ['/landing/login']
  //           },
  //
  //           {
  //             label: 'Error',
  //             icon: 'pi pi-fw pi-times-circle',
  //             routerLink: ['/landing/error']
  //           },
  //           {
  //             label: 'Access Denied',
  //             icon: 'pi pi-fw pi-lock',
  //             routerLink: ['/landing/access']
  //           },
  //           {
  //             label: 'Register',
  //             icon: 'pi pi-fw pi-user-plus',
  //             routerLink: ['/landing/register']
  //           },
  //           {
  //             label: 'Forgot Password',
  //             icon: 'pi pi-fw pi-question',
  //             routerLink: ['/landing/forgot-password']
  //           },
  //           {
  //             label: 'New Password',
  //             icon: 'pi pi-fw pi-cog',
  //             routerLink: ['/landing/new-password']
  //           },
  //           {
  //             label: 'Verification',
  //             icon: 'pi pi-fw pi-envelope',
  //             routerLink: ['/landing/verification']
  //           },
  //           {
  //             label: 'Lock Screen',
  //             icon: 'pi pi-fw pi-eye-slash',
  //             routerLink: ['/landing/lock-screen']
  //           }
  //         ]
  //       },
  //       {
  //         label: 'Crud',
  //         icon: 'pi pi-fw pi-pencil',
  //         routerLink: ['/pages/crud']
  //       },
  //       {
  //         label: 'Invoice',
  //         icon: 'pi pi-fw pi-dollar',
  //         routerLink: ['/pages/invoice']
  //       },
  //       {
  //         label: 'About Us',
  //         icon: 'pi pi-fw pi-user',
  //         routerLink: ['/pages/aboutus']
  //       },
  //       {
  //         label: 'Help',
  //         icon: 'pi pi-fw pi-question-circle',
  //         routerLink: ['/pages/help']
  //       },
  //       {
  //         label: 'Oops',
  //         icon: 'pi pi-fw pi-sign-in',
  //         routerLink: ['/landing/oops']
  //       },
  //       {
  //         label: 'Not Found',
  //         icon: 'pi pi-fw pi-exclamation-circle',
  //         routerLink: ['/pages/notfound']
  //       },
  //       {
  //         label: 'Empty',
  //         icon: 'pi pi-fw pi-circle-off',
  //         routerLink: ['/pages/empty']
  //       },
  //       {
  //         label: 'FAQ',
  //         icon: 'pi pi-fw pi-question',
  //         routerLink: ['/pages/faq']
  //       },
  //       {
  //         label: 'Contact Us',
  //         icon: 'pi pi-fw pi-phone',
  //         routerLink: ['/landing/contact']
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'E-Commerce',
  //     icon: 'pi pi-fw pi-wallet',
  //     items: [
  //       {
  //         label: 'Product Overview',
  //         icon: 'pi pi-fw pi-image',
  //         routerLink: ['/ecommerce/product-overview']
  //       },
  //       {
  //         label: 'Product List',
  //         icon: 'pi pi-fw pi-list',
  //         routerLink: ['/ecommerce/product-list']
  //       },
  //       {
  //         label: 'New Product',
  //         icon: 'pi pi-fw pi-plus',
  //         routerLink: ['/ecommerce/new-product']
  //       },
  //       {
  //         label: 'Shopping Cart',
  //         icon: 'pi pi-fw pi-shopping-cart',
  //         routerLink: ['/ecommerce/shopping-cart']
  //       },
  //       {
  //         label: 'Checkout Form',
  //         icon: 'pi pi-fw pi-check-square',
  //         routerLink: ['/ecommerce/checkout-form']
  //       },
  //       {
  //         label: 'Order History',
  //         icon: 'pi pi-fw pi-history',
  //         routerLink: ['/ecommerce/order-history']
  //       },
  //       {
  //         label: 'Order Summary',
  //         icon: 'pi pi-fw pi-file',
  //         routerLink: ['/ecommerce/order-summary']
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'User Management',
  //     icon: 'pi pi-fw pi-user',
  //     items: [
  //       {
  //         label: 'List',
  //         icon: 'pi pi-fw pi-list',
  //         routerLink: ['/profile/list']
  //       },
  //       {
  //         label: 'Create',
  //         icon: 'pi pi-fw pi-plus',
  //         routerLink: ['/profile/create']
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'Hierarchy',
  //     icon: 'pi pi-fw pi-align-left',
  //     items: [
  //       {
  //         label: 'Submenu 1',
  //         icon: 'pi pi-fw pi-align-left',
  //         items: [
  //           {
  //             label: 'Submenu 1.1',
  //             icon: 'pi pi-fw pi-align-left',
  //             items: [
  //               {
  //                 label: 'Submenu 1.1.1',
  //                 icon: 'pi pi-fw pi-align-left'
  //               },
  //               {
  //                 label: 'Submenu 1.1.2',
  //                 icon: 'pi pi-fw pi-align-left'
  //               },
  //               {
  //                 label: 'Submenu 1.1.3',
  //                 icon: 'pi pi-fw pi-align-left'
  //               }
  //             ]
  //           },
  //           {
  //             label: 'Submenu 1.2',
  //             icon: 'pi pi-fw pi-align-left',
  //             items: [
  //               {
  //                 label: 'Submenu 1.2.1',
  //                 icon: 'pi pi-fw pi-align-left'
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         label: 'Submenu 2',
  //         icon: 'pi pi-fw pi-align-left',
  //         items: [
  //           {
  //             label: 'Submenu 2.1',
  //             icon: 'pi pi-fw pi-align-left',
  //             items: [
  //               {
  //                 label: 'Submenu 2.1.1',
  //                 icon: 'pi pi-fw pi-align-left'
  //               },
  //               {
  //                 label: 'Submenu 2.1.2',
  //                 icon: 'pi pi-fw pi-align-left'
  //               }
  //             ]
  //           },
  //           {
  //             label: 'Submenu 2.2',
  //             icon: 'pi pi-fw pi-align-left',
  //             items: [
  //               {
  //                 label: 'Submenu 2.2.1',
  //                 icon: 'pi pi-fw pi-align-left'
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {separator: true},
  //   {
  //     label: 'Start',
  //     icon: 'pi pi-fw pi-download',
  //     items: [
  //       {
  //         label: 'Buy Now',
  //         icon: 'pi pi-fw pi-shopping-cart',
  //         url: 'https://www.primefaces.org/store'
  //       },
  //       {
  //         label: 'Documentation',
  //         icon: 'pi pi-fw pi-info-circle',
  //         routerLink: ['/documentation']
  //       }
  //     ]
  //   }
  ];
}
