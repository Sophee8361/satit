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
import { finalize } from 'rxjs/operators';
import { TableModule } from 'primeng/table';

// service
import { ClasstimeService } from './service/classstime.service';
import { SlotService } from './service/slot.service';

// model
import { ClassStructure, Schedule, TeachingSchedule } from './service/model/classtime.model';
import { LEVELS, CLASSES, DAYS, ROOMS } from './service/time.constant';
import { Staff, Level, Class, Day, Room, Subject, SlotModel } from './service/slot.model';

import { AuthService } from '../pages/auth/auth.service';
import { AuthLocalStorageService } from '../../../../exam/src/app/pages/auth/auth-local-storage.service';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fluid } from 'primeng/fluid';
import { Tooltip } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';


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
  providers: [MessageService,ConfirmationService],
  template: `
    <p-fluid>
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      <div class="card p-4 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div class="font-semibold text-xl text-gray-800">จัดตารางสอน</div>

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
        <p-toolbar styleClass="mb-4 p-4 rounded-lg shadow-sm">
          <ng-template pTemplate="start">
            <div class="flex flex-wrap items-center gap-3">
              <p-dropdown
                id="level-select"
                [options]="levels"
                [(ngModel)]="selectedLevel"
                [showClear]="true"
                placeholder="เลือกระดับ"
                optionLabel="name"
                (onChange)="onLevelChange()"
                class="w-full sm:w-auto"
              ></p-dropdown>
              <p-dropdown
                [options]="filteredClasses"
                [(ngModel)]="selectedClass"
                [showClear]="true"
                optionLabel="name"
                placeholder="เลือกชั้นเรียน"
                (onChange)="onClassChange()"
                [disabled]="!selectedLevel"
                class="min-w-[200px]"
              ></p-dropdown>
              <p-dropdown
                [options]="rooms"
                [(ngModel)]="selectedRoom"
                (onChange)="onRoomChange()"
                [showClear]="true"
                [disabled]="!selectedLevel || !selectedClass"
                optionLabel="name"
                placeholder="เลือกห้อง"
                class="min-w-[200px]"
              ></p-dropdown>
              <p-dropdown
                [options]="days"
                [(ngModel)]="selectedDay"
                [showClear]="true"
                [disabled]="!selectedLevel || !selectedClass || !selectedRoom"
                optionLabel="name"
                placeholder="เลือกวัน"
                class="min-w-[200px]"
              ></p-dropdown>
            </div>
          </ng-template>
        </p-toolbar>
        <div class="flex mt-8">
          <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl mb-4 text-gray-800">ตารางสอนรายสัปดาห์</div>
            <p-table [value]="days.slice(0, 5)" responsiveLayout="scroll"
                     class="rounded-xl shadow-lg border border-gray-200">
              <ng-template pTemplate="header">
                <tr class="bg-blue-600 text-white">
                  <th class="p-4">วัน</th>
                  <th *ngFor="let timeslot of timeslots" class="text-center p-3 bg-gray-100 border border-gray-200">
                    <div class="flex flex-col items-center justify-center">
                      <span class="font-semibold text-sm">คาบ {{ timeslot.TIMESLOTID }}</span>
                      <span class="text-xs text-gray-500">({{ timeslot.SLOTFROM }} - {{ timeslot.SLOTTO }})</span>
                    </div>
                  </th>

                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-day>
                <tr [ngClass]="{ 'highlight-row': day.code === selectedDay?.code }"
                    class="transition-colors duration-200">
                  <td class="font-bold p-4 text-gray-800 border-r border-gray-200 relative">
                    <span
                      class="absolute left-0 top-0 h-full w-1 rounded-tr rounded-br"
                      [ngStyle]="{'background-color': getDayColor(day.code)}">
                    </span>
                    {{ day.name }}
                  </td>

                  <td *ngFor="let timeslot of timeslots" class="p-0 border-r border-gray-200 last:border-r-0">
                    <div
                      class="min-h-[75px] flex flex-col justify-center items-center p-2 cursor-pointer transition-colors duration-200"
                      (click)="openScheduleDialog(day, timeslot.TIMESLOTID)"
                      [ngClass]="{'selected-cell': selectedDay?.code === day.code && selectedTimeslot?.TIMESLOTID === timeslot.TIMESLOTID}"
                      [pTooltip]="getScheduleTooltip(day.code, timeslot.TIMESLOTID)"
                      tooltipPosition="top"
                    >
                      <ng-container *ngIf="getScheduleItem(day.code, timeslot.TIMESLOTID) as item">
                        <span class="font-medium text-center">{{ item.COURSENAME }}</span>
                        <span class="text-sm text-gray-200 text-center">อ. {{ item.STAFFNAME }}</span>
                      </ng-container>
                      <ng-container *ngIf="!getScheduleItem(day.code, timeslot.TIMESLOTID)">
                        <i class="pi pi-plus-circle text-2xl text-gray-400"></i>
                      </ng-container>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div class="flex mt-8">
          <div class="card flex flex-col gap-4 w-full ">
            <div class="font-semibold text-xl">แสดงรายวิชาและผู้สอน {{ selectedDay?.name }}</div>
            <p-table
              [value]="schedules"
              responsiveLayout="scroll"
              [paginator]="true"
              [rows]="10"
              [tableStyle]="{ 'min-width': '50rem' }"
              [rowsPerPageOptions]="[5, 10, 20]"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>วิชา</th>
                  <th>วัน</th>
                  <th>เวลาเรียน</th>
                  <th>ผู้สอน</th>
                  <th></th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>{{ item.COURSENAME }}</td>
                  <td>{{ item.DAYNAME }}</td>
                  <td>{{ item.TIMESLOTID }}</td>
                  <td>{{ item.TEACHERNAME }}</td>
                  <td class="text-center">
                    <p-button class="ml-2" icon="pi pi-trash" styleClass="p-button-danger p-button-sm" [raised]="true"
                              severity="secondary" (click)="confirmDelete(item)" />
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="5" class="text-center py-12">
                    <div class="flex flex-col items-center justify-center gap-4">
                      <i class="pi pi-calendar-times text-6xl text-gray-300"></i>
                      <span class="text-2xl font-semibold text-gray-500">
                        ไม่พบข้อมูลตารางเรียนของ {{ selectedDay?.name }}
                      </span>
                      <span class="text-gray-400 text-sm">
                        กรุณาเลือกระดับ ชั้นเรียน และวัน เพื่อแสดงข้อมูลตารางสอน
                      </span>
                    </div>
                  </td>
                </tr>
              </ng-template>

            </p-table>
          </div>
        </div>
      </div>

      <p-dialog
        header="เพิ่มข้อมูลตารางสอน"
        [(visible)]="showDialog"
        [modal]="true"
        [closable]="false"
        [style]="{ width: '800px', height: '505px' }"
      >
        <div class="bg-gray-50 p-4 rounded shadow-sm border text-base sm:text-lg text-gray-800 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-6">
            <div><strong>ระดับ:</strong> {{ selectedLevel?.name || '-' }}</div>
            <div><strong>ระดับชั้น:</strong> {{ selectedClass?.name || '-' }}</div>
            <div><strong>ห้อง:</strong> {{ selectedRoom?.name || '-' }}</div>
            <div><strong>วัน:</strong> {{ selectedDay?.name || '-' }}</div>
            <div><strong>คาบเรียน:</strong> คาบ {{ selectedTimeslot?.TIMESLOTID || '-' }}</div>
          </div>
        </div>
        <div class="flex flex-row gap-4 p-2">
          <p-dropdown
            [options]="availableSubjects"
            [(ngModel)]="selectedSubject"
            optionLabel="COURSENAME"
            placeholder="เลือกวิชา"
            [showClear]="true"
            [filter]="true"
            class="w-1/2"
            [disabled]="!selectedClass || !selectedRoom"
          ></p-dropdown>

          <p-dropdown
            [options]="timeslots"
            [(ngModel)]="selectedTimeslot"
            optionLabel="name"
            placeholder="เลือกคาบ"
            [disabled]="!selectedSubject"
            class="w-1/2"
          ></p-dropdown>
        </div>

        <ng-template pTemplate="footer">
          <button
            class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            (click)="onDialogCancel()"
          >
            ยกเลิก
          </button>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            (click)="onDialogSave()"
          >
            บันทึก
          </button>
        </ng-template>
      </p-dialog>
    </p-fluid>
  `,
  styles: [
    `
      .p-dropdown {
        min-width: 200px;
      }
      .highlight-row {
        background-color: #e3f2fd !important; /* สีฟ้าอ่อน */
      }

      /* highlight วัน */
      .highlight-row {
        background-color: #e3f2fd !important; /* ฟ้าอ่อน */
      }

      /* highlight cell ที่เลือก */
      .selected-cell {
        background-color: #60a5fa !important; /* ฟ้าเข้ม */
        color: white;
        font-weight: bold;
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class ScheduleTableComponent implements OnInit {
  showDialog = false;
  schedules: Schedule[] = [];

  // เพิ่มตัวแปรสำหรับเก็บข้อมูลตารางสอนแบบ Map
  classScheduleMap = new Map<string, Map<string, TeachingSchedule>>();

  levels = LEVELS;
  classes = CLASSES;
  days = DAYS;
  rooms = ROOMS;

  selectedLevel?: Level;
  selectedClass?: Class;

  // สร้างตัวแปร private เพื่อเก็บค่าจริง
  private _selectedDay?: Day;

  // ใช้ getter/setter เพื่อดักจับการเปลี่ยนแปลงค่า
  get selectedDay(): Day | undefined {
    return this._selectedDay;
  }

  set selectedDay(value: Day | undefined) {
    this._selectedDay = value;
    // เรียกใช้เมธอด loadClasstime() เมื่อมีการเปลี่ยนค่า
    this.loadClasstime();
  }

  selectedRoom?: Room;

  subjects: ClassStructure[] = [];
  // เพิ่มตัวแปรใหม่สำหรับเก็บรายวิชาที่พร้อมใช้งานใน dropdown
  availableSubjects: ClassStructure[] = [];
  selectedSubject?: ClassStructure;

  timeslots: SlotModel[] = [];
  selectedTimeslot?: SlotModel;

  filteredClasses: Class[] = [];

  isAuthenticated: boolean = false;
  auth: any = null;

  constructor(
    private classstimeService: ClasstimeService,
    private slotsService: SlotService,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private authLocalStorageService: AuthLocalStorageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef // เพิ่ม ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(status => {
      this.isAuthenticated = status;
      if (status) {
        this.auth = this.authLocalStorageService.getLocalStorage.auth;
      } else {
        this.auth = null;
      }
    });

    // โหลด timeslots สำหรับหัวตาราง และเพิ่ม console.log เพื่อดีบัก
    this.slotsService.getSlot().subscribe({
      next: (slots) => {
        this.timeslots = slots.map(slot => ({
          ...slot,
          name: `คาบที่ ${slot.TIMESLOTID} (${slot.SLOTFROM} - ${slot.SLOTTO})`
        }));
        console.log('✅ Timeslots ถูกโหลดแล้ว:', this.timeslots);
      },
      error: (err) => {
        console.error('❌ โหลดคาบล้มเหลว:', err);
      },
    });
  }

  onLevelChange() {
    this.selectedClass = undefined;
    if (this.selectedLevel) {
      this.filteredClasses = this.classes.filter(
        (c) => c.levelCode === this.selectedLevel!.code
      );
    } else {
      this.filteredClasses = [];
    }
    this.selectedRoom = undefined;
    this.selectedDay = undefined;
    this.selectedSubject = undefined;
    this.schedules = [];
    // เมื่อเปลี่ยน Level, ให้เคลียร์ข้อมูลในตารางสอนด้านขวาด้วย
    this.classScheduleMap.clear();
    this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
  }

  onClassChange() {
    this.selectedRoom = undefined;
    this.selectedDay = undefined;
    this.selectedSubject = undefined;
    this.schedules = [];
    // เมื่อเปลี่ยน Class, ให้เคลียร์ข้อมูลในตารางสอนด้านขวาด้วย และโหลดตารางสอนใหม่
    this.classScheduleMap.clear();
    this.loadClasstime();
    this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
  }

  onRoomChange() {
    this.loadSubjects();
    this.selectedDay = undefined;
    this.schedules = [];
    // เมื่อเปลี่ยน Room, ให้เคลียร์ข้อมูลในตารางสอนด้านขวาด้วย และโหลดตารางสอนใหม่
    this.classScheduleMap.clear();
 //   this.loadClasstime();
    this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
  }

  /**
   * @description
   * โหลดรายวิชาทั้งหมดสำหรับชั้นเรียนและห้องที่เลือก
   */
  loadSubjects() {
    if (this.selectedClass && this.selectedRoom) {
      this.classstimeService.getclassTime().subscribe((data) => {
        // กรองตาม class, room และ UNITSEAT > 0
        const filtered = data.filter((item) =>
          item.CLASS === this.selectedClass!.code &&
          item.ROOM === this.selectedRoom!.code &&
          Number(item.UNITSEAT) > 0 // ✅ แปลง string -> number
        );

        // เอาเฉพาะวิชาไม่ซ้ำ
        const uniqueSubjectsMap = new Map<string, typeof filtered[0]>();
        filtered.forEach((item) => {
          if (!uniqueSubjectsMap.has(item.COURSEID)) {
            uniqueSubjectsMap.set(item.COURSEID, item);
          }
        });

        this.subjects = Array.from(uniqueSubjectsMap.values());

        // หากต้องการเรียงตามชื่อวิชา
        this.subjects.sort((a, b) => a.COURSENAME.localeCompare(b.COURSENAME, 'th'));

        this.cd.detectChanges();
      });
    } else {
      this.subjects = [];
      this.cd.detectChanges();
    }
  }


  onDialogCancel() {
    this.showDialog = false;
    // เพิ่มโค้ดสำหรับล้างค่า dropdown ใน dialog
    this.selectedTimeslot = undefined;
    this.selectedSubject = undefined;
  }

  onDialogSave() {
    const username = this.auth?.user?.username;
    if (!this.selectedSubject || !this.selectedTimeslot || !this.selectedDay) {
      this.messageService.add({severity:'warn', summary:'คำเตือน', detail:'กรุณากรอกข้อมูลให้ครบถ้วน'});
      return;
    }

    const newSlot: Partial<Schedule> = {
      CLASS: this.selectedSubject.CLASS,
      ROOM: this.selectedSubject.ROOM,
      SEMESTERINDEX: this.selectedSubject.SEMESTERINDEX,
      ACADYEAR: this.selectedSubject.ACADYEAR,
      SEMESTER: this.selectedSubject.SEMESTER,
      COURSEID: this.selectedSubject.COURSEID,
      UNIT: this.selectedSubject.UNIT,
      UNITSEAT: this.selectedSubject.UNITSEAT,
      DAY: this.selectedDay.code,
      TIMESLOTID: this.selectedTimeslot.TIMESLOTID,
      CREATEDBY: username
    };

    this.classstimeService.adclassTime(newSlot).subscribe({
      next: (response) => {
        this.messageService.add({severity:'success', summary:'สำเร็จ', detail: response.message});
        this.showDialog = false;
        this.loadClasstime();
        this.selectedSubject = undefined;
        this.selectedTimeslot = undefined;
        console.log(response)
        this.loadSubjects()
        this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
      },
      error: (err) => {
        const detailMsg = err?.error?.message || err?.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
        this.messageService.add({severity:'error', summary:'ผิดพลาด', detail: detailMsg});
        console.error('❌ เกิดข้อผิดพลาด:', err);
      }
    });
  }

  /**
   * Helper method เพื่อดึงข้อมูลตารางสอนจาก Map
   * @param dayCode รหัสวัน
   * @param timeslotId รหัสคาบเรียน
   * @returns TeachingSchedule หรือ undefined
   */
  getScheduleItem(dayCode: string, timeslotId: string): TeachingSchedule | undefined {
    return this.classScheduleMap.get(dayCode)?.get(timeslotId);
  }

  /**
   * @description
   * เปิด Dialog และตั้งค่าข้อมูลเบื้องต้นจากตารางเปล่า
   * @param day วันที่ถูกเลือก
   * @param period รหัสคาบเรียนที่ถูกเลือก
   */
  openScheduleDialog(day: Day, period: string) {
    console.log('✅ openScheduleDialog ถูกเรียกแล้ว!', { day, period });

    this.selectedDay = day;

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const existingSchedule = this.getScheduleItem(day.code, period);

    // --- ส่วนที่แก้ไข: ไม่ต้องกรองรายวิชาที่ถูกจัดแล้ว ---
    // ให้แสดงรายวิชาทั้งหมดเสมอ
    this.availableSubjects = [...this.subjects];

    // หากมีการเลือกวิชาเดิมอยู่แล้ว (กรณีแก้ไข) ให้เพิ่มวิชานั้นเข้าไปในตัวเลือกด้วย
    if (existingSchedule) {
      const existingSubject = this.subjects.find(s => s.COURSEID === existingSchedule.COURSEID);
      // ตรวจสอบและเพิ่มวิชาที่มีอยู่เดิม (เผื่อในกรณีที่วิชานั้นไม่ซ้ำกับวิชาที่ถูกกรอง)
      if (existingSubject && !this.availableSubjects.find(s => s.COURSEID === existingSubject.COURSEID)) {
        this.availableSubjects.push(existingSubject);
      }
      this.selectedSubject = existingSubject;
      this.selectedTimeslot = this.timeslots.find(t => t.TIMESLOTID === existingSchedule.TIMESLOTID);
    } else {
      this.selectedSubject = undefined;
      this.selectedTimeslot = this.timeslots.find(t => t.TIMESLOTID === period);
    }
    // --- สิ้นสุดส่วนที่แก้ไข ---

    this.showDialog = true;
    this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
  }

  /**
   * @description
   * โหลดข้อมูลตารางสอนและกรองตาม ชั้นเรียน ห้อง และวันที่เลือก
   */
  loadClasstime(): void {
    if (!this.selectedClass || !this.selectedRoom) {
      this.schedules = [];
      this.classScheduleMap.clear();
      this.cd.detectChanges();
      return;
    }

    console.log('Class ที่เลือก:', this.selectedClass);
    console.log('Room ที่เลือก:', this.selectedRoom);
    console.log('Day ที่เลือก:', this.selectedDay);

    const headers = {
      'Authorization': 'Basic ' + btoa('admin:1234'),
      'Content-Type': 'application/json'
    };

    this.http.get<TeachingSchedule[]>('https://api-eduservice.yru.ac.th/satit/time/classtimetable.php', { headers })
      .pipe(
        finalize(() => this.cd.detectChanges()) // ✅ ให้ detectChanges แค่ครั้งเดียวหลังจากจบ
      )
      .subscribe({
        next: (res) => {
          console.log('ข้อมูลดิบที่ได้รับจาก API:', res);

          // ✅ กรองข้อมูลตาม Class และ Room
          const filteredRes = res.filter(item =>
            item.CLASS === this.selectedClass?.code &&
            item.ROOM === this.selectedRoom?.code
          );
          console.log('ข้อมูลที่กรองแล้ว:', filteredRes);

          // ✅ ใช้กับตารางด้านล่าง
          // ✅ ใช้กับตารางด้านล่าง
          this.schedules = filteredRes
            .filter(item => item.DAYID === this.selectedDay?.code)
            .reduce((acc: any[], item) => {
              const key = `${item.CLASSID}_${item.DAYID}_${item.TIMESLOTID}`;
              const existing = acc.find(s => s._key === key);

              if (existing) {
                existing.TEACHERNAME += `, ${item.PREFIXID}${item.STAFFNAME} ${item.STAFFSERNAME}`;
              } else {
                acc.push({
                  _key: key,
                  CLASSID: item.CLASSID,
                  CLASS: item.CLASS,
                  ROOM: item.ROOM,
                  COURSEID: item.COURSEID,
                  COURSENAME: item.COURSENAME,
                  DAY: item.DAYID,
                  TIMESLOTID: `${item.TIMESLOTID} (${item.SLOTFROM} - ${item.SLOTTO})`,
                  TEACHERNAME: `${item.PREFIXID}${item.STAFFNAME} ${item.STAFFSERNAME}`,
                  DAYNAME: item.DAYNAME,
                  UNITSEAT: '',
                  UNIT: '',
                  CREATEDBY: '',
                  ACADYEAR: '',
                  SEMESTER: '',
                  SEMESTERINDEX: '',
                });
              }
              return acc;
            }, []);

// ✅ จัดกลุ่มข้อมูลสำหรับตารางสอนด้านขวา
          this.classScheduleMap.clear();
          const mergedMap = new Map<string, TeachingSchedule>();
          filteredRes.forEach(item => {
            if (!this.classScheduleMap.has(item.DAYID)) {
              this.classScheduleMap.set(item.DAYID, new Map<string, TeachingSchedule>());
            }

            const map = this.classScheduleMap.get(item.DAYID)!;
            const existing = map.get(item.TIMESLOTID);

            if (existing) {
              // รวมชื่ออาจารย์ถ้ามี key ซ้ำ
              existing.TEACHERNAME += `, ${item.PREFIXID}${item.STAFFNAME} ${item.STAFFSERNAME}`;
            } else {
              // เก็บใหม่
              map.set(item.TIMESLOTID, {
                ...item,
                TEACHERNAME: `${item.PREFIXID}${item.STAFFNAME} ${item.STAFFSERNAME}`,
              });
            }
          });

        },
        error: (err) => {
          console.error('❌ ไม่สามารถโหลดข้อมูลตารางสอน', err);
          this.schedules = [];
          this.classScheduleMap.clear();
        }
      });
  }


  confirmDelete(item: any) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบข้อมูลการจัดผู้สอนของวิชา '${item.COURSENAME}' รหัสวิชา ${item.CLASSID} หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItem(item.CLASSID);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'ยกเลิก', detail: 'ยกเลิกการลบข้อมูล', life: 3000 });
      }
    });
  }

  deleteItem(id: string) {
    this.classstimeService.deleteClasstime(id).subscribe({
      next: (response) => {
        console.log('API ตอบกลับสำเร็จ (ลบข้อมูล):', response);
        //   this.classStructure = this.classStructure.filter(s => s.ID !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'ลบช่วงเวลาเรียบร้อยแล้ว',
          life: 3000
        });
        this.loadClasstime();
        this.cd.detectChanges(); // แก้ไข: สั่งให้ Angular ตรวจจับการเปลี่ยนแปลง
        //  this.loadClassStructure(this.selectedGrade?.code, this.selectedRoom?.code);
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

  getScheduleTooltip(dayCode: string, timeslotId: string): string {
    const item = this.getScheduleItem(dayCode, timeslotId);
    if (item) {
      // ใช้ข้อมูลที่อยู่ใน TeachingSchedule
      return `วิชา: ${item.COURSENAME}
              ผู้สอน: ${item.TEACHERNAME}
              เวลา: ${item.TIMESLOTID}`;
    }
    return 'คลิกเพื่อเพิ่มวิชา';
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

  protected readonly environment = environment;
}
