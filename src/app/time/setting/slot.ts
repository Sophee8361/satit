import { Component, OnInit } from '@angular/core';
import { SlotService } from '../service/slot.service';
import { SlotModel } from '../service/slot.model';
import { CommonModule } from '@angular/common';

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
import { DropdownModule } from 'primeng/dropdown';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-slot',
  standalone: true,
  imports: [
    CommonModule,
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
    ConfirmDialogModule,
    DropdownModule,
    Card
  ],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <p-table
        #dt1
        [value]="filteredSlots"
        [loading]="loadingSlots"
        [globalFilterFields]="['NO','TIMESLOTID','SLOTFROM','SLOTTO']"
        selectionMode="single"
        [(selection)]="selectedSlot"
        dataKey="TIMESLOTID"
        [rows]="10"
        [paginator]="true"
        [responsiveLayout]="'scroll'"
        stateStorage="session"
        stateKey="statedemo-session"
      >
        <ng-template #caption>
          <div class="flex gap-2 items-center flex-wrap">
            <p-button
              label="เพิ่มช่วงเวลา"
              icon="pi pi-plus"
              [loading]="loadingAdd"
              severity="success"
              [raised]="true"
              (click)="showAddSlotDialog()"
            ></p-button>

            <p-dropdown
              [options]="slotTypesFilter"
              [(ngModel)]="selectedSlotTypeFilter"
              placeholder="กรองประเภท"
              (onChange)="filterByType()"
              class="ml-2 w-40"
            ></p-dropdown>
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
            <th pSortableColumn="TIMESLOTID">รหัสช่วงเวลา <p-sortIcon field="TIMESLOTID"/></th>
            <th pSortableColumn="SLOTFROM">เริ่มต้น <p-sortIcon field="SLOTFROM"/></th>
            <th pSortableColumn="SLOTTO">สิ้นสุด <p-sortIcon field="SLOTTO"/></th>
            <th>ประเภท</th>
            <th>การดำเนินการ</th>
          </tr>
        </ng-template>

        <ng-template #body let-slot>
          <tr [pSelectableRow]="slot" [ngClass]="{'bg-blue-50': slot.TYPE==='S','bg-orange-50': slot.TYPE==='E'}">
            <td>{{ slot.TIMESLOTID }}</td>
            <td>{{ slot.SLOTFROM }}</td>
            <td>{{ slot.SLOTTO }}</td>
            <td>
              <p-tag [value]="slot.TYPE==='S'?'คาบเรียน':'คาบสอบ'" [severity]="slot.TYPE==='S'?'info':'warning'"></p-tag>
            </td>
            <td>
              <p-button
                icon="pi pi-pencil"
                styleClass="p-button-warning p-button-sm mr-2"
                [loading]="loadingEdit && editSlot?.TIMESLOTID === slot.TIMESLOTID"
                (click)="showEditSlotDialog(slot)"
              ></p-button>
              <p-button
                icon="pi pi-trash"
                styleClass="p-button-danger p-button-sm"
                [loading]="loadingDelete && deletingSlotId === slot.TIMESLOTID"
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

    <!-- Dialog เพิ่ม Slot -->
    <p-dialog
      header="เพิ่มช่วงเวลาใหม่"
      [(visible)]="displayAddSlotDialog"
      [modal]="true"
      [style]="{ width: '40rem' }"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
      styleClass="p-dialog-rounded"
    >
      <div class="p-fluid">
        <div class="grid formgrid gap-4">
          <div class="field col-12 md:col-6">
            <label for="no">ลำดับ</label>
            <input pInputText id="no" type="text" [(ngModel)]="newSlot.TIMESLOTID" disabled class="w-full"/>
          </div>
          <div class="field col-12 md:col-6">
            <label for="slotType">ประเภท</label>
            <p-dropdown
              id="slotType"
              [options]="slotTypes"
              [(ngModel)]="newSlot.TYPE"
              placeholder="เลือกประเภท"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            ></p-dropdown>
          </div>
          <div class="flex gap-4 col-12">
            <div class="field flex-1">
              <label for="slotFromTime">เริ่มต้น (เวลา)</label>
              <p-calendar
                inputId="slotFromTime"
                [(ngModel)]="newSlotFromTime"
                [timeOnly]="true"
                hourFormat="24"
                [showTime]="true"
                placeholder="HH:MM"
                class="w-full"
                appendTo="body"
              ></p-calendar>
            </div>
            <div class="field flex-1">
              <label for="slotToTime">สิ้นสุด (เวลา)</label>
              <p-calendar
                inputId="slotToTime"
                [(ngModel)]="newSlotToTime"
                [timeOnly]="true"
                hourFormat="24"
                [showTime]="true"
                placeholder="HH:MM"
                class="w-full"
                appendTo="body"
              ></p-calendar>
            </div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <!-- เปลี่ยนจาก hideEditSlotDialog() เป็น hideAddSlotDialog() -->
          <p-button label="ยกเลิก" icon="pi pi-times" (click)="hideAddSlotDialog()" severity="secondary" [text]="true"></p-button>
          <p-button label="บันทึก" icon="pi pi-check" (click)="saveNewSlot()" severity="success" [raised]="true" [loading]="loadingAdd" [disabled]="!newSlot.TYPE || !newSlotFromTime || !newSlotToTime"></p-button>
        </div>
      </ng-template>

    </p-dialog>

    <!-- Dialog แก้ไข Slot -->
    <p-dialog
      header="แก้ไขช่วงเวลา"
      [(visible)]="displayEditSlotDialog"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
      styleClass="p-dialog-rounded p-dialog-header-primeng"
      [style]="{ width: '40rem' }"
    >
      <div class="p-fluid">
        <p-card styleClass="p-shadow-4 p-3">
          <!-- รหัสช่วงเวลา -->
          <div class="mb-4">
            <label for="edit-id" class="block text-900 font-bold mb-2">รหัสช่วงเวลา</label>
            <input
              pInputText
              id="edit-id"
              [(ngModel)]="editSlot.TIMESLOTID"
              disabled
              class="w-full surface-200"
            />
          </div>

          <!-- Flex container สำหรับเวลาเริ่มต้นและสิ้นสุด -->
          <div class="flex gap-4">
            <!-- เวลาเริ่มต้น -->
            <div class="flex-1">
              <label for="edit-slot-from" class="block text-900 font-bold mb-2">เริ่มต้น (เวลา)</label>
              <p-calendar
                inputId="edit-slot-from"
                [(ngModel)]="editSlotFromTime"
                [timeOnly]="true"
                hourFormat="24"
                [showTime]="true"
                placeholder="HH:MM"
                appendTo="body"
                class="w-full"
              ></p-calendar>
            </div>

            <!-- เวลาสิ้นสุด -->
            <div class="flex-1">
              <label for="edit-slot-to" class="block text-900 font-bold mb-2">สิ้นสุด (เวลา)</label>
              <p-calendar
                inputId="edit-slot-to"
                [(ngModel)]="editSlotToTime"
                [timeOnly]="true"
                hourFormat="24"
                [showTime]="true"
                placeholder="HH:MM"
                appendTo="body"
                class="w-full"
              ></p-calendar>
            </div>
          </div>
        </p-card>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button
            label="ยกเลิก"
            icon="pi pi-times"
            (click)="hideEditSlotDialog()"
            severity="secondary"
            [text]="true"
            styleClass="p-button-text"
          ></p-button>

          <p-button
            label="บันทึก"
            icon="pi pi-check"
            (click)="updateSlot()"
            severity="success"
            [raised]="true"
            [loading]="loadingEdit"
            [disabled]="!editSlotFromTime || !editSlotToTime"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>



  `,
  providers: [MessageService, ConfirmationService]
})
export class SlotComponent implements OnInit {
  slots: SlotModel[] = [];
  filteredSlots: SlotModel[] = [];
  selectedSlot: SlotModel | null = null;

  displayAddSlotDialog: boolean = false;
  displayEditSlotDialog: boolean = false;

  newSlot: SlotModel = { NO:'', TIMESLOTID:'', SLOTFROM:'', SLOTTO:'', TYPE:'' };
  newSlotFromTime?: Date;
  newSlotToTime?: Date;

  editSlot: SlotModel = { NO:'', TIMESLOTID:'', SLOTFROM:'', SLOTTO:'', TYPE:'' };
  editSlotFromTime?: Date;
  editSlotToTime?: Date;

  loadingSlots: boolean = false;
  loadingAdd: boolean = false;
  loadingEdit: boolean = false;
  loadingDelete: boolean = false;
  deletingSlotId: string | null = null;

  slotTypes = [
    { label: 'คาบเรียน', value: 'S' },
    { label: 'คาบสอบ', value: 'E' }
  ];

  slotTypesFilter = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'คาบเรียน', value: 'S' },
    { label: 'คาบสอบ', value: 'E' }
  ];
  selectedSlotTypeFilter: string = '';

  constructor(private timeService: SlotService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void { this.loadSlots(); }

  loadSlots() {
    this.loadingSlots = true;
    this.timeService.getSlot().subscribe({
      next: data => {
        this.slots = data;
        this.filteredSlots = [...this.slots];
        this.loadingSlots = false;
      },
      error: () => { this.loadingSlots = false; }
    });
  }

  filterByType() {
    this.loadingSlots = true;
    setTimeout(() => {
      this.filteredSlots = this.selectedSlotTypeFilter ? this.slots.filter(s => s.TYPE === this.selectedSlotTypeFilter) : [...this.slots];
      this.loadingSlots = false;
    }, 200);
  }

  onGlobalFilterInput(event: Event, dt: any) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  showAddSlotDialog() {
    this.displayAddSlotDialog = true;
    this.newSlot = { NO:'', TIMESLOTID:'', SLOTFROM:'', SLOTTO:'', TYPE:'' };
    this.newSlotFromTime = undefined;
    this.newSlotToTime = undefined;
    const maxId = this.slots.length > 0 ? Math.max(...this.slots.map(s => +s.TIMESLOTID)) : 0;
    this.newSlot.TIMESLOTID = (maxId + 1).toString();
  }

  hideEditSlotDialog() {
    this.displayEditSlotDialog = false;
  }


  saveNewSlot() {
    if (!this.newSlotFromTime || !this.newSlotToTime) return;
    if (this.newSlotFromTime >= this.newSlotToTime) return;

    this.loadingAdd = true;
    this.newSlot.SLOTFROM = `${this.newSlotFromTime.getHours().toString().padStart(2,'0')}.${this.newSlotFromTime.getMinutes().toString().padStart(2,'0')}`;
    this.newSlot.SLOTTO = `${this.newSlotToTime.getHours().toString().padStart(2,'0')}.${this.newSlotToTime.getMinutes().toString().padStart(2,'0')}`;
    console.log(this.newSlot)
    this.timeService.addSlot(this.newSlot).subscribe({
      next: res => {
        this.slots.push(res.data || this.newSlot);
        this.filterByType();
        this.messageService.add({ severity:'success', summary:'สำเร็จ', detail:'เพิ่มช่วงเวลาเรียบร้อย', life:3000 });
        this.displayAddSlotDialog = false;
        this.loadingAdd = false;
      },
      error: err => {
        this.messageService.add({ severity:'error', summary:'ผิดพลาด', detail:'ไม่สามารถเพิ่มช่วงเวลา: '+(err.error?.message||err.message), life:5000 });
        this.loadingAdd = false;
      }
    });
  }

  showEditSlotDialog(slot: SlotModel) {
    this.displayEditSlotDialog = true;
    this.editSlot = { ...slot };
    if(slot.SLOTFROM) { const [h,m] = slot.SLOTFROM.split('.').map(Number); this.editSlotFromTime = new Date(); this.editSlotFromTime.setHours(h,m,0); }
    if(slot.SLOTTO) { const [h,m] = slot.SLOTTO.split('.').map(Number); this.editSlotToTime = new Date(); this.editSlotToTime.setHours(h,m,0); }
  }

  updateSlot() {
    if (!this.editSlotFromTime || !this.editSlotToTime) return;
    if (this.editSlotFromTime >= this.editSlotToTime) return;

    this.loadingEdit = true;
    this.editSlot.SLOTFROM = `${this.editSlotFromTime.getHours().toString().padStart(2,'0')}.${this.editSlotFromTime.getMinutes().toString().padStart(2,'0')}`;
    this.editSlot.SLOTTO = `${this.editSlotToTime.getHours().toString().padStart(2,'0')}.${this.editSlotToTime.getMinutes().toString().padStart(2,'0')}`;

    this.timeService.updateSlot(this.editSlot.TIMESLOTID, this.editSlot).subscribe({
      next: () => {
        const index = this.slots.findIndex(s=>s.TIMESLOTID===this.editSlot.TIMESLOTID);
        if(index>-1) this.slots[index] = {...this.editSlot};
        this.filterByType();
        this.messageService.add({ severity:'success', summary:'สำเร็จ', detail:'แก้ไขช่วงเวลาเรียบร้อย', life:3000 });
        this.displayEditSlotDialog = false;
        this.loadingEdit = false;
      },
      error: () => {
        this.messageService.add({ severity:'error', summary:'ผิดพลาด', detail:'ไม่สามารถแก้ไขช่วงเวลาได้', life:5000 });
        this.loadingEdit = false;
      }
    });
  }

  confirmDelete(slot: SlotModel) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบช่วงเวลา รหัส ${slot.TIMESLOTID} (${slot.SLOTFROM} - ${slot.SLOTTO}) ใช่หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ใช่',
      rejectLabel: 'ไม่',
      accept: () => this.deleteSlot(slot.TIMESLOTID),
      reject: () => this.messageService.add({ severity:'info', summary:'ยกเลิก', detail:'ยกเลิกการลบข้อมูล', life:3000 })
    });
  }

  deleteSlot(id: string) {
    this.loadingDelete = true;
    this.deletingSlotId = id;
    this.timeService.deleteSlot(id).subscribe({
      next: () => {
        this.slots = this.slots.filter(s=>s.TIMESLOTID!==id);
        this.filterByType();
        this.messageService.add({ severity:'success', summary:'สำเร็จ', detail:'ลบช่วงเวลาเรียบร้อย', life:3000 });
        this.loadingDelete = false;
        this.deletingSlotId = null;
      },
      error: err => {
        this.messageService.add({ severity:'error', summary:'ผิดพลาด', detail:'ไม่สามารถลบช่วงเวลาได้: '+(err.error?.message||err.message), life:5000 });
        this.loadingDelete = false;
        this.deletingSlotId = null;
      }
    });
  }

  hideAddSlotDialog() {
    this.displayAddSlotDialog = false;
  }

}
