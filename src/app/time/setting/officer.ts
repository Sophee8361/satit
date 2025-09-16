import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { OfficerhrmModel, OfficerModel } from '../service/model/officer.model';
import { OfficerService } from '../service/officer.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-officer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, Select, ButtonModule, Dialog, HttpClientModule,
    Toast, IconField, InputIcon, InputText, TableModule, ConfirmDialog
  ],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog [style]="{ width: '30vw' }" [baseZIndex]="1000"></p-confirmDialog>
    <div class="card p-6 shadow-lg rounded-xl space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div class="font-semibold text-xl text-gray-800">จัดการครูผู้สอน</div>

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
      <div class="flex flex-wrap gap-4 items-center mt-8">
        <!-- ปีการศึกษา -->
        <div class="flex-1 min-w-[150px]">
          <label class="block font-semibold mb-2 text-gray-700">ปีการศึกษา</label>
          <p-select
            [options]="years"
            [(ngModel)]="selectedYear"
            placeholder="เลือกปีการศึกษา"
            [showClear]="true"
            class="w-full h-10"
            (onChange)="onFilterChange()"
          ></p-select>
        </div>

        <!-- ภาคเรียน -->
        <div class="flex-1 min-w-[150px]">
          <label class="block font-semibold mb-2 text-gray-700">ภาคเรียน</label>
          <p-select
            [options]="terms"
            [(ngModel)]="selectedTerm"
            placeholder="เลือกภาคเรียน"
            [showClear]="true"
            class="w-full h-10"
            (onChange)="onFilterChange()"
          ></p-select>
        </div>

        <!-- ผู้สอน + ปุ่ม -->
        <div class="flex-1 min-w-[250px]">
          <label class="block font-semibold mb-2 text-gray-700">ผู้สอน</label>
          <div class="flex items-center gap-3">
            <p-select
              [options]="officer"
              [(ngModel)]="selectedOfficer"
              optionLabel="fullName"
              placeholder="เลือกผู้สอน"
              class="flex-1 h-10"
              [showClear]="true"
              [filter]="true"
            ></p-select>
            <p-button
              label="เพิ่มข้อมูล"
              icon="pi pi-plus"
              [raised]="true"
              severity="success"
              (click)="addOfficer()"
              [disabled]="!selectedYear || !selectedTerm || !selectedOfficer"
            ></p-button>
          </div>
        </div>
      </div>

      <div class="card mt-8">
        <p-table
          #dt1
          [value]="filteredOfficers"
          [globalFilterFields]="['STAFFCODE', 'STAFFNAME', 'STAFFSERNAME']"
          selectionMode="single"
          [(selection)]="selectedTableOfficer"
          dataKey="OFFICERID"
          [tableStyle]="{ 'min-width': '50rem' }"
          [rows]="10"
          [paginator]="true"
          stateStorage="session"
          stateKey="statedemo-session"
        >
          <ng-template #caption>
            <div class="flex">
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

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="STAFFCODE">รหัสเจ้าหน้าที่ <p-sortIcon field="STAFFCODE" /></th>
              <th pSortableColumn="STAFFNAME">ชื่อ <p-sortIcon field="STAFFNAME" /></th>
              <th pSortableColumn="STAFFSERNAME">นามสกุล <p-sortIcon field="STAFFSERNAME" /></th>
              <th pSortableColumn="ACADYEAR">ปีการศึกษา <p-sortIcon field="ACADYEAR" /></th>
              <th pSortableColumn="SEMESTER">ภาคเรียน <p-sortIcon field="SEMESTER" /></th>
              <th>การดำเนินการ</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-officer>
            <tr [pSelectableRow]="officer">
              <td>{{ officer.STAFFCODE }}</td>
              <td>{{ officer.STAFFNAME }}</td>
              <td>{{ officer.STAFFSERNAME }}</td>
              <td>{{ officer.ACADYEAR }}</td>
              <td>{{ officer.SEMESTER }}</td>
              <td>
                <p-button
                  icon="pi pi-trash"
                  styleClass="p-button-danger p-button-sm"
                  (click)="confirmDelete(officer)"
                ></p-button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-12">
                <div class="flex flex-col items-center justify-center gap-4">
                  <i class="pi pi-calendar-times text-6xl text-gray-300"></i>
                  <span class="text-2xl font-semibold text-gray-500">
                    ไม่พบข้อมูลผู้สอน
                  </span>
                  <span class="text-gray-400 text-sm">
                    กรุณาเพิ่มข้อมูลผู้สอน
                  </span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
  providers: [MessageService, ConfirmationService]
})
export class OfficerComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;

  currentYear = new Date().getFullYear() + 543;
  years: number[] = [this.currentYear, this.currentYear + 1];
  terms: string[] = ['1', '2', 'Summer'];
  selectedYear: string | undefined = undefined;
  selectedTerm: string | undefined = undefined;

  officer: (OfficerhrmModel & { fullName: string })[] = [];
  currentOfficers: OfficerModel[] = [];
  selectedOfficer?: OfficerhrmModel & { fullName: string };
  selectedTableOfficer?: OfficerModel;

  constructor(
    private http: HttpClient,
    private officerService: OfficerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadHrmOfficers();
   // this.getOfficers();
  }

  // -----------------------------
  // Client-side filtering getter
  get filteredOfficers(): OfficerModel[] {
    return this.currentOfficers.filter(off =>
      (!this.selectedYear || String(off.ACADYEAR) === String(this.selectedYear)) &&
      (!this.selectedTerm || String(off.SEMESTER) === String(this.selectedTerm))
    );
  }


  onFilterChange() {
    this.selectedTableOfficer = undefined; // รีเซ็ต selection

    if (this.selectedYear && this.selectedTerm) {
      this.getOfficers(); // โหลดข้อมูลจาก service
    } else {
      this.currentOfficers = []; // ถ้ายังไม่ได้เลือกครบ ให้ว่าง
    }
  }
  // -----------------------------
  getOfficers() {
    this.officerService.getOfficers().subscribe({
      next: (res) => {
        this.currentOfficers = res;
      },
      error: (err) => {
        console.error('Error loading officers:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'ไม่สามารถโหลดข้อมูลเจ้าหน้าที่ได้',
          life: 5000
        });
      }
    });
  }

  loadHrmOfficers() {
    const apiUrl = 'https://api-eduservice.yru.ac.th/api-fee/satit/hrm/';
    this.http.get<OfficerhrmModel[]>(apiUrl).subscribe({
      next: (res) => {
        this.officer = res.map(off => ({
          ...off,
          fullName: `${off.PREFIXNAME} ${off.STAFFNAME} ${off.STAFFSURNAME}`
        }));
      },
      error: (err) => {
        console.error('Error loading HRM officers:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: 'ไม่สามารถโหลดข้อมูลเจ้าหน้าที่จาก HRM API ได้',
          life: 5000
        });
      }
    });
  }

  addOfficer() {
    if (!this.selectedOfficer || !this.selectedYear || !this.selectedTerm) {
      this.messageService.add({
        severity: 'warn',
        summary: 'คำเตือน',
        detail: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
        life: 3000
      });
      return;
    }

    const existingOfficer = this.currentOfficers.find(
      o => o.STAFFCODE === this.selectedOfficer?.STAFFCODE &&
        o.ACADYEAR === this.selectedYear &&
        o.SEMESTER === this.selectedTerm
    );

    if (existingOfficer) {
      this.messageService.add({
        severity: 'warn',
        summary: 'คำเตือน',
        detail: 'ข้อมูลเจ้าหน้าที่นี้มีอยู่แล้วในภาคเรียนที่เลือก',
        life: 5000
      });
      return;
    }

    const payload: Partial<OfficerModel> = {
      ACADYEAR: this.selectedYear,
      SEMESTER: this.selectedTerm,
      STAFFCODE: this.selectedOfficer.STAFFCODE,
      STAFFNAME: this.selectedOfficer.STAFFNAME,
      STAFFSERNAME: this.selectedOfficer.STAFFSURNAME,
      STAFFID_HRM: this.selectedOfficer.STAFFID,
      PREFIXID: this.selectedOfficer.PREFIXNAME,
    };

    this.officerService.addOfficer(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'บันทึกข้อมูลเจ้าหน้าที่สำเร็จ',
          life: 3000
        });
        this.getOfficers();
        this.selectedOfficer = undefined;
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
  }

  confirmDelete(officer: OfficerModel) {
    this.confirmationService.confirm({
      message: 'คุณต้องการลบข้อมูลเจ้าหน้าที่ ' + officer.STAFFNAME + ' ใช่หรือไม่?',
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ใช่',
      rejectLabel: 'ไม่',
      accept: () => this.deleteOfficer(officer)
    });
  }

  deleteOfficer(officer: OfficerModel) {
    if (!officer.STAFFID) return;
    this.officerService.deleteOfficer(officer.STAFFID).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'ลบข้อมูลเจ้าหน้าที่สำเร็จ',
          life: 3000
        });
        this.getOfficers();
      },
      error: (err) => {
        console.error('Error deleting officer:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: err?.error?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล',
          life: 5000
        });
      }
    });
  }

  onGlobalFilterInput(event: Event, table: Table) {
    const filterValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(filterValue, 'contains');
  }

  protected readonly environment = environment;
}
