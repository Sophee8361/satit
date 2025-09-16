// check-schedule.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { environment } from '../../../../environments/environment';
import { SlotModel } from './service/slot.model';
import { OfficerService } from './service/officer.service';
import { OfficerModel } from './service/model/officer.model';
import { DAYS } from './service/time.constant';
import { ButtonDirective } from 'primeng/button';
import { Calendar } from 'primeng/calendar';


@Component({
  selector: 'app-check-schedule',
  standalone: true,
  imports: [FormsModule, DropdownModule, Toast, CommonModule, Dialog, ButtonDirective, Calendar, DatePickerModule],
  providers: [MessageService],
  template: `
    <p-toast position="top-right"></p-toast>

    <div class="card p-4 shadow-lg rounded-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div class="font-semibold text-xl text-gray-800">จัดตารางสอนแทน</div>

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

      <!-- ปุ่มเลือกวัน -->
      <div class="flex items-center mb-4 gap-x-4">
        <button
          *ngFor="let d of days.slice(0,5)"
          class="px-4 py-2 rounded-lg border transition"
          [ngClass]="{
            'bg-blue-500 text-white shadow-md': selectedDay?.code === d.code,
            'bg-gray-100 hover:bg-gray-200': selectedDay?.code !== d.code
          }"
          (click)="onDayChange(d)"
        >
          📅 {{ d.name }}
        </button>
      </div>

      <div class="flex items-center gap-3 mb-3">
        <!-- Dropdown เลือกวัน -->
        <p-dropdown
          [options]="days"
          [(ngModel)]="selectedDay"
          optionLabel="name"
          placeholder="เลือกวัน"
          [showClear]="true"
          (onChange)="onDayChange($event.value)"
          styleClass="w-48">
        </p-dropdown>

        <!-- Datepicker แสดงวันที่ปัจจุบัน -->
        <p-datepicker
          [(ngModel)]="selectedDate"
          [showIcon]="true"
          iconDisplay="input"
          [maxDate]="today"
          dateFormat="dd/mm/yy"
          placeholder="เลือกวันที่">
        </p-datepicker>


        <!-- ✅ ปุ่มเปิด Dialog A4 -->
        <button pButton type="button" label="รายงาน" icon="pi pi-print" (click)="loadReport()"></button>
      </div>



      <div class="table-wrapper shadow-lg rounded-xl" *ngIf="timeslots.length && scheduleData.length">
        <table class="schedule-table">
          <thead>
          <tr class="header-row">
            <th rowspan="2" class="sticky-col">
              👨‍🏫 ผู้สอน / คาบ
            </th>
            <th [attr.colspan]="timeslots.slice(0,4).length">
              🌅 คาบเช้า
            </th>
            <th rowspan="2" class="lunch-break">🍴 พัก</th>
            <th [attr.colspan]="timeslots.slice(4).length">
              🌇 คาบบ่าย
            </th>
          </tr>

          <tr class="sub-header-row">
            <th *ngFor="let slot of timeslots.slice(0,4)">
              📅 คาบ {{ slot.TIMESLOTID }}<br>
              <small>{{ slot.SLOTFROM }} - {{ slot.SLOTTO }}</small>
            </th>
            <th *ngFor="let slot of timeslots.slice(4)">
              📅 คาบ {{ slot.TIMESLOTID }}<br>
              <small>{{ slot.SLOTFROM }} - {{ slot.SLOTTO }}</small>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let row of scheduleData; let ri = index">
            <td class="teacher-name sticky-col">{{ row.officer.FULLNAME }}</td>
            <td *ngFor="let slot of timeslots.slice(0,4)"
                [ngClass]="[getSlotClass(row, slot.TIMESLOTID), row.slots[slot.TIMESLOTID] ? 'clickable-slot' : '']"
                (click)="row.slots[slot.TIMESLOTID] && openDialog(row, slot)">
              {{ row.slots[slot.TIMESLOTID] }}
            </td>

            <!-- พักกลางวัน -->
            <td *ngIf="ri === 0" class="lunch-break" [attr.rowspan]="scheduleData.length">
              <span>🍴 พัก ☕️</span>
            </td>

            <td *ngFor="let slot of timeslots.slice(4)"
                [ngClass]="[getSlotClass(row, slot.TIMESLOTID), row.slots[slot.TIMESLOTID] ? 'clickable-slot' : '']"
                (click)="row.slots[slot.TIMESLOTID] && openDialog(row, slot)">
              {{ row.slots[slot.TIMESLOTID] }}
            </td>


          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Legend Section -->
    <div class="mt-4 flex items-center space-x-6 text-sm" *ngIf="timeslots.length && scheduleData.length">
      <div class="flex items-center space-x-2">
        <span class="w-4 h-4 inline-block slot-free border"></span>
        <span>ว่าง 🌿</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-4 h-4 inline-block slot-occupied border"></span>
        <span>มีสอน 🚨</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="w-4 h-4 inline-block slot-special border"></span>
        <span>โครงการ/กิจกรรมพิเศษ 📘</span>
      </div>
    </div>

    <p-dialog
      header="📘 รายละเอียดรายวิชา"
      [(visible)]="displayDialog"
      [modal]="true"
      [style]="{width: '650px', height: '670px'}"
      [dismissableMask]="true"
      [draggable]="false"
    >
      <ng-container *ngIf="selectedCourse">
        <div class="p-3 space-y-4">
          <!-- วัน + คาบ อยู่แถวเดียว -->
          <div class="flex gap-4">
            <!-- วัน -->
            <div class="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 shadow-sm flex-1">
              <i class="pi pi-calendar text-yellow-500 text-lg"></i>
              <div>
                <div class="text-sm text-yellow-600">วัน</div>
                <div class="font-medium text-yellow-800">
                  {{ selectedCourse.day }}
                </div>
              </div>
            </div>

            <!-- คาบ -->
            <div class="flex items-center gap-2 p-3 rounded-lg bg-green-50 shadow-sm flex-1">
              <i class="pi pi-clock text-green-500 text-lg"></i>
              <div>
                <div class="text-sm text-green-600">คาบ</div>
                <div class="font-medium text-green-800">
                  {{ selectedCourse.slot.TIMESLOTID }}
                  <span class="text-xs text-green-700">
                    ({{ selectedCourse.slot.SLOTFROM }} - {{ selectedCourse.slot.SLOTTO }})
                  </span>
                </div>
              </div>
            </div>
            <!-- ผู้สอน -->
            <div class="flex flex-col gap-1 p-3 rounded-lg bg-blue-50 shadow-sm">

              <div class="text-sm text-blue-600">CLASSID: {{ selectedCourse.classid }}</div>
            </div>

          </div>

          <!-- รายวิชา -->
          <div class="flex items-center gap-2 p-3 rounded-lg bg-purple-50 shadow-sm">
            <i class="pi pi-book text-purple-500 text-lg"></i>
            <div>
              <div class="text-sm text-purple-600">รายวิชา</div>
              <div class="font-medium text-purple-800">
                {{ selectedCourse.course }}
              </div>
            </div>
          </div>

          <!-- ผู้สอน -->
          <div class="flex items-center gap-2 p-3 rounded-lg bg-blue-50 shadow-sm">
            <i class="pi pi-user text-blue-500 text-lg"></i>
            <div>
              <div class="text-sm text-blue-600">ผู้สอนเดิม</div>
              <div class="font-semibold text-blue-800">
                {{ selectedCourse.officer.FULLNAME }}
              </div>
            </div>
          </div>

          <!-- เลือกผู้สอนแทน -->
          <div class="flex flex-col gap-2 p-3 rounded-lg bg-orange-50 shadow-sm">
            <label class="font-semibold text-orange-700 flex items-center gap-2">
              <i class="pi pi-users text-orange-500 text-lg"></i>
              เลือกผู้สอนแทน
            </label>
            <p-dropdown
              [options]="officers"
              optionLabel="FULLNAME"
              optionValue="STAFFID"
              [filter]="true"
              [(ngModel)]="substituteTeacher"
              placeholder="เลือกผู้สอนแทน"
              styleClass="w-full"
            ></p-dropdown>
          </div>

        </div>
      </ng-container>

      <!-- Footer -->
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <button
            pButton
            type="button"
            label="บันทึก"
            icon="pi pi-check"
            (click)="saveSubstitute()"
            [disabled]="!substituteTeacher"
            class="p-button-success"
          ></button>
          <button
            pButton
            type="button"
            label="ยกเลิก"
            icon="pi pi-times"
            (click)="displayDialog=false"
            class="p-button-secondary"
          ></button>
        </div>
      </ng-template>
    </p-dialog>

    <p-dialog
      header="แบบบันทึกการสอนแทน"
      [(visible)]="displayReportDialog"
      [modal]="true"
      [style]="{width: '90vw', maxWidth: '1000px'}"
      [baseZIndex]="10000"
    >
      <!-- หัวรายงาน -->
      <div class="report-header">
        <div class="school-name">โรงเรียนสาธิตมหาวิทยาลัยราชภัฏยะลา</div>
        <div class="report-title">แบบบันทึกการสอนแทน</div>
        <div class="report-date">{{ thaiDate }}</div>
      </div>



      <!-- ตารางรายงาน -->
      <div class="table-container">
        <table class="report-table">
          <thead>
          <tr>
            <th style="width:40px;">ลำดับที่</th>
            <th>ผู้สอนต้องการจัดสอนแทน</th>
            <th style="width:40px;">คาบที่</th>
            <th>รายวิชา</th>
            <th>ชั้น</th>
            <th>ครูผู้สอนแทน</th>
            <th>ลงชื่อครูผู้สอน</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let row of reportData; let i = index">
            <td style="width:40px;">{{ i + 1 }}</td>
            <td>{{ row.MASTER_PREFIX }}{{ row.MASTER_NAME }} {{ row.MASTER_SURNAME }}</td>
            <td style="width:40px;">{{ row.TIMESLOT_NAME }}</td>
            <td>{{ row.COURSENAME }}</td>
            <td>{{ row.CLASS_ROOM }}</td>
            <td>{{ row.REPLACE_PREFIX }}{{ row.REPLACE_NAME }} {{ row.REPLACE_SURNAME }}</td>
            <td></td>
          </tr>
          </tbody>
        </table>

      </div>

      <!-- Footer Dialog -->
      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          label="พิมพ์รายงาน"
          icon="pi pi-print"
          (click)="printReport()"
          [disabled]="!reportData || reportData.length === 0"
        ></button>
      </ng-template>

    </p-dialog>

  `,
  styles: [
    `
      button {
        font-weight: 500;
      }

      .title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .schedule-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        min-width: 700px;
      }

      .schedule-table th,
      .schedule-table td {
        border: 1px solid #cbd5e1;
        padding: 0.5rem;
      }

      .header-row {
        background-color: #e2e8f0;
        font-weight: bold;
      }

      .sub-header-row {
        background-color: #f1f5f9;
        font-weight: 500;
      }

      .teacher-name,
      .sticky-col {
        font-weight: 600;
        text-align: left;
        padding-left: 0.5rem;
        background-color: #f8fafc;
        position: sticky;
        left: 0;
        z-index: 2;
        box-shadow: 2px 0 5px -2px rgba(0,0,0,0.3);
      }

      .slot-free {
        background-color: #dcfce7; /* เขียวอ่อน 🌿 */
      }

      .slot-occupied {
        background-color: #fecaca; /* แดงอ่อน 🚨 */
        font-weight: bold;
      }

      .slot-special {
        background-color: #bfdbfe; /* ฟ้าอ่อน 📘 */
        font-style: italic;
      }

      .clickable-slot {
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .clickable-slot:hover {
        background-color: #e0f2fe; /* ฟ้าอ่อน */
      }



      .lunch-break {
        background-color: #ffeb99; /* สีเหลือง */
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
        font-size: 0.9rem;
      }

      .lunch-break span {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem; /* เว้นระยะระหว่าง Icon กับข้อความ */
      }

      @media (max-width: 768px) {
        .schedule-table th,
        .schedule-table td {
          padding: 0.25rem;
          font-size: 0.85rem;
        }

        .title {
          font-size: 1.25rem;
        }
      }

      @media (max-width: 480px) {
        .schedule-table {
          min-width: 500px;
        }
        .schedule-table th,
        .schedule-table td {
          padding: 0.2rem;
          font-size: 0.75rem;
        }
      }

      .report-header {
        text-align: center;
        margin-bottom: 20px;
        line-height: 1.4;
      }

      .report-header .school-name {
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .report-header .report-title {
        font-size: 14pt;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .report-header .report-date {
        font-size: 14pt;
        font-weight: 500;
      }


      .table-container {
        overflow-x: auto;
      }

      .report-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .report-table th, .report-table td {
        border: 1px solid #333;
        padding: 6px 8px;
        text-align: center;
      }

      .report-table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
    `
  ]
})
export class CheckScheduleComponent implements OnInit {
  days = DAYS;
  selectedDay: any;

