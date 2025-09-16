import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClassstructureService  } from './service/classstructure.service';
import { ClassStructure } from './service/model/classtime.model'; // นำเข้า ClassStructure model
import { environment } from "../../../../environments/environment";
//console.log(environment.acadYear);

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { Staff, Level, Class, Subject, SlotModel } from './service/slot.model';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Drawer } from 'primeng/drawer';
import { Divider } from 'primeng/divider';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SectionCard } from '../../../../master-theme/src/app/layout/components/ui/sectioncard';
import { Select } from 'primeng/select';
import { MeterGroup } from 'primeng/metergroup';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    MultiSelectModule,
    Ripple,
    TableModule,
    Toast,
    Drawer,
    Divider,
    ConfirmDialog,
    SectionCard,
    Select,
    MeterGroup,
    Tooltip
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card p-4 shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div class="font-semibold text-xl text-gray-800">จัดผู้สอน</div>

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

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
      <!-- แถบ Toolbar สำหรับฟอร์มการกรอกข้อมูล -->
      <p-toolbar styleClass="mb-4 p-4 rounded-lg shadow-sm">
        <ng-template pTemplate="start">
          <div class="flex flex-wrap gap-3">
            <!-- Dropdown สำหรับเลือกระดับ -->
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

            <!-- Dropdown สำหรับเลือกชั้นเรียน -->
            <div class="equal-width">
              <p-dropdown
                [options]="class"
                [(ngModel)]="selectedGrade"
                [showClear]="true"
                placeholder="เลือกชั้น"
                optionLabel="name"
                [disabled]="!selectedLevel"
                (onChange)="onGradeChange($event)"
                class="w-full"
              ></p-dropdown>
            </div>
            <!-- Dropdown สำหรับเลือกห้องเรียน -->
            <div class="equal-width">
              <p-dropdown
                [options]="rooms"
                [(ngModel)]="selectedRoom"
                [showClear]="true"
                placeholder="เลือกห้องเรียน"
                optionLabel="name"
                class="w-full"
                [disabled]="!selectedLevel || !selectedGrade"
                (onChange)="onRoomChange($event)"
              ></p-dropdown>
            </div>
            <!-- Dropdown สำหรับเลือกวิชา -->
            <div class="equal-width">
              <p-dropdown
                [options]="filteredSubjects"
                [(ngModel)]="selectedSubject"
                [showClear]="true"
                placeholder="เลือกวิชา"
                optionLabel="name"
                [filter]="true"
                class="w-full"
                [disabled]="!selectedLevel || !selectedGrade || !selectedRoom"
                (onChange)="onSubjectChange($event)"
              ></p-dropdown>
            </div>
            <!-- MultiSelect สำหรับเลือกผู้สอน -->
            <div class="equal-width">
              <p-multiSelect
                [options]="instructors"
                [(ngModel)]="selectedInstructors"
                [disabled]="!selectedLevel || !selectedGrade || !selectedSubject"
                placeholder="เลือกผู้สอน"
                optionLabel="name"
                class="w-full"
                (onChange)="onInstructorsChange($event)"
              ></p-multiSelect>
            </div>
            <!-- InputNumber สำหรับใส่หน่วยชั่วโมง -->
            <div class="equal-width">
              <p-inputNumber
                [(ngModel)]="creditHours"
                placeholder="หน่วยชั่วโมง"
                mode="decimal"
                [min]="0"
                [disabled]="!selectedLevel || !selectedGrade || !selectedSubject"
                [maxFractionDigits]="0"
                class="w-full"
              ></p-inputNumber>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="end">
          <!-- ปุ่มบันทึกข้อมูล -->
          <p-button
            label="บันทึกข้อมูล"
            icon="pi pi-save"
            (click)="saveData()"
            severity="primary"
          ></p-button>
        </ng-template>
      </p-toolbar>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- ตารางแสดงข้อมูลการจัดผู้สอน -->
        <div class="md:w-9/12 space-y-4">
          <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">แสดงรายวิชาและผู้สอน</div>
            <p-table
              responsiveLayout="scroll"
              [value]="classStructureData"
              [paginator]="true"
              [rows]="10"
              [tableStyle]="{ 'min-width': '50rem' }"
              [rowsPerPageOptions]="[5, 10, 20]"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th style="width:auto">วิชา</th>
                  <th style="width:auto">จำนวนชั่วโมง</th>
                  <th style="width:auto">จำนวนชั่วโมงคงเหลือ</th>
                  <th style="width:auto">ครูผู้สอน</th>
                  <th style="width:10rem"></th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <div class="flex items-center">
                      <i [class]="'text-xl text-primary mr-2 ' + item.icon"></i>
                      <span>{{ item.COURSENAME }}</span>
                    </div>
                  </td>
                  <td>
                    <span>{{ item.UNIT }}</span>
                  </td>
                  <td>
                    <span>{{ item.UNITSEAT }}</span>
                  </td>

                  <td>
                    <span>{{ item.STAFF1_NAME }} {{ item.STAFF2_NAME }}</span>
                  </td>

                  <td class="text-center">
                    <p-button icon="pi pi-search"
                              styleClass="p-button-rounded p-button-info p-button-sm mr-2"
                              (click)="showSelectedData(item)" />
                    <p-button
                      icon="pi pi-trash"
                      styleClass="p-button-rounded p-button-danger p-button-sm"
                      (click)="confirmDelete(item)"
                      [disabled]="item.UNITSEAT < 1"
                      [pTooltip]="item.UNITSEAT < 1 ? 'รายการนี้มีการจัดตารางสอนแล้ว ไม่สามารถลบได้' : ''"
                      tooltipPosition="top"
                    >
                    </p-button>
                  </td>

                </tr>
              </ng-template>
              <!-- ปรับปรุงการไฮไลท์ข้อความเมื่อไม่มีข้อมูลในตาราง -->
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="5" class="text-center py-12">
                    <div class="flex flex-col items-center justify-center gap-4">
                      <!-- ไอคอน -->
                      <i class="pi pi-calendar-times text-6xl text-gray-300"></i>
                      <!-- ข้อความ -->
                      <span class="text-2xl font-semibold text-gray-500">
                        ไม่พบข้อมูลรายวิชา
                      </span>
                                    <!-- คำแนะนำ -->
                      <span class="text-gray-400 text-sm">
                        กรุณาเลือกระดับ ชั้นเรียน และวัน เพื่อแสดงข้อมูลตารางสอน
                      </span>
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="footer">
                <tr>
                  <td class="font-bold">รวมหน่วยขั้วโมง</td>
                  <td class="font-bold">{{ getTotalUnits() }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <!-- MeterGroup แสดงสถิติผู้สอน (อัปเดตแล้ว) -->
        <div class="md:w-3/12 space-y-4">
          <section-card class="xl:col-span-1 flex flex-col">
            <ng-template #title>
              <div class="flex items-center gap-2">
                <i class="pi pi-chart-bar text-lg text-primary"></i>
                <span>สถิติผู้สอนตามหน่วยชั่วโมง</span>
              </div>
            </ng-template>


            <ng-container *ngIf="getStaffMeterData().length > 0; else noMeterData">
              <p-meter-group [value]="getStaffMeterData()" labelPosition="end" class="mt-6 flex-1">

                <!-- Meter bar -->
                <ng-template #meter let-value let-styleClass="class" let-width="size" let-index="index">
                  <span
                    [ngClass]="{
                      'rounded-l-full': index === 0,
                      'rounded-r-full': index === (getStaffMeterData().length - 1),
                      'ml-px': index > 0
                    }"
                    [style.width.%]="value.value"
                    [style.background]="value.color"
                    [pTooltip]="value.label + ': ' + value.unit + ' ชั่วโมง'"
                    tooltipPosition="top"
                  ></span>
                </ng-template>

                <!-- Label ด้านข้าง bar -->
                <ng-template #label let-value>
                  <div class="flex flex-col gap-2 mt-4">
                    <div *ngFor="let val of value" class="flex items-center gap-2">
                      <span
                        class="w-3 h-3 rounded-full border border-gray-300"
                        [style.background]="val.color"
                      ></span>
                      <span class="flex-1 font-medium text-gray-700">{{ val.label }}</span>
                      <span class="font-bold text-gray-900">{{ val.unit }} ชั่วโมง</span>
                    </div>
                  </div>
                </ng-template>

              </p-meter-group>
            </ng-container>

            <ng-template #noMeterData>
              <div class="text-center text-gray-500 py-6">
                ไม่พบข้อมูลสถิติผู้สอน
              </div>
            </ng-template>
          </section-card>

        </div>
      </div>

