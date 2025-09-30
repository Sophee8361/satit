import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TH_Sarabun } from './../fonts/TH_Sarabun.base64';

import { ClasstimeService } from '../service/classstime.service';
import { SlotService } from '../service/slot.service';
import { ScheduleService } from '../service/schedule.service';
import { environment } from "../../../../../environments/environment";
import { ClassStructure, Schedule, TeachingSchedule } from '../service/model/classtime.model';
import { LEVELS, CLASSES, DAYS, ROOMS } from '../service/time.constant';
import { Level, Class, Room, SlotModel } from '../service/slot.model';
import { AuthService } from '../../pages/auth/auth.service';
import { AuthLocalStorageService } from '../../../../../exam/src/app/pages/auth/auth-local-storage.service';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fluid } from 'primeng/fluid';
import { Tooltip } from 'primeng/tooltip';
import { OfficerModel } from '../service/model/officer.model';
import { OfficerService } from '../service/officer.service';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    Dialog,
    Button,
    InputText,
    TableModule,
    Select,
    Textarea,
    Fluid,
    ConfirmDialog,
    Tooltip
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast position="top-right" key="t1"></p-toast>
    <div class="card p-6 shadow-lg rounded-xl space-y-6">
    <div class="font-semibold text-xl mb-4 text-gray-800">ตารางสอน</div>
    <div class="flex flex-wrap items-center gap-4 mt-6">
      <div class="flex-1 min-w-[150px]">
        <label class="block font-semibold mb-2 text-gray-700">ปีการศึกษา</label>
        <p-select
          [options]="years"
          [(ngModel)]="selectedYear"
          placeholder="เลือกปีการศึกษา"
          [showClear]="true"
          class="w-full"
          (onChange)="onFilterChange()"
        ></p-select>
      </div>

      <div class="flex-1 min-w-[150px]">
        <label class="block font-semibold mb-2 text-gray-700">ภาคเรียน</label>
        <p-select
          [options]="terms"
          [(ngModel)]="selectedTerm"
          placeholder="เลือกภาคเรียน"
          [showClear]="true"
          class="w-full"
          (onChange)="onFilterChange()"
        ></p-select>
      </div>

      <div class="flex-1 min-w-[150px]">
        <label class="block font-semibold mb-2 text-gray-700">ครูผู้สอน</label>
        <p-select
          [options]="officers"
          [(ngModel)]="Teacher"
          optionLabel="FULLNAME"
          placeholder="ผู้สอน"
          [showClear]="true"
          [filter]="true"
          [disabled]="!selectedYear || !selectedTerm"
          class="w-full">
        </p-select>


        <!--        <p-dropdown-->
