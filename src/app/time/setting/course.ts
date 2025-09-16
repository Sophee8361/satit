import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { catchError, of } from 'rxjs';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Class, ApiCourse, GroupCourse, Level } from '../service/slot.model';

import { CourseService } from '../service/course.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    MultiSelectModule,
    Ripple,
    TableModule,
    TagModule,
    HttpClientModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    IconField,
    InputIcon
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card p-4 shadow-md">
      <div class="font-semibold text-xl mb-4 text-gray-800">จัดการรายวิชา</div>
      <p-toolbar styleClass="mb-4">
        <ng-template pTemplate="start">
          <div class="flex flex-wrap gap-3">
            <div class="equal-width">
              <p-dropdown
                [options]="levels"
                [(ngModel)]="selectedLevel"
                [showClear]="true"
                placeholder="เลือกระดับ"
                optionLabel="name"
                (onChange)="onLevelChange($event)"
                class="w-full"
              ></p-dropdown>
            </div>

            <div class="equal-width">
              <p-dropdown
                [options]="classes"
                [(ngModel)]="selectedClass"
                [showClear]="true"
                placeholder="เลือกชั้น"
                optionLabel="name"
                [disabled]="!selectedLevel"
                (onChange)="onClassChange($event)"
                class="w-full"
              ></p-dropdown>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="end">
          <div class="flex flex-wrap gap-2">
            <p-button
              label="เพิ่มข้อมูล"
              icon="pi pi-plus"
              styleClass="p-button-success"
              (click)="showAddDialog()"
              [disabled]="!selectedLevel || !selectedClass"
            ></p-button>
            <p-iconfield iconPosition="left" class="ml-auto">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                pInputText
                type="text"
                (input)="onGlobalFilterInput($event, dt1)"
                placeholder="ค้นหา"
              />
            </p-iconfield>
          </div>
        </ng-template>
      </p-toolbar>

      <!-- ตาราง -->
      <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">รายวิชา</div>