<!--      <div class="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]">-->
<!--        &lt;!&ndash; ตารางแสดงข้อมูลการจัดผู้สอน (ซ้าย 8 ส่วน) &ndash;&gt;-->
<!--        <div class="md:w-8/12 flex flex-col gap-4">-->
<!--          <div class="card flex flex-col gap-4 flex-1">-->
<!--            <div class="font-semibold text-xl">แสดงรายวิชาและผู้สอน</div>-->
<!--            <p-table-->
<!--              [value]="classStructureData"-->
<!--              [paginator]="true"-->
<!--              [rows]="10"-->
<!--              responsiveLayout="scroll"-->
<!--              [rowsPerPageOptions]="[5, 10, 20]"-->
<!--              [tableStyle]="{ 'min-width': '100%' }"-->
<!--              class="flex-1"-->
<!--            >-->
<!--              <ng-template pTemplate="header">-->
<!--                <tr>-->
<!--                  <th style="width:auto">วิชา</th>-->
<!--                  <th style="width:auto">จำนวนชั่วโมง</th>-->
<!--                  <th style="width:auto">จำนวนที่นั่ง</th>-->
<!--                  <th style="width:auto">ครูผู้สอน</th>-->
<!--                  <th style="width:8rem"></th>-->
<!--                </tr>-->
<!--              </ng-template>-->