  selectedDate: Date = new Date();   // ✅ Default เป็นวันที่ปัจจุบัน
  today: Date = new Date();

  officers: OfficerModel[] = [];
  timeslots: SlotModel[] = [];
  allSchedules: any[] = [];
  scheduleData: any[] = [];

  //แสดงdialog
  selectedCourse: any = null;
  displayDialog: boolean = false;
  substituteTeacher: string | null = null;

  protected readonly environment = environment;
  displayReportDialog: boolean = false;
  reportData: any[] = [];
  thaiDate: string = '';

  constructor(
    private officerService: OfficerService,
    private http: HttpClient,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.today = new Date();
    this.selectedDate = new Date(); // เลือกวันที่ปัจจุบัน

    // map JS getDay() -> DAYS index (0=จันทร์, ..., 4=ศุกร์)
    const jsDayIndex = this.today.getDay();
    const mapDay: { [key: number]: number } = {
      1: 0, // จันทร์
      2: 1, // อังคาร
      3: 2, // พุธ
      4: 3, // พฤหัส
      5: 4  // ศุกร์
    };

    if (mapDay[jsDayIndex] !== undefined) {
      this.selectedDay = this.days.find(d => d.id === mapDay[jsDayIndex]) || null;
    } else {
      this.selectedDay = this.days[0]; // วันจันทร์ ถ้าเสาร์-อาทิตย์
    }

    // โหลดข้อมูลก่อน เพื่อ onDayChange ใช้งานได้ทันที
    this.loadSlot();
    this.getOfficers();
    this.loadSchedules();

    // ให้ onDayChange รันหลังจากข้อมูล loaded
    setTimeout(() => {
      if (this.selectedDay) {
        this.onDayChange(this.selectedDay);
      }
    }, 500);
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
      Authorization: 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    };
    this.http.get<SlotModel[]>(apiUrl, { headers }).subscribe({
      next: res => (this.timeslots = res),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'โหลดคาบเรียนไม่สำเร็จ',
          life: 5000
        })
    });
  }

  loadSchedules() {
    const apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/schedule.php';
    const headers = {
      Authorization: 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    };
    // ✅ ดึงค่า semesterIndex จาก environment
    const params = new HttpParams().set('semesterindex', environment.semesterIndex);

    // ✅ ส่ง ACADYEAR, SEMESTER, SEMESTERINDEX จาก environment
    // const params = new HttpParams()
    //   .set('acadyear', environment.acadYear)
    //   .set('semester', environment.semester)
    //   .set('semesterindex', environment.semesterIndex);
    this.http.get<any[]>(apiUrl, { headers, params }).subscribe({
      next: res => (this.allSchedules = res),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'โหลดตารางสอนไม่สำเร็จ',
          life: 5000
        })
    });
  }

  onDayChange(day?: any) {
    this.selectedDay = day;
    if (!this.selectedDay || !this.officers.length || !this.timeslots.length) {
      this.scheduleData = [];
      return;
    }

    this.scheduleData = this.officers.map(officer => {
      const row: any = { officer, slots: {} };
      this.timeslots.forEach(slot => {
        const sch = this.allSchedules.find(
          f =>
            f.STAFFID === officer.STAFFID &&
            f.DAYNAME === this.selectedDay.name &&
            f.TIMESLOTID == slot.TIMESLOTID
        );
        row.slots[slot.TIMESLOTID] = sch ? `${sch.COURSENAME} (${sch.CLASS})` : '';
      });
      return row;
    });

    this.cd.detectChanges();
  }




  getSlotClass(row: any, timeslotId: string) {
    const slotValue = row.slots[timeslotId]?.trim();

    if (!slotValue) return 'slot-free';
    if (slotValue.includes('โครงการ') || slotValue.includes('กิจกรรม')) {
      return 'slot-special';
    }
    return 'slot-occupied';
  }

  openDialog(row: any, slot: SlotModel) {
    // หา schedule ของ slot ปัจจุบัน
    const sch = this.allSchedules.find(
      f =>
        f.STAFFID === row.officer.STAFFID &&
        f.DAYNAME === this.selectedDay?.name &&
        f.TIMESLOTID == slot.TIMESLOTID
    );

    if (!sch) return; // ไม่มีข้อมูลก็ไม่ต้องเปิด

    this.selectedCourse = {
      officer: row.officer,
      slot,
      course: sch.COURSENAME,
      day: sch.DAYNAME,
      classid: sch.CLASSID,
      staffid: sch.STAFFID,
      className: sch.CLASS
    };
    this.displayDialog = true;
  }

