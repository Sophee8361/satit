import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { Router } from '@angular/router';
import { Student,StudentsService } from './service/stusents.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export  interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    Toolbar,
    TableModule,
    IconField,
    InputIcon,
    Tag,
    CommonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule
  ],
  templateUrl:'liststundet.component.html',
  providers: [MessageService, ConfirmationService]
  // template: `
  //   <div class="card">
  //     <div class="font-semibold text-xl mb-4">Students Page</div>
  //     <p>Use this page to start from scratch and place your custom content.</p>
  //   </div>
  // `
})
export class ListStudentComponent implements OnInit {
  filterFields: string[] = [
    'NO',
    'STUDENTID',
    'STUDENTCODE',
    'NAME',
    'PREFIXNAME',
    'STUDENTNAME',
    'STUDENTSURNAME',
    'PROGRAMNAME',
    'APPLICANTID',
    'TEL_F',
    'TEL_M',
    'PREFIXID',
    'STUDENTNAMEENG',
    'STUDENTSURNAMEENG',
    'STUDENTSTATUS',
    'FINANCESTATUS',
    'FN',
    'ST',
    'PIC'
  ];
  students = signal<Student[]>([]);
  student!: Student;
  cols!: Column[];
  productDialog: boolean = false;
  statuses!: any[];
  prefixes!: any[];
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  submitted: boolean = false;

  constructor(
    // private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private studentsService: StudentsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDemoData();
  }
  loadDemoData() {
    this.studentsService.getStudents().subscribe((data) => {
      console
      this.students.set(data);
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

    this.prefixes = [
      { PREFIXID: '5', PREFIXNAME: 'เด็กชาย' , PREFIXNAMEENG: 'Mr.'},
      { PREFIXID: '6', PREFIXNAME: 'เด็กหญิง' , PREFIXNAMEENG: 'Ms.'},
    ];


    this.cols = [
      {
        field: 'code',
        header: 'Code',
        customExportHeader: 'Product Code'
      },
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' }
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }


  selectedStudents: unknown;
  goBack() {

  }

  openNew() {

  }

  deleteSelectedProducts() {

  }

  exportCSV() {

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getfinance(status: string) {
    switch (status) {
      case 'N':
        return 'success';
      case '2':
        return 'warn';
      case '3':
        return 'danger';
      default:
        return 'danger';
    }
  }
  getSeverity(status: string) {
    switch (status) {
      case '10':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  editProduct(product: Student) {
    this.student = { ...product };
    this.productDialog = true;
  }

  viewStudent(student: Student) {
    //this.router.navigate(['/student-views', student.STUDENTID]);
    this.router.navigate(['/students/student-views', student.STUDENTID]);

  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  saveStudent() {
    this.submitted = true;

    // ตรวจสอบว่ามีรหัสนักเรียนหรือไม่
    if (this.student.STUDENTID) {
      if (this.student.STUDENTID) {
        // อัปเดตข้อมูล
        this.studentsService.updateStudent(this.student).subscribe({
          next: (response) => {
            console.log(response.message); // แสดงข้อความ "Updated successfully" จาก API
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',  // หรือจะเปลี่ยนเป็น 'Student Updated' ก็ได้ให้ตรงกับข้อมูล
              life: 2000
            });
            this.productDialog = false;  // ปิด dialog หลังจากอัปเดตเสร็จ
            this.loadDemoData();         // โหลดข้อมูลใหม่เพื่ออัปเดตตาราง
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Update failed',
              life: 3000
            });
          }
        });
      } else {
        // สร้างใหม่
        this.studentsService.createStudent(this.student).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Student created successfully' });
          this.productDialog = false;
          this.loadDemoData();
        });
      }
    }
  }
}