<!--              <ng-template pTemplate="body" let-item>-->
<!--                <tr>-->
<!--                  <td>-->
<!--                    <div class="flex items-center">-->
<!--                      <i [class]="'text-xl text-primary mr-2 ' + item.icon"></i>-->
<!--                      <span>{{ item.COURSENAME }}</span>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                  <td>{{ item.UNIT }}</td>-->
<!--                  <td>{{ item.UNITSEAT }}</td>-->
<!--                  <td>{{ item.STAFF1_NAME }} {{ item.STAFF2_NAME }}</td>-->
<!--                  <td class="text-center">-->
<!--                    <p-button icon="pi pi-search"-->
<!--                              styleClass="p-button-rounded p-button-info p-button-sm mr-2"-->
<!--                              (click)="showSelectedData(item)"></p-button>-->
<!--                    <p-button icon="pi pi-trash"-->
<!--                              styleClass="p-button-rounded p-button-danger p-button-sm"-->
<!--                              (click)="confirmDelete(item)"></p-button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </ng-template>-->

<!--              <ng-template pTemplate="emptymessage">-->
<!--                <tr>-->
<!--                  <td colspan="5" class="text-center py-12">-->
<!--                    <div class="flex flex-col items-center gap-4">-->
<!--                      <i class="pi pi-calendar-times text-6xl text-gray-300"></i>-->
<!--                      <span class="text-2xl font-semibold text-gray-500">ไม่พบข้อมูลรายวิชา</span>-->
<!--                      <span class="text-gray-400 text-sm">กรุณาเลือกระดับ ชั้นเรียน และวัน เพื่อแสดงข้อมูลตารางสอน</span>-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </ng-template>-->

<!--              <ng-template pTemplate="footer">-->
<!--                <tr>-->
<!--                  <td class="font-bold">รวมหน่วยชั่วโมง</td>-->
<!--                  <td class="font-bold">{{ getTotalUnits() }}</td>-->
<!--                  <td colspan="3"></td>-->
<!--                </tr>-->
<!--              </ng-template>-->
<!--            </p-table>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; สถิติผู้สอน (ขวา 4 ส่วน) &ndash;&gt;-->
<!--        <div class="md:w-4/12 flex flex-col gap-4">-->
<!--          <section-card class="flex flex-col flex-1 h-full">-->
<!--            <ng-template #title>สถิติผู้สอนตามหน่วยชั่วโมง</ng-template>-->

<!--            <ng-container *ngIf="getStaffMeterData().length > 0; else noMeterData">-->
<!--              <p-meter-group-->
<!--                [value]="getStaffMeterData()"-->
<!--                labelPosition="end"-->
<!--                class="flex flex-col flex-1 w-full h-full"-->
<!--              >-->
<!--                <ng-template #meter let-value let-styleClass="class" let-width="size" let-index="index">-->
<!--            <span-->
<!--              [ngClass]="{-->
<!--                'rounded-l-full': index === 0,-->
<!--                'rounded-r-full': index === (getStaffMeterData().length - 1),-->
<!--                'ml-px': index > 0-->
<!--              }"-->
<!--              [style.width.%]="value.value"-->
<!--              [style.background]="value.color"-->
<!--              [pTooltip]="value.label + ': ' + value.unit + ' ชั่วโมง'"-->
<!--              tooltipPosition="top"-->
<!--            ></span>-->
<!--                </ng-template>-->

<!--                <ng-template #label let-value>-->
<!--                  <div class="flex flex-col gap-2 mt-4 overflow-y-auto">-->
<!--                    <div *ngFor="let val of value" class="flex items-center gap-2">-->
<!--                      <span class="w-3 h-3 rounded-full border border-gray-300" [style.background]="val.color"></span>-->
<!--                      <span class="flex-1 font-medium text-gray-700">{{ val.label }}</span>-->
<!--                      <span class="font-bold text-gray-900">{{ val.unit }} ชั่วโมง</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </ng-template>-->
<!--              </p-meter-group>-->
<!--            </ng-container>-->

