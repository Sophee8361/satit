import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';

interface Subject {
  code: string;
  name: string;
}

interface Exam {
  subject: Subject;  // เก็บ object Subject โดยตรง
  examDate: Date;
  examTime: string;
}

@Component({
  selector: 'app-exam-schedule',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SelectModule,
    TableModule,
    Button,
    Calendar,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService,ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>


    <div class="card p-6 shadow-xl rounded-xl bg-white m-4 md:m-8 lg:m-12 font-sans">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b pb-4 gap-2">
        <div class="font-semibold text-2xl text-gray-800">จัดตารางสอบ</div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div class="flex flex-col sm:flex-row sm:gap-6 text-gray-600 font-medium text-sm sm:text-base">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-blue-500"></i>
              <span>ปีการศึกษา: <span class="text-blue-600 font-bold text-lg">{{ environment.acadYear }}</span></span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-sun text-orange-500"></i>
              <span>ภาคเรียน: <span class="text-orange-600 font-bold text-lg">{{ environment.semester }}</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-end gap-4 mt-6">
        <div class="flex-1 min-w-[180px]">
          <label class="block font-semibold mb-2 text-gray-700">ปีการศึกษา</label>
          <p-select
            [options]="years"
            [(ngModel)]="selectedYear"
            placeholder="เลือกปีการศึกษา"
            [showClear]="true"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex-1 min-w-[180px]">
          <label class="block font-semibold mb-2 text-gray-700">ภาคเรียน</label>
          <p-select
            [options]="terms"
            [(ngModel)]="selectedTerm"
            placeholder="เลือกภาคเรียน"
            [showClear]="true"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          ></p-select>
        </div>

        <div class="flex-1 min-w-[180px]">
          <label class="block font-semibold mb-2 text-gray-700">วันที่</label>
          <p-calendar
            [(ngModel)]="selectedDate"
            dateFormat="dd/mm/yy"
            placeholder="เลือกวันที่"
            class="w-full"
            [showIcon]="true"
          ></p-calendar>
        </div>

        <div class="flex-none flex gap-2 mt-6 ml-auto">
          <p-button
            label="ตกลง"
            icon="pi pi-check"
            [raised]="true"
            [loading]="isLoadingSubmit"
            [disabled]="!selectedYear || !selectedTerm || !selectedDate"
            severity="primary"
            (click)="onSubmit()"
          ></p-button>

          <p-button
            label="ล้างค่า"
            [raised]="true"
            icon="pi pi-trash"
            severity="danger"
            (click)="clearAll()"
          ></p-button>
        </div>
      </div>

      <!-- Exam Table -->
      <div *ngIf="exams.length > 0" class="mt-6">
        <div class="flex justify-end mb-2">
          <p-button label="เพิ่มรายการใหม่" icon="pi pi-plus" (click)="showDialog=true"></p-button>
        </div>

        <p-table [value]="exams" [paginator]="true" [rows]="5">
          <ng-template pTemplate="header">
            <tr>
              <th>วิชา</th>
              <th>วันสอบ</th>
              <th>เวลา</th>
              <th>Action</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-exam let-i="rowIndex">
            <tr>
              <td>{{ exam.subject.name }}</td>
              <td>{{ exam.examDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ exam.examTime }}</td>
              <td>
                <p-button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  (click)="confirmDelete(i)">
                </p-button>

              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Add Exam Dialog -->
      <p-dialog header="เพิ่มรายการสอบ" [(visible)]="showDialog" [modal]="true" [closable]="false" [style]="{width: '400px'}">
        <div class="flex flex-col gap-4">
          <div>
            <label class="block mb-2">วิชา</label>
            <!-- เอา optionValue ออก เพื่อให้ ngModel เป็น Subject object -->
            <p-dropdown [options]="subjects" optionLabel="name" [(ngModel)]="newExam.subject" placeholder="เลือกวิชา"></p-dropdown>
          </div>
          <div>
            <label class="block mb-2">วันสอบ</label>
            <p-calendar [(ngModel)]="newExam.examDate" dateFormat="dd/mm/yy" [showIcon]="true"></p-calendar>
          </div>
          <div>
            <label class="block mb-2">เวลา</label>
            <input pInputText type="text" [(ngModel)]="newExam.examTime" placeholder="เช่น 09:00 - 12:00" class="w-full"/>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <p-button label="ยกเลิก" icon="pi pi-times" (click)="showDialog=false" class="p-button-text"></p-button>
            <p-button label="บันทึก" icon="pi pi-check" (click)="addExam()" [disabled]="!newExam.subject || !newExam.examDate || !newExam.examTime"></p-button>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ExamScheduleComponent implements OnInit {
  currentYear = new Date().getFullYear() + 543;
  years = [
    { label: `${this.currentYear}`, value: this.currentYear },
    { label: `${this.currentYear + 1}`, value: this.currentYear + 1 }
  ];
  terms = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: 'Summer', value: 'Summer' }
  ];

  selectedYear?: number;
  selectedTerm?: string;
  selectedDate?: Date;

  exams: Exam[] = [];

  showDialog = false;
  newExam: Exam = { subject: null!, examDate: new Date(), examTime: '' };


  subjects: Subject[] = [
    { code: 'MATH101', name: 'คณิตศาสตร์ 1' },
    { code: 'CHEM101', name: 'เคมี 1' },
    { code: 'PHYS101', name: 'ฟิสิกส์ 1' },
  ];


  isLoadingSubmit = false;
  protected readonly environment = environment;

  constructor(
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.selectedYear || !this.selectedTerm || !this.selectedDate) return;
    this.isLoadingSubmit = true;

    setTimeout(() => {
      this.isLoadingSubmit = false;
      // ตัวอย่าง mock ข้อมูล exam ตามวันที่เลือก
      this.exams = [
        { subject: this.subjects[0], examDate: this.selectedDate!, examTime: '09:00 - 12:00' },
        { subject: this.subjects[1], examDate: this.selectedDate!, examTime: '13:00 - 16:00' },
        { subject: this.subjects[2], examDate: this.selectedDate!, examTime: '17:00 - 19:00' }
      ];
      this.cd.detectChanges();
    }, 500);
  }

  clearAll(): void {
    this.selectedYear = undefined;
    this.selectedTerm = undefined;
    this.selectedDate = undefined;
    this.exams = [];
  }

  addExam(): void {
    if (!this.newExam.subject || !this.newExam.examDate || !this.newExam.examTime) return;

    this.exams.push({
      subject: this.newExam.subject,  // เก็บ object Subject โดยตรง
      examDate: this.newExam.examDate,
      examTime: this.newExam.examTime
    });

    this.showDialog = false;
    this.newExam = { subject: null!, examDate: new Date(), examTime: '' };
    this.cd.detectChanges();
  }

  deleteExam(index: number): void {
    this.exams.splice(index, 1);
    this.cd.detectChanges(); // บังคับ update UI
  }

  confirmDelete(index: number): void {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจว่าต้องการลบรายการนี้หรือไม่?',
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exams.splice(index, 1);
        this.cd.detectChanges();
        this.messageService.add({ severity: 'success', summary: 'ลบเรียบร้อย', detail: 'รายการถูกลบแล้ว' });
      },
      reject: () => {
        // ปฏิเสธ ไม่ต้องทำอะไร
      }
    });
  }

}