<!--          [options]="officers"-->
<!--          optionLabel="FULLNAME"-->
<!--          optionValue="STAFFID"-->
<!--          [filter]="true"-->
<!--          [(ngModel)]="substituteTeacher"-->
<!--          placeholder="เลือกผู้สอนแทน"-->
<!--          styleClass="w-full"-->
<!--          filterPlaceholder="ค้นหาผู้สอน..."-->
<!--          [showClear]="true"-->
<!--        ></p-dropdown>-->
      </div>


      <div class="flex-none mt-6">
        <p-button
          label="ตกลง"
          icon="pi pi-check"
          [raised]="true"
          class="mr-2"
          [loading]="isLoadingSubmit"
          severity="secondary"
          (click)="onSubmit()"
          [disabled]="!selectedYear || !selectedTerm"
        ></p-button>

        <!-- ปุ่มล้างค่าทั้งหมด -->
        <p-button
          label="ล้างค่า"
          [raised]="true"
          icon="pi pi-trash"
          severity="secondary"
          (click)="clearAll()"
        ></p-button>

      </div>
    </div>

    <div class="overflow-x-auto mt-4">
      <p-button
        label="พิมพ์ PDF"
        icon="pi pi-print"
        (click)="printPDF()"
        severity="info"
        [disabled]="!ScheduleData || ScheduleData.length === 0">
      </p-button>
      <p-button
        label="พิมพ์ตาราง (Window Print)"
        icon="pi pi-print"
        (click)="printWindow()"
        severity="success"
        class="ml-2"
        [disabled]="!ScheduleData || ScheduleData.length === 0">
      </p-button>


      <table class="table-auto border-collapse border border-gray-400 w-full text-center mt-4">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-400 px-2 py-1" rowspan="2">วัน / เวลา</th>
            <th class="border border-gray-400 px-2 py-1" [attr.colspan]="timeslots.slice(0,4).length">คาบเช้า</th>
            <th class="border border-gray-400 px-2 py-1" rowspan="2"
                style="writing-mode: vertical-rl; transform: rotate(180deg); background-color: #ffeb99; font-weight: bold;">พักกลางวัน</th>
            <th class="border border-gray-400 px-2 py-1" [attr.colspan]="timeslots.slice(4).length">คาบบ่าย</th>
          </tr>
          <tr class="bg-gray-100">
            <th *ngFor="let slot of timeslots.slice(0,4)" class="border border-gray-400 px-2 py-1">
              คาบ {{ slot.TIMESLOTID }}<br>
              <small>{{ slot.SLOTFROM }} - {{ slot.SLOTTO }}</small>
            </th>
            <th *ngFor="let slot of timeslots.slice(4)" class="border border-gray-400 px-2 py-1">
              คาบ {{ slot.TIMESLOTID }}<br>
              <small>{{ slot.SLOTFROM }} - {{ slot.SLOTTO }}</small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let day of days; let di = index">
            <td class="font-bold p-4 text-gray-800 border border-gray-400 relative">
              <!-- แถบสีด้านซ้าย -->
              <span
                class="absolute left-0 top-0 h-full w-2"
                [ngStyle]="{'background-color': getDayColor(day.code)}">
              </span>
              <!-- ข้อความ -->
              <span class="ml-3">{{ day.name }}</span>
            </td>
            <td *ngFor="let slot of timeslots.slice(0,4)"
                class="border border-gray-400 px-2 py-6"
                [ngClass]="{'highlight-cell': hasSchedule(day.code, slot.TIMESLOTID)}">
              {{ getScheduleText(day.code, slot.TIMESLOTID) }}
            </td>
            <td *ngIf="di === 0" class="border border-gray-400 font-bold text-center align-middle"
                [attr.rowspan]="days.length"
                style="writing-mode: vertical-rl; transform: rotate(180deg); background-color: #ffeb99;">
              พักกลางวัน
            </td>
            <td *ngFor="let slot of timeslots.slice(4)"
                class="border border-gray-400 px-2 py-6"
                [ngClass]="{'highlight-cell': hasSchedule(day.code, slot.TIMESLOTID)}">
              {{ getScheduleText(day.code, slot.TIMESLOTID) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [
    `
      .highlight-cell {
        background-color: #60a5fa;
        color: white;
        font-weight: bold;
        border-radius: 0.25rem;
        white-space: pre-line;
      }
      th, td { text-align: center; white-space: pre-line; }
      table { font-size: 14px; }
    `
  ]
})
export class StaffscheduleComponent implements OnInit {
  currentYear = new Date().getFullYear() + 543;
  years: number[] = [this.currentYear, this.currentYear + 1];
  terms: string[] = ['1', '2', 'Summer'];
  selectedYear?: string;
  selectedTerm?: string;
  officers: OfficerModel[] = [];
  Teacher: OfficerModel | null = null;

  filteredClasses: Class[] = [];
  selectedLevel?: Level;
  selectedClass?: Class;
  rooms = ROOMS;
  selectedRoom?: Room;
  days = DAYS;
  timeslots: SlotModel[] = [];
  ScheduleData: TeachingSchedule[] = [];

  isLoadingSubmit = false;
  isLoadingClear = false;

  constructor(
    private officerService: OfficerService,
    private ScheduleService: ScheduleService,
    private http: HttpClient,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSlot();
    this.getOfficers()
  }