<!--            <ng-template #noMeterData>-->
<!--              <div class="text-center text-gray-500 py-6">-->
<!--                ไม่พบข้อมูลสถิติผู้สอน-->
<!--              </div>-->
<!--            </ng-template>-->
<!--          </section-card>-->
<!--        </div>-->
<!--      </div>-->




      <!-- แสดงข้อมูลที่เลือกในฟอร์ม (ปรับปรุง Layout แล้ว) -->
      <div class="mt-6 p-6 border border-gray-200 rounded-xl shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div class="info-item">
            <p class="text-gray-500 font-medium">ระดับที่เลือก</p>
            <p class="text-blue-600 font-bold text-lg">{{ selectedLevel?.name || 'ยังไม่ได้เลือก' }}</p>
          </div>

          <div class="info-item">
            <p class="text-gray-500 font-medium">ชั้นที่เลือก</p>
            <p class="text-blue-600 font-bold text-lg">{{ selectedGrade?.name || 'ยังไม่ได้เลือก' }}</p>
          </div>

          <div class="info-item">
            <p class="text-gray-500 font-medium">ห้องที่เลือก</p>
            <p class="text-blue-600 font-bold text-lg">{{ selectedRoom?.name || 'ยังไม่ได้เลือก' }}</p>
          </div>

          <div class="info-item">
            <p class="text-gray-500 font-medium">วิชาที่เลือก</p>
            <p class="text-blue-600 font-bold text-lg">{{ selectedSubject?.name || 'ยังไม่ได้เลือก' }}</p>
          </div>

          <div class="info-item">
            <p class="text-gray-500 font-medium">หน่วยชั่วโมง</p>
            <p class="text-blue-600 font-bold text-lg">{{ creditHours || 'ยังไม่ได้ระบุ' }}</p>
          </div>

          <div class="info-item">
            <p class="text-gray-500 font-medium">ผู้สอนที่เลือก</p>
            <p class="text-blue-600 font-bold text-lg" *ngIf="selectedInstructors.length > 0; else noInstructor">
              {{ selectedInstructorsNames }}
            </p>
            <ng-template #noInstructor>
              <p class="text-gray-400 font-bold text-lg">ยังไม่ได้เลือก</p>
            </ng-template>
          </div>

        </div>
      </div>

    </div>

    <!-- ส่วนของ p-drawer สำหรับแสดงรายละเอียดข้อมูล (ปรับปรุงแล้ว) -->
    <p-drawer [(visible)]="isDrawerVisible" [position]="'right'" [modal]="true" header="รายละเอียดข้อมูล"
              [style]="{ width: '500px' }">
      <!-- ใช้ *ngIf เพื่อแสดง/ซ่อนเนื้อหาทั้งหมดเมื่อไม่มีการเลือกข้อมูล -->
      <div class="p-4 bg-gray-50 h-full overflow-y-auto" *ngIf="selectedItemDetails; else noDrawerContent">
        <div class="flex items-center gap-2 mb-4 text-xl font-bold text-gray-700">
          <i class="pi pi-book"></i>
          <span>{{ selectedItemDetails.COURSENAME }}</span>
        </div>
        <p-divider></p-divider>
        <!-- ใช้ Grid เพื่อจัด Layout ให้เป็นระเบียบ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="detail-item">
            <span class="font-semibold text-gray-500">รหัสวิชา:</span>
            <span
              class="block text-gray-800 font-medium">{{ selectedItemDetails.COURCODE || selectedItemDetails.COURSEID }}</span>
          </div>
          <div class="detail-item">
            <span class="font-semibold text-gray-500">หน่วยชั่วโมง:</span>
            <span class="block text-gray-800 font-medium">{{ selectedItemDetails.UNIT }}</span>
          </div>
          <div class="detail-item">
            <span class="font-semibold text-gray-500">ระดับ/ชั้น:</span>
            <span class="block text-gray-800 font-medium">{{ selectedGrade?.name }}</span>
          </div>
          <div class="detail-item">
            <span class="font-semibold text-gray-500">ห้องเรียน:</span>
            <span class="block text-gray-800 font-medium">{{ selectedItemDetails.ROOM }}</span>
          </div>
          <div class="detail-item sm:col-span-2">
            <span class="font-semibold text-gray-500">ปีการศึกษา/ภาคเรียน:</span>
            <span class="block text-gray-800 font-medium">{{ selectedItemDetails.ACADYEAR }}
              / {{ selectedItemDetails.SEMESTER }}</span>
          </div>
          <div class="detail-item sm:col-span-2">
            <span class="font-semibold text-gray-500">ผู้สอน:</span>
            <span
              class="block text-gray-800 font-medium">{{ selectedItemDetails.STAFF1_NAME }} {{ selectedItemDetails.STAFF2_NAME || '' }}</span>
          </div>

        </div>

        <p-divider></p-divider>
        <div class="detail-item sm:col-span-2 bg-orange-400">
          <span class="font-semibold text-gray-500">ตารางสอน:</span>
          <!-- component.html -->
          <div *ngIf="classTime.length > 0; else noData" class="mt-3">
            <div *ngFor="let t of classTime"

                 class="p-3 mb-2 rounded shadow-sm">
              <p><strong>วัน:</strong> {{ t.DAYNAME }}</p>
              <p><strong>คาบเรียน:</strong> {{ t.TIMESLOTID }}</p>
              <p><strong>เวลา:</strong> {{ t.SLOTFROM }} - {{ t.SLOTTO }}</p>
            </div>
          </div>
          <ng-template #noData>
            <div class="p-3 text-center text-gray-500 bg-gray-100 rounded shadow-sm">
              ❌ ไม่พบข้อมูลตารางสอน
            </div>
          </ng-template>

        </div>
        <p-divider></p-divider>
        <p class="text-sm text-gray-500 mt-4 text-center">ข้อมูลถูกดึงมาจาก API: classstructure.php</p>
      </div>

      <ng-template #noDrawerContent>
        <div class="p-4 text-center text-gray-500">
          กรุณาเลือกรายการจากตารางเพื่อดูรายละเอียด
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: [`
    // กำหนดความกว้างของ Dropdown และ Input Number
    .equal-width {
      width: 170px;
    }

    .animated-bar {
      display: inline-block;
      height: 24px; /* ความสูง bar */
      transition: width 1.2s ease-in-out; /* Animation ความกว้าง */
    }

    // ปรับความกว้างสำหรับหน้าจอมือถือ
    @media (max-width: 768px) {
      .equal-width {
        width: 100%;
      }
    }
  `]
})
export class AddStaffComponent implements OnInit {
  // --- ตัวแปรสำหรับเก็บข้อมูลและสถานะต่างๆ ---
  instructors: Staff[] = []; // รายการผู้สอนทั้งหมด
  selectedInstructors: Staff[] = []; // ผู้สอนที่ถูกเลือก
  filteredSubjects: Subject[] = []; // รายการวิชาที่ถูกกรองตามชั้นเรียน
  allSubjectsForGrade: Subject[] = []; // รายการวิชาทั้งหมดสำหรับชั้นเรียนที่เลือก
  selectedSubject: Subject | undefined; // วิชาที่ถูกเลือก
  levels: Level[] = []; // รายการระดับชั้นเรียน
  selectedLevel: Level | undefined; // ระดับชั้นที่ถูกเลือก
  allClass: Class[] = []; // รายการชั้นเรียนทั้งหมด
  class: Class[] = []; // รายการชั้นเรียนที่ถูกกรองตามระดับ
  selectedGrade: Class | undefined; // ชั้นเรียนที่ถูกเลือก
  creditHours: number | undefined; // หน่วยชั่วโมง
  items: MenuItem[] = [];
  classStructureData: any[] = []; // ข้อมูลตารางการจัดผู้สอน
  classTime: any[]=[];
  files: File[] = [];
  rooms: { name: string, code: string }[] = [ // รายการห้องเรียน
    { name: 'ห้อง 1', code: '1' },
    { name: 'ห้อง 2', code: '2' }
  ];
  selectedRoom: { name: string, code: string } | undefined; // ห้องเรียนที่ถูกเลือก