// กดเซฟ
  saveSubstitute() {
    if (!this.substituteTeacher || !this.selectedCourse) return;

    const payload = {
      STAFFIDMASTER: this.selectedCourse.officer.STAFFID,
      STAFFIDREPLACE: this.substituteTeacher,
      timeslot: this.selectedCourse.slot.TIMESLOTID,
      course: this.selectedCourse.course,
      day: this.selectedDay.name,
      CLASSID: this.selectedCourse.classid
    };
    console.log('ส่งข้อมูลไปบันทึก:', payload);
    this.officerService.addOfficerreplce(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'บันทึกข้อมูลเจ้าหน้าที่สำเร็จ',
          life: 3000
        });
      },
      error: (err) => {
        console.error('Error saving officer:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: err?.error?.message || 'เกิดข้อผิดพลาดในการบันทึก',
          life: 5000
        });
      }
    });

    this.displayDialog = false;
    this.substituteTeacher = null;
  }

  getThaiDate(date: Date): string {
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(date);
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    return `วันที่ ${day} เดือน${month} พ.ศ. ${year}`;
  }


  loadReport() {
    if (!this.selectedDate) return;
    this.thaiDate = this.getThaiDate(this.selectedDate);
    const apiUrl = 'https://api-eduservice.yru.ac.th/satit/officer/officerreplace.php';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    });

    // แปลงวันที่เป็น DD/MM/YYYY
    const day = this.selectedDate.getDate().toString().padStart(2, '0');
    const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = this.selectedDate.getFullYear();
    const dateStr = `${day}/${month}/${year}`; // ตัวอย่าง: 09/09/2025
    console.log('ส่งวันที่ไป API:', dateStr);
    const params = new HttpParams().set('date', dateStr);
    this.http.get<any[]>(apiUrl, { headers, params }).subscribe({
      next: res => {
        this.reportData = res;
        this.displayReportDialog = true; // เปิด Dialog หลังได้ข้อมูล
        console.log('ข้อมูลจาก API:', res);
      },
      error: err => {
        console.error('โหลดรายงานไม่สำเร็จ', err);
      }
    });
  }




  printReport() {
    const printContents = document.querySelector('.table-container')!.outerHTML;

    // แปลงวันที่เป็นภาษาไทย
    // const thaiDate = new Intl.DateTimeFormat('th-TH', {
    //   day: 'numeric',
    //   month: 'long',
    //   year: 'numeric'
    // }).format(this.selectedDate);
    const thaiDate = this.getThaiDate(this.selectedDate);
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      position: 'fixed',
      right: '0',
      bottom: '0',
      width: '0',
      height: '0',
      border: '0'
    });
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
    <html>
      <head>

        <style>
          body { font-family: 'TH Sarabun New', sans-serif; margin: 20px; font-size: 14pt; color: #1a1a1a; }
          .report-header { text-align: center; margin-bottom: 15px; }
          .school-name { font-size: 20pt; font-weight: bold; }
          .report-title { font-size: 18pt; margin: 5px 0; font-weight: bold; }
          .report-date { font-size: 16pt;  margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; font-size: 14pt; table-layout: fixed; }
          th, td { border: 1px solid #333; padding: 6px 8px; text-align: center; word-wrap: break-word; }
          th { background-color: #f2f2f2; font-weight: bold; }
          th:nth-child(1), td:nth-child(1) { width: 30px; }
          th:nth-child(2), td:nth-child(2) { width: 200px; text-align: center; padding-left: 5px; }
          th:nth-child(4), td:nth-child(4) { width: 180px; text-align: center; padding-left: 5px; }
          @media print {
            @page { size: A4 landscape; margin: 15mm; }
            body { margin: 0; }
            table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="school-name">โรงเรียนสาธิตมหาวิทยาลัยราชภัฏยะลา</div>
          <div class="report-title">แบบบันทึกการสอนแทน</div>
          <div class="report-date">${thaiDate} </div>
        </div>
        ${printContents}
      </body>
    </html>
  `);
    doc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => document.body.removeChild(iframe), 1000);
  }



}
