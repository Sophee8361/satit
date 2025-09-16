import { Component, OnInit } from '@angular/core';
import { SlotService } from '../service/slot.service';
import { SlotModel } from '../service/slot.model';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-slot',
  imports: [
    TableModule,
    HttpClientModule,
    InputTextModule,
    Tag,
    IconField,
    InputIcon,
    ButtonModule,
    DialogModule,
    FormsModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule
  ],
  standalone: true,
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        #dt1
        [value]="slots"
        [globalFilterFields]="['NO', 'TIMESLOTID', 'SLOTFROM', 'SLOTTO']"
        selectionMode="single"
        [(selection)]="selectedSlot"
        dataKey="TIMESLOTID"
        [tableStyle]="{ 'min-width': '50rem' }"
        [rows]="10"
        [paginator]="true"
        stateStorage="session"
        stateKey="statedemo-session"
      >
        <ng-template #caption>
          <div class="flex">
            <p-button
              label="เพิ่มช่วงเวลา"
              [outlined]="true"
              styleClass="p-button-success"
              icon="pi pi-plus"
              (click)="showAddSlotDialog()"
            />
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
        <ng-template #header>
          <tr>
            <th pSortableColumn="TIMESLOTID">รหัสช่วงเวลา <p-sortIcon field="TIMESLOTID" /></th>
            <th pSortableColumn="SLOTFORM">เริ่มต้น <p-sortIcon field="SLOTFORM" /></th>
            <th pSortableColumn="TIMWSLOTTO">สิ้นสุด <p-sortIcon field="TIMWSLOTTO" /></th>
            <th>การดำเนินการ</th>
          </tr>
        </ng-template>

        <ng-template #body let-slot>
          <tr [pSelectableRow]="slot">
            <td>{{ slot.TIMESLOTID }}</td>
            <td>{{ slot.SLOTFROM }}</td>
            <td>{{ slot.SLOTTO }}</td>
            <td>
              <p-button
                icon="pi pi-pencil"
                styleClass="p-button-warning p-button-sm mr-2"
                (click)="showEditSlotDialog(slot)"
              ></p-button>
              <p-button
                icon="pi pi-trash"
                styleClass="p-button-danger p-button-sm"
                (click)="confirmDelete(slot)"
              ></p-button>
            </td>
          </tr>
        </ng-template>

        <ng-template emptymessage>
          <tr>
            <td colspan="5">ไม่พบข้อมูลช่วงเวลา</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog
      header="แก้ไขช่วงเวลา"
      [(visible)]="displayEditSlotDialog"
      [modal]="true"
      [style]="{ width: '50vw', height: '320px' }"
      [draggable]="false"
      [resizable]="false"
    >
      <div class="card">
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="flex-auto">
            <label for="editNo" class="font-bold block mb-2"> ลำดับ </label>
            <input pInputText id="editNo" type="text" [(ngModel)]="editSlot.TIMESLOTID" disabled />
          </div>
          <div class="flex-auto">
            <label for="editFrom" class="font-bold block mb-2"> เริ่มต้น (เวลา) </label>
            <p-calendar
              inputId="editFrom"
              [(ngModel)]="editSlotFromTime"
              [timeOnly]="true"
              hourFormat="24"
              [showTime]="true"
              placeholder="HH:MM"
            ></p-calendar>
          </div>
          <div class="flex-auto">
            <label for="editTo" class="font-bold block mb-2"> สิ้นสุด (เวลา) </label>
            <p-calendar
              inputId="editTo"
              [(ngModel)]="editSlotToTime"
              [timeOnly]="true"
              hourFormat="24"
              [showTime]="true"
              placeholder="HH:MM"
            ></p-calendar>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="ยกเลิก" icon="pi pi-times" styleClass="p-button-text" (click)="hideEditSlotDialog()"></p-button>
        <p-button label="บันทึก" icon="pi pi-check" styleClass="p-button-success" (click)="updateSlot()"></p-button>
      </ng-template>
    </p-dialog>


    <p-dialog
      header="เพิ่มช่วงเวลาใหม่"
      [(visible)]="displayAddSlotDialog"
      [modal]="true"
      [style]="{ width: '50vw', height: '320px' }"  [draggable]="false"
      [resizable]="false"
    >
      <div class="card">
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="flex-auto">
            <label for="no" class="font-bold block mb-2"> ลำดับ </label>
            <input pInputText id="no" type="text" [(ngModel)]="newSlot.TIMESLOTID" disabled />
          </div>
          <div class="flex-auto">
            <label for="slotFromTime" class="font-bold block mb-2"> เริ่มต้น (เวลา) </label>
            <p-calendar
              inputId="slotFromTime"
              [(ngModel)]="newSlotFromTime"
              [timeOnly]="true"
              hourFormat="24"
              [showTime]="true"
              [showSeconds]="false"
              placeholder="HH:MM"
            ></p-calendar>
          </div>
          <div class="flex-auto">
            <label for="slotToTime" class="font-bold block mb-2"> สิ้นสุด (เวลา) </label>
            <p-calendar
              inputId="slotToTime"
              [(ngModel)]="newSlotToTime"
              [timeOnly]="true"
              hourFormat="24"
              [showTime]="true"
              [showSeconds]="false"
              placeholder="HH:MM"
            ></p-calendar>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          label="ยกเลิก"
          icon="pi pi-times"
          styleClass="p-button-text"
          (click)="hideAddSlotDialog()"
        ></p-button>
        <p-button
          label="บันทึก"
          icon="pi pi-check"
          styleClass="p-button-success"
          (onClick)="saveNewSlot()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
  providers: [MessageService, ConfirmationService]
})
export class SlotComponent implements OnInit {
  slots: SlotModel[] = [];
  selectedSlot: SlotModel | null = null;