  // ตัวแปรสำหรับควบคุม Drawer และเก็บข้อมูลที่ถูกเลือก
  isDrawerVisible: boolean = false; // สถานะการแสดง Drawer
  selectedItemDetails: any | null = null; // รายละเอียดของข้อมูลที่ถูกเลือกในตาราง
  classStructure: ClassStructure[] = [];

  // ตัวแปรสำหรับ MeterGroup (ข้อมูล Traffic)
  selectedTrafficMeterRange = {name: 'Yearly', unit: 'year'};
  trafficMeterRanges = [
    {name: 'Weekly', unit: 'week'},
    {name: 'Monthly', unit: 'month'},
    {name: 'Quarter', unit: 'quarter'},
    {name: 'Yearly', unit: 'year'}
  ];
  traffic = [
    {label: 'Facebook', color: '#F59E0B', value: 22},
    {label: 'Twitter', color: '#677489', value: 5},
    {label: 'Instagram', color: '#22C55E', value: 15},
    {label: 'Reddit', color: '#84CC16', value: 7},
    {label: 'Shopify', color: '#14B8A6', value: 8},
    {label: 'eBay', color: '#EAB308', value: 11}
  ];

  constructor(
    private classstructures: ClassstructureService,
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  // --- Lifecycle Hook: ถูกเรียกเมื่อ Component ถูกสร้างขึ้น ---
  ngOnInit() {
    this.loadInstructors();
    this.levels = [
      { name: 'ระดับประถม', code: 'PRIMARY' },
      { name: 'ระดับมัธยม', code: 'SECONDARY' }
    ];

    this.allClass = [
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

  // --- ฟังก์ชันสำหรับจัดการ Logic ของ Component ---

  get selectedInstructorsNames(): string {
    return this.selectedInstructors.length > 0
      ? this.selectedInstructors.map(i => i.name).join(', ')
      : '';
  }

  onLevelChange(event: any) {
    const selectedLevelCode = event.value?.code;
    if (selectedLevelCode) {
      this.class = this.allClass.filter(grade => grade.levelCode === selectedLevelCode);
    } else {
      this.class = [];
    }
    this.selectedGrade = undefined;
    this.selectedSubject = undefined;
    this.filteredSubjects = [];
    this.selectedInstructors = [];
    this.selectedRoom = undefined;
    this.classStructureData = [];
    this.allSubjectsForGrade = [];
  }

  onGradeChange(event: DropdownChangeEvent) {
    const selectedGradeCode = event.value?.code;
    if (selectedGradeCode) {
      this.http.get<any[]>('https://api-eduservice.yru.ac.th/api-fee/satit/time/class.php').subscribe({
        next: (allSubjectsFromApi) => {
          this.allSubjectsForGrade = allSubjectsFromApi
            .filter(subject => subject.LEVELCLASS === selectedGradeCode)
            .map(item => ({
              name: item.COURSENAME,
              code: item.COURSEID,
              levelCode: item.level_code,
              gradeCodes: [item.grade_code]
            }));
          console.log(`โหลดวิชาเรียนทั้งหมดสำหรับชั้นเรียน ${selectedGradeCode} แล้ว`);
          this.filteredSubjects = []; // ล้างรายการวิชาที่กรองแล้ว
        },
        error: (err) => {
          console.error(`โหลดข้อมูลวิชาเรียนสำหรับชั้นเรียน ${selectedGradeCode} ล้มเหลว`, err);
          this.allSubjectsForGrade = [];
        }
      });
    } else {
      this.allSubjectsForGrade = [];
    }
    this.selectedSubject = undefined;
    this.selectedInstructors = [];
    this.selectedRoom = undefined;
    this.classStructureData = [];
  }

  onInstructorsChange(event: any) {
    // สามารถเพิ่ม logic เพิ่มเติมที่นี่ได้
  }

  loadInstructors() {
    const year =  environment.acadYear;
    const semester = environment.semester;
    const username = 'admin';
    const password = '1234';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const headers = {
      'Authorization': basicAuth,
      'Content-Type': 'application/json'
    };

    this.http.get<any[]>('https://api-eduservice.yru.ac.th/satit/officer/', { headers }).subscribe({
      next: (data) => {
        const filtered = data.filter(item => item.ACADYEAR === year && item.SEMESTER === semester);
        this.instructors = filtered.map(item => ({
          name: `${item.PREFIXID} ${item.STAFFNAME} ${item.STAFFSERNAME}`,
          code: item.STAFFID
        }));
     //   console.log('โหลด instructors จาก API โดยตรง');
      },
      error: (err) => {
        console.error('โหลดข้อมูลผู้สอนล้มเหลว', err);
      }
    });
  }



  onSubjectChange(event: any) {
    if (!event.value) {
      this.selectedInstructors = [];
    }
  }

  saveData() {
    // *** เริ่มต้นการตรวจสอบข้อมูลที่นี่ ***
    if (!this.selectedSubject || this.selectedInstructors.length === 0 || !this.creditHours) {
      this.messageService.add({
        severity: 'error',
        summary: 'ข้อมูลไม่ครบถ้วน',
        detail: 'กรุณาเลือกวิชา, เลือกผู้สอน และระบุหน่วยชั่วโมง',
        life: 5000 // ข้อความจะแสดงเป็นเวลา 5 วินาที
      });
      console.log('❌ การบันทึกล้มเหลว: ข้อมูลไม่ครบถ้วน');
      return; // หยุดการทำงานของฟังก์ชันทันที
    }
    // *** สิ้นสุดการตรวจสอบข้อมูล ***

    const payload = {
      CLASS: this.selectedGrade?.code,
      ROOM: this.selectedRoom?.code,
      COURSEID: this.selectedSubject?.code,
      ACADYEAR: environment.acadYear,
      SEMESTER: environment.semester,
      SEMESTERINDEX: environment.semesterIndex,
      UNIT: this.creditHours,
      STAFFID: this.selectedInstructors.map(i => i.code),
    };
   // console.log('📝 ข้อมูลที่บันทึก:', payload);
    const username = 'admin';
    const password = '1234';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const headers = {
      'Authorization': basicAuth,
      'Content-Type': 'application/json'
    };
    this.http.post('https://api-eduservice.yru.ac.th/satit/staff/', payload, { headers }).subscribe({
      next: (res: any) => {
       // console.log('✅ บันทึกสำเร็จ:', res);
        this.messageService.add({ severity: 'success', summary: 'สำเร็จ', detail: res.message || 'บันทึกสำเร็จ' });
        console.log('API response:', res);
        this.selectedSubject = undefined;
        this.creditHours = undefined;
        this.selectedInstructors = [];
        if (this.selectedGrade && this.selectedRoom) {
          this.loadClassStructure(this.selectedGrade.code, this.selectedRoom.code);
        } else {
          this.loadClassStructure();
        }
      },
      error: (err) => {
        console.error('❌ บันทึกล้มเหลว:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'ผิดพลาด',
          detail: err.message || 'บันทึกล้มเหลว กรุณาลองใหม่'
        });
      }
    });
  }

  // Event handler เมื่อมีการเปลี่ยนค่าใน Dropdown ห้องเรียน
  onRoomChange(event: DropdownChangeEvent) {
   // console.log('Room selected:', event.value);
    this.selectedRoom = event.value;
    if (this.selectedGrade && this.selectedRoom) {
      this.loadClassStructure(this.selectedGrade.code, this.selectedRoom.code);
    } else {
      this.classStructureData = [];
      this.filteredSubjects = [...this.allSubjectsForGrade];
    }
    this.selectedSubject = undefined;
    this.selectedInstructors = [];
    this.creditHours = undefined;
  }

  // --- ฟังก์ชันหลักสำหรับโหลดข้อมูลตารางการจัดผู้สอน (ปรับปรุงแล้ว) ---
  loadClassStructure(gradeCode?: string, roomCode?: string) {
    const headers = {
      'Authorization': 'Basic ' + btoa('admin:1234'),
      'Content-Type': 'application/json'
    };

    this.http.get<any[]>('https://api-eduservice.yru.ac.th/satit/time/classstructure.php', { headers })
      .subscribe({
        next: (res) => {
          if (gradeCode && roomCode) {
            const filteredData = res.filter(item => {
              return item.CLASS === gradeCode
                && item.ROOM === roomCode
                && item.SEMESTERINDEX === environment.semesterIndex.toString(); // แปลงเป็นสตริง
            });
       //     console.log('📌 ข้อมูลหลังกรอง:', filteredData);
        //    console.log('📌 semesterIndex:', environment.semesterIndex.toString());
            this.classStructureData = this.groupDuplicateSubjects(filteredData);
            this.updateAvailableSubjects(); // กรองวิชาที่แสดงใน dropdown
          } else {
            this.classStructureData = this.groupDuplicateSubjects(res || []);
          }
        },
        error: (err) => {
          console.error('❌ ไม่สามารถโหลดข้อมูลตารางสอน', err);
          this.classStructureData = [];
          this.updateAvailableSubjects();
        }
      });
  }


  // --- ฟังก์ชันใหม่: กรองวิชาที่ถูกจัดไปแล้วออกจาก Dropdown ---
  updateAvailableSubjects() {
    const subjectsInTable = this.classStructureData.map(item => item.COURCODE || item.COURSEID);
    this.filteredSubjects = this.allSubjectsForGrade.filter(subject => {
      return !subjectsInTable.includes(subject.code);
    });
   // console.log('✅ รายการวิชาที่ใช้ได้ถูกอัปเดตแล้ว', this.filteredSubjects);
  }

  // --- ฟังก์ชันใหม่: จัดกลุ่มรายการวิชาที่ซ้ำกัน ---
  groupDuplicateSubjects(data: any[]): any[] {
    const uniqueSubjects = new Map<string, any>();
    data.forEach(item => {
      // สร้างคีย์ที่ไม่ซ้ำกันจากข้อมูลที่สำคัญ (วิชา, หน่วยชั่วโมง, ผู้สอน)
      const staffNames = `${item.STAFF1_NAME || ''}|${item.STAFF2_NAME || ''}`;
      const key = `${item.COURSENAME}|${item.UNIT}|${staffNames}`;

      // ถ้าคีย์นี้ยังไม่มีใน Map ให้เพิ่มเข้าไป
      if (!uniqueSubjects.has(key)) {
        uniqueSubjects.set(key, item);
      }
    });
    // ส่งคืนข้อมูลในรูปแบบ Array
    return Array.from(uniqueSubjects.values());
  }

  // คำนวณผลรวมของหน่วยกิต
  getTotalUnits(): number {
    if (!this.classStructureData || this.classStructureData.length === 0) {
      return 0;
    }
    // ใช้ข้อมูลที่ผ่านการกรุ๊ปแล้วในการคำนวณ
    return this.classStructureData.reduce((sum, item) => sum + Number(item.UNIT), 0);
  }

  showSelectedData(item: any) {
    this.selectedItemDetails = item;
    this.isDrawerVisible = true;
  //  console.log(this.selectedItemDetails);

    const headers = {
      'Authorization': 'Basic ' + btoa('admin:1234'),
      'Content-Type': 'application/json'
    };

    this.http.get<any[]>('https://api-eduservice.yru.ac.th/satit/time/classtimetable.php', { headers })
      .subscribe({
        next: (res) => {
       //   console.log('✅ API Response:', res);   // 👉 log ทั้งหมดออกมา
       //   console.log(this.selectedGrade?.code)
          // เพิ่มเงื่อนไขกรอง ชั้น และ ห้อง
          const filtered = res.filter(x =>
            x.COURSEID === item.COURSEID &&
            x.CLASS === this.selectedGrade?.code &&
            x.ROOM === this.selectedRoom?.code &&
            x.SEMESTERINDEX === environment.semesterIndex
          );
          this.classTime = filtered; // เก็บไว้ใช้งานต่อ
          console.log(this.classTime)
        },
        error: (err) => {
          console.error('❌ ไม่สามารถโหลดข้อมูลตารางสอน', err);
          this.classTime = [];
          this.updateAvailableSubjects();
        }
      });
  }

  confirmDelete(item: any) {
    this.confirmationService.confirm({
      message: `คุณต้องการลบข้อมูลการจัดผู้สอนของวิชา '${item.COURSENAME}' รหัสวิชา ${item.ID} หรือไม่?`,
      header: 'ยืนยันการลบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.deleteItem(item.ID);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'ยกเลิก', detail: 'ยกเลิกการลบข้อมูล', life: 3000 });
      }
    });
  }

  deleteItem(id: string) {
    this.classstructures.deleteClassstructure(id).subscribe({
      next: (response) => {
        console.log('API ตอบกลับสำเร็จ (ลบข้อมูล):', response);
        this.classStructure = this.classStructure.filter(s => s.ID !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'สำเร็จ',
          detail: 'ลบช่วงเวลาเรียบร้อยแล้ว',
          life: 3000
        });
        this.loadClassStructure(this.selectedGrade?.code, this.selectedRoom?.code);
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

  // --- ฟังก์ชันสำหรับ MeterGroup ---
  getStaffMeterData(): any[] {
    const colors = ['#F59E0B', '#677489', '#22C55E', '#84CC16', '#14B8A6', '#EAB308', '#EF4444', '#3B82F6', '#6366F1'];
    let colorIndex = 0;
    const staffSummaryMap = new Map<string, { label: string, unit: number, color: string }>();

    this.classStructureData.forEach(item => {
      // ตรวจสอบและรวมข้อมูลผู้สอนคนที่ 1
      if (item.STAFF1_ID && item.STAFF1_NAME) {
        const staffId = item.STAFF1_ID;
        if (!staffSummaryMap.has(staffId)) {
          staffSummaryMap.set(staffId, {
            label: item.STAFF1_NAME,
            unit: 0,
            color: colors[colorIndex++ % colors.length]
          });
        }
        staffSummaryMap.get(staffId)!.unit += Number(item.UNIT);
      }
      // ตรวจสอบและรวมข้อมูลผู้สอนคนที่ 2
      if (item.STAFF2_ID && item.STAFF2_NAME) {
        const staffId = item.STAFF2_ID;
        if (!staffSummaryMap.has(staffId)) {
          staffSummaryMap.set(staffId, {
            label: item.STAFF2_NAME,
            unit: 0,
            color: colors[colorIndex++ % colors.length]
          });
        }
        staffSummaryMap.get(staffId)!.unit += Number(item.UNIT);
      }
    });

    const staffSummaryArray = Array.from(staffSummaryMap.values());
    const totalUnits = this.getTotalUnits();

    return staffSummaryArray.map(item => ({
      ...item,
      value: totalUnits > 0 ? (item.unit / totalUnits) * 100 : 0
    }));
  }

  // component.ts
  // getDayClass(day: string): string {
  //   console.log(day)
  //   switch(day) {
  //     case 'MON': return 'bg-yellow-400 text-black';
  //     case 'TUE': return 'bg-pink-400 text-white';
  //     case 'WED': return 'bg-green-400 text-white';
  //     case 'THU': return 'bg-orange-400 text-white';
  //     case 'FRI': return 'bg-blue-400 text-white';
  //     case 'SAT': return 'bg-purple-400 text-white';
  //     case 'SUN': return 'bg-red-400 text-white';
  //     default: return 'text-white';
  //   }
  // }

  protected readonly environment = environment;
}