<!--        {{ selectedLevel?.code }}-->
        <p-table
          #dt1
          [globalFilterFields]="['courseCode', 'courseName', 'timeyear']"
          [value]="courseData"
          [paginator]="true"
          [rows]="10"
          [tableStyle]="{ 'min-width': '50rem' }"
          [rowsPerPageOptions]="[5, 10, 20]"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>กลุ่มรายวิชา</th>
              <th>จำนวน ชม.</th>
              <th class="w-40 text-center">การจัดการ</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-subject>
            <tr>
              <td>{{ subject.courseCode }}</td>
              <td>{{ subject.courseName }}</td>
              <td>{{ subject.groupName }}</td>
              <td>{{ subject.timeyear }}</td>
              <td class="text-center">
                <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-warning mr-2"
                          (click)="editSubject(subject)"></p-button>
                <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-danger"
                          (click)="confirmDelete(subject)"></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5">
                <div class="flex flex-col items-center justify-center py-8">
                  <!-- Info / Warning Icon -->
                  <i class="pi pi-info-circle text-4xl mb-2 text-blue-500"></i>

                  <!-- ข้อความแจ้งเตือน -->
                  <span class="text-lg font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                    {{ tableMessage }}
                  </span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>

    <!-- Dialog เพิ่ม/แก้ไขวิชา -->
    <p-dialog
      header="{{ isEditMode ? 'แก้ไขวิชา' : 'เพิ่มข้อมูลวิชาเรียนใหม่' }}"
      [modal]="true"
      [(visible)]="visibleAddDialog"
      [style]="{ width: '50rem', height: '26rem' }"
      [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <div class="p-fluid grid grid-cols-1 gap-4 md:grid-cols-2">

        <!-- รหัสวิชา -->
        <div class="field col-span-1">
          <label for="new_subject_code" class="font-semibold text-gray-700 block mb-1">รหัสวิชา:</label>
          <input pInputText id="new_subject_code" [(ngModel)]="newSubjectCode" class="w-full" />
        </div>

        <!-- ชื่อวิชา -->
        <div class="field col-span-1">
          <label for="new_subject_name" class="font-semibold text-gray-700 block mb-1">ชื่อวิชา:</label>
          <input pInputText id="new_subject_name" [(ngModel)]="newSubjectName" class="w-full" />
        </div>

        <!-- กลุ่มรายวิชา -->
        <div class="field col-span-1">
          <label for="groupcourse" class="font-semibold text-gray-700 block mb-1">กลุ่มรายวิชา:</label>
          <p-dropdown
            [options]="groupcourse"
            optionLabel="groupName"
            optionValue="groupId"
            [(ngModel)]="selectedGroup"
            placeholder="-- เลือกกลุ่มรายวิชา --"
            class="w-full"
          ></p-dropdown>
        </div>

        <!-- หน่วยชม. -->
        <div class="field col-span-1">
          <label for="new_unit" class="font-semibold text-gray-700 block mb-1">จำนวน ชม.:</label>
          <p-inputNumber
            mode="decimal"
            inputId="new_unit"
            [useGrouping]="false"
            [(ngModel)]="newUnit"
            class="w-full"
          ></p-inputNumber>
        </div>


      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button
            label="ยกเลิก"
            icon="pi pi-times"
            (click)="visibleAddDialog=false"
            severity="secondary"
            class="p-button-outlined"
          ></p-button>
          <p-button
            label="บันทึก"
            icon="pi pi-check"
            (click)="saveSubject()"
            severity="primary"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>


  `,
  styles: [`
    .equal-width {
      width: 200px;
    }
    @media (max-width: 768px) {
      .equal-width {
        width: 100%;
      }
    }
  `]
})
export class CourseComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmService: ConfirmationService,
    private courseService: CourseService
  ) {}

  levels: Level[] = [];
  selectedLevel: Level | undefined;
  groupcourse : GroupCourse[] = [];


  classes: Class[] = [];
  allClasses: Class[] = [];
  selectedClass: Class | undefined;

  courseData: ApiCourse[] = [];
  allSubjectsFromApi: ApiCourse[] = [];



  selectedGroup: string | null = null;
  tableMessage: string = 'ไม่มีข้อมูลวิชาเรียนสำหรับห้องนี้ กรุณาเลือกชั้นและห้องเรียน';

  // Add/Edit Dialog
  visibleAddDialog: boolean = false;
  newSubjectCode: string = '';
  newSubjectName: string = '';
  newUnit: number = 0;
  isEditMode: boolean = false;
  editIndex: number = -1;

  ngOnInit() {
    this.levels = [
      { name: 'ระดับประถม', code: 'PRIMARY' },
      { name: 'ระดับมัธยม', code: 'SECONDARY' }
    ];

    this.groupcourse = [
      { groupId: '1', groupName: 'รายวิชาพื้นฐาน'},
      { groupId: '2', groupName: 'รายวิชา/กิจกรรมเพิ่มเติม'},
      { groupId: '3', groupName: 'กิจกรรมพัฒนาผู้เรียน'},
    ];

    this.allClasses = [
      { name: 'ชั้นประถมศึกษาปีที่ 1', code: 'P1', levelCode: 'PRIMARY' },
      { name: 'ชั้นประถมศึกษาปีที่ 2', code: 'P2', levelCode: 'PRIMARY' },
      { name: 'ชั้นประถมศึกษาปีที่ 3', code: 'P3', levelCode: 'PRIMARY' },
      { name: 'ชั้นประถมศึกษาปีที่ 4', code: 'P4', levelCode: 'PRIMARY' },
      { name: 'ชั้นประถมศึกษาปีที่ 5', code: 'P5', levelCode: 'PRIMARY' },
      { name: 'ชั้นประถมศึกษาปีที่ 6', code: 'P6', levelCode: 'PRIMARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 1', code: 'M1', levelCode: 'SECONDARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 2', code: 'M2', levelCode: 'SECONDARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 3', code: 'M3', levelCode: 'SECONDARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 4', code: 'M4', levelCode: 'SECONDARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 5', code: 'M5', levelCode: 'SECONDARY' },
      { name: 'ชั้นมัธยมศึกษาปีที่ 6', code: 'M6', levelCode: 'SECONDARY' }
    ];
  }

  onGlobalFilterInput(event: Event, dt: any): void {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  onLevelChange(event: DropdownChangeEvent) {
    const selectedLevelCode = event.value?.code;
    this.classes = selectedLevelCode
      ? this.allClasses.filter(grade => grade.levelCode === selectedLevelCode)
      : [];
    this.selectedClass = undefined;
    this.allSubjectsFromApi = [];
    this.courseData = [];
    this.tableMessage = 'กรุณาเลือกชั้น';
  }


  onClassChange(event: DropdownChangeEvent) {
    const selectedClassCode = event.value?.code;
    this.courseData = [];
    this.allSubjectsFromApi = [];
    this.tableMessage = 'กำลังโหลดข้อมูล...';

    if (selectedClassCode) {
      // 🔹 ใส่ Basic Auth ตรงนี้
      const headers = new HttpHeaders({
        Authorization: 'Basic ' + btoa('admin:1234')
      });

      this.http.get<any[]>(
        'https://api-eduservice.yru.ac.th/satit/time/course.php',
        { headers }   // เพิ่ม headers
      ).pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(`โหลดข้อมูลวิชาเรียนสำหรับชั้นเรียน ${selectedClassCode} ล้มเหลว:`, err);
          this.tableMessage = 'ไม่สามารถโหลดข้อมูลจาก API ได้';
          this.messageService.add({severity:'error', summary: 'Error', detail: this.tableMessage});
          return of([]);
        })
      ).subscribe({
        next: (response) => {
          this.allSubjectsFromApi = response.filter(Boolean).map(item => ({
            courseId: item.COURSEID || '',
            courseCode: item.COURCODE || '',
            courseName: item.COURSENAME || '',
            timeyear: item.TIMEYEAR || '',
            groupId: item.GROUPID || '',
            classYear: item.CLASSYEAR || '',
            levelClass: item.LEVELCLASS || '',   // ✅ ต้องใส่
            groupName: item.GROUPNAME || ''      // ✅ ต้องใส่
          }));
          this.courseData = this.allSubjectsFromApi.filter(subject => subject.levelClass === selectedClassCode);
          this.tableMessage = this.courseData.length === 0 ? 'ไม่มีข้อมูลวิชาเรียนสำหรับชั้นนี้' : '';
        }
      });
    } else {
      this.tableMessage = 'กรุณาเลือกชั้น';
    }
  }


  showAddDialog() {
    this.isEditMode = false;
    this.newSubjectCode = '';
    this.newSubjectName = '';
    this.newUnit = 0;
    this.editIndex = -1;
    this.visibleAddDialog = true;
  }

  editSubject(subject: ApiCourse) {
    this.isEditMode = true;
    this.editIndex = this.allSubjectsFromApi.findIndex(s => s.courseId === subject.courseId);

    this.newSubjectCode = subject.courseCode;
    this.newSubjectName = subject.courseName;
    this.newUnit = Number(subject.timeyear);  // แปลง string เป็น number
    this.selectedGroup = subject.groupId;

    this.visibleAddDialog = true;
  }


  saveSubject() {
    if (!this.newSubjectCode || !this.newSubjectName || !this.newUnit || !this.selectedGroup) {
      this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรอกข้อมูลให้ครบ' });
      return;
    }

    const newData: ApiCourse = {
      courseId: this.isEditMode && this.editIndex > -1
        ? this.allSubjectsFromApi[this.editIndex].courseId // ใช้ courseId เดิม
        : Date.now().toString(),
      courseCode: this.newSubjectCode,
      courseName: this.newSubjectName,
      timeyear: this.newUnit.toString(),
      groupId: this.selectedGroup,
      levelClass: this.selectedClass?.code || '',
      classYear: this.selectedClass?.code || '',
      groupName: this.groupcourse.find(g => g.groupId === this.selectedGroup)?.groupName || ''
    };

    console.log('ข้อมูลที่จะส่งไป:', newData);

    if (this.isEditMode && this.editIndex > -1) {
      // 🔹 แก้ไข: update local array
      this.allSubjectsFromApi[this.editIndex] = newData;
      this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'แก้ไขข้อมูลเรียบร้อย' });

      // 🔹 เรียก API แก้ไข (PUT หรือ POST กับ id เดิม)
      this.courseService.updateCourse(newData.courseId, newData).subscribe({
        next: (res) => console.log('API ตอบกลับ (แก้ไข):', res),
        error: (err) => console.error('เกิดข้อผิดพลาดจาก API (แก้ไข):', err)
      });
    } else {
      // 🔹 เพิ่มใหม่
      this.allSubjectsFromApi.push(newData);
      this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: 'เพิ่มวิชาใหม่เรียบร้อย' });

      this.courseService.addCourse(newData).subscribe({
        next: (res) => console.log('API ตอบกลับ (เพิ่ม):', res),
        error: (err) => console.error('เกิดข้อผิดพลาดจาก API (เพิ่ม):', err)
      });
    }

    this.courseData = this.allSubjectsFromApi.filter(s => s.levelClass === this.selectedClass?.code);
    this.visibleAddDialog = false;
  }





  confirmDelete(subject: ApiCourse) {
    this.confirmService.confirm({
      message: `คุณต้องการลบวิชา "${subject.courseName}" หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // ลบจาก allSubjectsFromApi
      //  alert(subject.courseId)
        this.courseService.deleteCourse(subject.courseId).subscribe({
          next: (response) => {
            console.log('API ตอบกลับสำเร็จ (ลบข้อมูล):', response);
            //   this.classStructure = this.classStructure.filter(s => s.ID !== id);
            this.allSubjectsFromApi = this.allSubjectsFromApi.filter(s => s.courseId !== subject.courseId);
            // อัปเดตตารางเฉพาะชั้นที่เลือก
            this.courseData = this.allSubjectsFromApi.filter(s => s.levelClass === this.selectedClass?.code);
            this.messageService.add({ severity: 'success', summary: 'ลบแล้ว', detail: 'ข้อมูลถูกลบเรียบร้อย' });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'ข้อผิดพลาด',
              detail: 'ไม่สามารถลบช่วงเวลาได้: ' + (error.error?.message || error.message),
              life: 5000
            });
            console.error('เกิดข้อผิดพลาดในการลบช่วงเวลา:', error);
          },
          complete: () => {
            console.log('การดำเนินการลบช่วงเวลาเสร็จสมบูรณ์');
          }
        });
      }
    });
  }
}