  displayAddSlotDialog: boolean = false;
  newSlot: SlotModel = { NO: '', TIMESLOTID: '', SLOTFROM: '', SLOTTO: '' };

  newSlotFromTime: Date | undefined;
  newSlotToTime: Date | undefined;

  displayEditSlotDialog: boolean = false;
  editSlot: SlotModel = { NO: '', TIMESLOTID: '', SLOTFROM: '', SLOTTO: '' };
  editSlotFromTime: Date | undefined;
  editSlotToTime: Date | undefined;

  constructor(
    private timeService: SlotService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit(): void {
    this.timeService.getSlot().subscribe((data) => {
      this.slots = data;
    //  console.log(data);
    });
  }

  onGlobalFilterInput(event: Event, dt: any): void {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  showAddSlotDialog(): void {
    this.displayAddSlotDialog = true;
    this.newSlot = { NO: '', TIMESLOTID: '', SLOTFROM: '', SLOTTO: '' };
    this.newSlotFromTime = undefined;
    this.newSlotToTime = undefined;

    // --- ย้าย Logic การสร้างค่า NO และ TIMESLOTID มาที่นี่ ---
    // สร้าง TIMESLOTID และ NO แบบง่ายๆ หากยังไม่มี (ควรจัดการจาก Backend เพื่อความถูกต้อง)
    // สำหรับการทดสอบเบื้องต้น
    const maxTimeSlotId = this.slots.length > 0 ? Math.max(...this.slots.map(s => +s.TIMESLOTID)) : 0;
    this.newSlot.TIMESLOTID = (maxTimeSlotId + 1).toString();

    const maxNo = this.slots.length > 0 ? Math.max(...this.slots.map(s => +s.NO)) : 0;
    this.newSlot.NO = (maxNo + 1).toString();
    // --------------------------------------------------------
  }

  hideAddSlotDialog(): void {
    this.displayAddSlotDialog = false;
  }

  saveNewSlot(): void {
    // แปลง Date object จาก p-calendar เป็น string ตามรูปแบบที่ API ต้องการ
    if (this.newSlotFromTime instanceof Date) {
      this.newSlot.SLOTFROM = `${this.newSlotFromTime.getHours().toString().padStart(2, '0')}.${this.newSlotFromTime.getMinutes().toString().padStart(2, '0')}`;
    } else {
      this.newSlot.SLOTFROM = '';
    }

    if (this.newSlotToTime instanceof Date) {
      this.newSlot.SLOTTO = `${this.newSlotToTime.getHours().toString().padStart(2, '0')}.${this.newSlotToTime.getMinutes().toString().padStart(2, '0')}`;
    } else {
      this.newSlot.SLOTTO = '';
    }

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!this.newSlotFromTime || !this.newSlotToTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'กรุณาเลือกเวลาเริ่มต้นและสิ้นสุด',
        life: 3000
      });
      return;
    }