  getOfficers() {
    this.officerService.getOfficers().subscribe({
      next: res => (this.officers = res),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'โหลดผู้สอนไม่สำเร็จ',
          life: 5000
        })
    });
  }

  loadSlot() {
    const apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/slot.php';
    const headers = {
      'Authorization': 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    };
    this.http.get<SlotModel[]>(apiUrl, { headers }).subscribe({
      next: (res) => this.timeslots = res,
      error: () => this.messageService.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'โหลดข้อมูลคาบเรียนไม่สำเร็จ', life: 5000 })
    });
  }

  onFilterChange() { this.ScheduleData = []; this.cd.markForCheck(); }
  onClassChange() { this.ScheduleData = []; this.cd.markForCheck(); }

  onSubmit() {
    if (!this.selectedYear || !this.selectedTerm) return;
    const teacherId = this.Teacher?.STAFFID || null;
    const teacherName = this.Teacher?.FULLNAME || '-';
    alert(`คุณครูผู้สอน: ${teacherName} (ID: ${teacherId})`);

    this.ScheduleService.getStaffSchedule({
      year: this.selectedYear,
      term: this.selectedTerm,
      teacherId: teacherId

    }).subscribe({
      next: (res) => {
        this.ScheduleData = res;
        this.cd.markForCheck();
        this.isLoadingSubmit = true;
        // สมมุติ async call
        setTimeout(() => {
          this.isLoadingSubmit = false;
          // ทำงานเสร็จ
        }, 2000);
        if (!this.ScheduleData || this.ScheduleData.length === 0) {
          this.messageService.add({ key: 't1',severity: 'warn', summary: 'ไม่มีข้อมูล', detail: 'ไม่พบตารางสอนสำหรับตัวเลือกที่กำหนด', life: 5000 });
        } else {
          this.messageService.add({ key: 't1',severity: 'success', summary: 'เรียบร้อย', detail: 'โหลดตารางสอนเรียบร้อยแล้ว', life: 3000 });
        }
      },
      error: () => this.messageService.add({ key: 't1', severity: 'error', summary: 'ผิดพลาด', detail: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', life: 5000 })
    });
  }

  hasSchedule(dayId: string, slotId: string): boolean {
    return this.ScheduleData.some(s => s.DAYID === dayId && s.TIMESLOTID === slotId);
  }

  getScheduleText(dayId: string, slotId: string): string {
    const item = this.ScheduleData.find(s => s.DAYID === dayId && s.TIMESLOTID === slotId);
    return item ? `${item.COURSENAME}\n(${item.STAFFNAME} ${item.STAFFSERNAME})` : '';
  }

  printPDF() {
    if (!this.ScheduleData || this.ScheduleData.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.addFileToVFS('THSarabun.ttf', TH_Sarabun);
    doc.addFont('THSarabun.ttf', 'THSarabun', 'normal');
    doc.addFont('THSarabun.ttf', 'THSarabun', 'bold');
    doc.setFont('THSarabun', 'bold');
    doc.setFontSize(12);

    // ✅ กำหนดขอบบนใหม่
    const topMargin = 30;   // เดิม 10 → เลื่อนลงมาอีก
    const lineHeight = 7;

    const title = `โรงเรียนสาธิตมหาวิทยาลัยราชภัฏยะลา\nปีการศึกษา: ${this.selectedYear || '-'} ภาคเรียน: ${this.selectedTerm || '-'} ระดับ: ${this.selectedLevel?.name || '-'} ชั้นเรียน: ${this.selectedClass?.name || '-'} ห้อง: ${this.selectedRoom?.name || '-'}`;
    const lines = doc.splitTextToSize(title, 280);
    const pageWidth = doc.internal.pageSize.getWidth();

    lines.forEach((line: string, index: number) => {
      const textWidth = doc.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2;
      const y = topMargin + index * lineHeight;
      doc.text(line, x, y);
    });

    const head: any[] = [
      [
        { content: 'วัน / เวลา', styles: { font: 'THSarabun', fontStyle: 'bold', halign: 'center' as const } },
        ...this.timeslots.slice(0,4).map(s => ({ content: `คาบ ${s.TIMESLOTID}\n${s.SLOTFROM}-${s.SLOTTO}`, styles: { font: 'THSarabun', fontStyle: 'normal', halign: 'center' as const } })),
        { content: 'พักกลางวัน', styles: { font: 'THSarabun', fontStyle: 'bold', halign: 'center' as const } },
        ...this.timeslots.slice(4).map(s => ({ content: `คาบ ${s.TIMESLOTID}\n${s.SLOTFROM}-${s.SLOTTO}`, styles: { font: 'THSarabun', fontStyle: 'normal', halign: 'center' as const } }))
      ]
    ];

    const body: any[] = this.days.map((day, di) => {
      const row: any[] = [day.name];

      // เช้า (4 คาบแรก)
      this.timeslots.slice(0,4).forEach(slot => {
        const sch = this.ScheduleData.find(s => s.DAYID === day.code && s.TIMESLOTID === slot.TIMESLOTID);
        row.push(sch ? `${sch.COURSENAME}\n\n${sch.STAFFNAME} ${sch.STAFFSERNAME}` : '');
      });

      // พักกลางวัน (แสดงเฉพาะแถวแรก แล้ว rowSpan รวมทุกวัน)
      if (di === 0) {
        row.push({
          content: 'พักกลางวัน',
          rowSpan: this.days.length,
          styles: {
            font: 'THSarabun',
            halign: 'center' as const,
            valign: 'middle',   // 🔹 จัดกึ่งกลางแนวตั้ง
            textRotation: 90    // 🔹 หมุนข้อความ 90 องศา
          }
        });
      }

      // บ่าย (คาบหลังพัก)
      this.timeslots.slice(4).forEach(slot => {
        const sch = this.ScheduleData.find(s => s.DAYID === day.code && s.TIMESLOTID === slot.TIMESLOTID);
        row.push(sch ? `${sch.COURSENAME}\n\n${sch.STAFFNAME} ${sch.STAFFSERNAME}` : '');
      });

      return row;
    });


    autoTable(doc, {
      head,
      body,
      theme: 'grid',
      styles: { font: 'THSarabun', fontStyle: 'normal', fontSize: 8, halign: 'center' as const, valign: 'middle', cellPadding: 2 },
      headStyles: { fillColor: [200,200,200], font: 'THSarabun', fontStyle: 'bold', fontSize: 10 },
      startY: topMargin + lines.length * lineHeight + 5, // ✅ ตารางเริ่มต่ำกว่าหัว
      tableWidth: 'auto'
    });

    doc.save('schedule.pdf');
  }


  clearAll() {
    this.selectedYear = undefined;
    this.selectedTerm = undefined;
    this.selectedLevel = undefined;
    this.selectedClass = undefined;
    this.selectedRoom = undefined;
    this.ScheduleData = []; this.cd.markForCheck();
  }


  getDayColor(dayCode: string): string {
    switch (dayCode) {
      case 'MON': return '#FFD700'; // เหลือง
      case 'TUE': return '#FF69B4'; // ชมพู
      case 'WED': return '#32CD32'; // เขียว
      case 'THU': return '#FFA500'; // ส้ม
      case 'FRI': return '#1E90FF'; // ฟ้า
      default: return '#CCCCCC';    // เทา
    }
  }

  printWindow() {
    if (!this.ScheduleData || this.ScheduleData.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'ไม่มีข้อมูล', detail: 'ไม่พบตารางสอนสำหรับตัวเลือกที่กำหนด', life: 3000 });
      return;
    }

    const html = `
<html>
  <head>
    <title>ตารางสอน</title>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      body { font-family: 'Sarabun', sans-serif; font-size: 11px; margin: 0; padding: 5px; }
      h2 { font-size: 16px; text-align: center; margin: 5px 0; }
      h3 { font-size: 12px; text-align: center; margin: 5px 0; font-weight: normal; }

      table {
        border-collapse: collapse !important;
        width: 100%;
        table-layout: fixed;
        page-break-inside: auto;
      }

      tr { page-break-inside: avoid; page-break-after: auto; }

      th, td {
        border: 1px solid #000 !important;
        padding: 4px;
        word-wrap: break-word;
        text-align: center;
        vertical-align: middle;
        font-size: 11px;
      }

      th { background-color: #eee; font-weight: bold; }

      .highlight { background-color: #60a5fa; color: white; font-weight: bold; }

      .lunch-break {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        background-color: #ffeb99;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
        width: 20px;               /* แคบลง */
        padding: 2px 0;
        border: 1px solid #000;    /* ขอบครบทุกด้าน */
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <h2>โรงเรียนสาธิตมหาวิทยาลัยราชภัฏยะลา</h2>
    <h3>
      ตารางสอน<br>
      ปีการศึกษา: ${this.selectedYear || '-'} | ภาคเรียน: ${this.selectedTerm || '-'}<br>
      ระดับ: ${this.selectedLevel?.name || '-'} | ${this.selectedClass?.name || '-'} | ${this.selectedRoom?.name || '-'}
    </h3>

    <table>
      <thead>
        <tr>
          <th>วัน / เวลา</th>
          ${this.timeslots.slice(0,4).map(s => `<th>คาบ ${s.TIMESLOTID}<br>${s.SLOTFROM}-${s.SLOTTO}</th>`).join('')}
          <th class="lunch-break"></th>
          ${this.timeslots.slice(4).map(s => `<th>คาบ ${s.TIMESLOTID}<br>${s.SLOTFROM}-${s.SLOTTO}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${this.days.map((day, di) => `
          <tr>
            <td>${day.name}</td>
            ${this.timeslots.slice(0,4).map(slot => {
      const sch = this.ScheduleData.find(s => s.DAYID === day.code && s.TIMESLOTID === slot.TIMESLOTID);
      return `<td${sch ? ' class="highlight"' : ''}>${sch ? `${sch.COURSENAME}<br>${sch.STAFFNAME} ${sch.STAFFSERNAME}` : ''}</td>`;
    }).join('')}
            ${di === 0 ? `<td rowspan="${this.days.length}" class="lunch-break">พักกลางวัน</td>` : ''}
            ${this.timeslots.slice(4).map(slot => {
      const sch = this.ScheduleData.find(s => s.DAYID === day.code && s.TIMESLOTID === slot.TIMESLOTID);
      return `<td${sch ? ' class="highlight"' : ''}>${sch ? `${sch.COURSENAME}<br>${sch.STAFFNAME} ${sch.STAFFSERNAME}` : ''}</td>`;
    }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
</html>
  `;

    const printWindow = window.open('', '', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.document.fonts.ready.then(() => {
        printWindow.focus();
        printWindow.print();
      });
    }
  }
}