    if (this.newSlotFromTime >= this.newSlotToTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด',
        life: 3000
      });
      return;
    }

    // --- ลบ Logic การสร้างค่า NO และ TIMESLOTID ออกจากที่นี่ เพราะย้ายไป showAddSlotDialog() แล้ว ---
    // if (!this.newSlot.TIMESLOTID) { ... }
    // if (!this.newSlot.NO) { ... }
    // -------------------------------------------------------------------------------------------------

    //console.log('กำลังส่งข้อมูลเพื่อบันทึกช่วงเวลาใหม่:', this.newSlot);

    this.timeService.addSlot(this.newSlot).subscribe({
      next: (response) => {
       // console.log('API ตอบกลับสำเร็จ:', response);
        if (response && response.data) {
          this.slots.push(response.data);
        } else {
          this.slots.push(this.newSlot);
        //  console.warn('API response.data is missing, pushing newSlot directly.');
        }

        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'เพิ่มช่วงเวลาใหม่เรียบร้อยแล้ว',
          life: 3000
        });

        this.timeService.getSlot().subscribe(data => {
          this.slots = data;
        });

        this.hideAddSlotDialog();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ข้อผิดพลาด',
          detail: 'ไม่สามารถเพิ่มช่วงเวลาได้: ' + (error.error?.message || error.message),
          life: 5000
        });
        console.error('เกิดข้อผิดพลาดในการเพิ่มช่วงเวลา:', error);
      },
      complete: () => {
        console.log('การดำเนินการเพิ่มช่วงเวลาเสร็จสมบูรณ์');
      }
    });
  }

  confirmDelete(slot: SlotModel): void {
    this.confirmationService.confirm({
      message: `คุณต้องการลบช่วงเวลา รหัส ${slot.TIMESLOTID} (${slot.SLOTFROM} - ${slot.SLOTTO}) ใช่หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ใช่',
      rejectLabel: 'ไม่',
      accept: () => {
        this.deleteSlot(slot.TIMESLOTID);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'ยกเลิก', detail: 'ยกเลิกการลบข้อมูล', life: 3000 });
      }
    });
  }

  deleteSlot(id: string): void {
    this.timeService.deleteSlot(id).subscribe({
      next: (response) => {
      //  console.log('API ตอบกลับสำเร็จ (ลบข้อมูล):', response);
        this.slots = this.slots.filter(s => s.TIMESLOTID !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'ลบช่วงเวลาเรียบร้อยแล้ว',
          life: 3000
        });
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

  showEditSlotDialog(slot: SlotModel): void {
    this.displayEditSlotDialog = true;
    this.editSlot = { ...slot }; // clone object

    // แปลง string -> Date สำหรับ p-calendar
    if (slot.SLOTFROM) {
      const [h, m] = slot.SLOTFROM.split('.').map(Number);
      this.editSlotFromTime = new Date();
      this.editSlotFromTime.setHours(h, m, 0);
    }
    if (slot.SLOTTO) {
      const [h, m] = slot.SLOTTO.split('.').map(Number);
      this.editSlotToTime = new Date();
      this.editSlotToTime.setHours(h, m, 0);
    }
  }

  hideEditSlotDialog(): void {
    this.displayEditSlotDialog = false;
  }

  updateSlot(): void {
    if (!this.editSlotFromTime || !this.editSlotToTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'กรุณาเลือกเวลาเริ่มต้นและสิ้นสุด',
        life: 3000
      });
      return;
    }

    if (this.editSlotFromTime >= this.editSlotToTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อผิดพลาด',
        detail: 'เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด',
        life: 3000
      });
      return;
    }

    this.editSlot.SLOTFROM = `${this.editSlotFromTime.getHours().toString().padStart(2, '0')}.${this.editSlotFromTime.getMinutes().toString().padStart(2, '0')}`;
    this.editSlot.SLOTTO = `${this.editSlotToTime.getHours().toString().padStart(2, '0')}.${this.editSlotToTime.getMinutes().toString().padStart(2, '0')}`;
    this.timeService.updateSlot(this.editSlot.TIMESLOTID, this.editSlot).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'แก้ไขช่วงเวลาเรียบร้อยแล้ว',
          life: 3000
        });
        // โหลดข้อมูลใหม่ทันที
        this.timeService.getSlot().subscribe(data => {
          this.slots = data;
        });
        this.hideEditSlotDialog();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'ไม่สามารถแก้ไขช่วงเวลาได้',
          life: 3000
        });
      }
    });

  }

}

