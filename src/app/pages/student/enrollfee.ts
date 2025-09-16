import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, JsonPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-enrollfee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    JsonPipe,
    DecimalPipe,
    ToolbarModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    InputIconModule,
    SplitButtonModule,
    NgIf,
    NgFor
  ],
  template: `
    <div class="card p-6 shadow-xl rounded-2xl flex flex-col space-y-4">
      <p-toast></p-toast>
      <div class="font-bold text-2xl mb-6 text-gray-900">ตรวจสอบภาระหนี้</div>

      <p-toolbar class="mb-6 rounded-lg border-2 border-gray-200 p-4">
        <ng-template pTemplate="start">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="equal-width">
              <input type="text" pInputText placeholder="ป้อนรหัส..." class="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200" [(ngModel)]="searchTerm" />
            </div>
            <div>
              <p-button label="ค้นหา" icon="pi pi-search" (click)="onSearch()" [rounded]="true" class="p-button-primary shadow-md"></p-button>
            </div>
          </div>
        </ng-template>
      </p-toolbar>

      <div *ngIf="showTable" class="mt-8">
        <div class="p-6 border-2 border-blue-200 rounded-xl bg-blue-50 text-gray-800 shadow-md">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>รหัสนักเรียน: <strong>{{ selectedProduct?.STUDENTCODE || '-' }}</strong></p>
            <p>ชื่อนามสกุล: <strong>{{ selectedProduct?.NAME || '-' }}</strong></p>
            <p>ระดับ: <strong>{{ selectedProduct?.PROGRAMNAME || '-' }}</strong></p>
            <p>สถานะ: <strong [ngClass]="{'text-red-600 font-bold': selectedProduct?.STUDENTSTATUS !== '10', 'text-green-600 font-bold': selectedProduct?.STUDENTSTATUS === '10'}">{{ selectedProduct?.ST || '-' }}</strong></p>
            <p>สถานะการเงิน: <strong [ngClass]="{'text-red-600 font-bold': selectedProduct?.FN === 'D', 'text-green-600 font-bold': selectedProduct?.FN === 'N'}">{{ selectedProduct?.FINANCESTATUS || '-' }}</strong></p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="font-semibold text-xl mb-4 text-gray-800">รายละเอียดค่าธรรมเนียมการลงทะเบียน</h3>
          <p-table [value]="selectedProduct?.ENROLLFEE || []" [tableStyle]="{ 'min-width': '50rem' }" styleClass="p-datatable-gridlines p-datatable-striped">
            <ng-template pTemplate="header">
              <tr>
                <th class="bg-gray-100 font-bold text-gray-700 text-center px-4 py-3 rounded-tl-lg">ปีการศึกษา</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-center px-4 py-3">ภาคเรียน</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-right px-4 py-3">ยอดเงิน</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-right px-4 py-3">ยอดค้างชำระ</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-center px-4 py-3 rounded-tr-lg" style="width: 8rem;">ดำเนินการ</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-enrollfee>
              <tr>
                <td class="text-center px-4 py-3">{{ enrollfee.ACADYEAR }}</td>
                <td class="text-center px-4 py-3">{{ enrollfee.SEMESTER }}</td>
                <td class="text-right px-4 py-3">{{ enrollfee.AM | number }}</td>
                <td class="text-right px-4 py-3">{{ enrollfee.BL | number }}</td>
                <td class="text-center px-4 py-3">
                  <p-button icon="pi pi-search" [raised]="true" (click)="viewDetails(enrollfee)" severity="info" rounded *ngIf="enrollfee.BL > 0" class="p-button-sm shadow-sm"></p-button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="footer">
              <tr>
                <td colspan="2" class="text-center px-4 py-3 font-bold">รวม</td>
                <td class="text-right px-4 py-3 font-bold">{{ totalEnrollfeeAmount | number }}</td>
                <td class="text-right px-4 py-3 font-bold">{{ totalEnrollfeeBalance | number }}</td>
                <td></td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center py-4">ไม่มีข้อมูลค่าธรรมเนียม</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <p-dialog header="รายละเอียดค่าธรรมเนียม" [(visible)]="showFeeDetailsDialog" [modal]="true" [style]="{ width: '50vw' }" [draggable]="false" [resizable]="false" styleClass="rounded-lg shadow-2xl">
        <div *ngIf="selectedFeeDetail" class="p-4">
          <h4 class="font-semibold text-xl mb-4 text-gray-800">ปีการศึกษา: {{ selectedFeeDetail.ACADYEAR }} ภาคเรียน: {{ selectedFeeDetail.SEMESTER }}</h4>
          <p-table [value]="selectedFeeDetail.FEEITEM || []" [tableStyle]="{ 'min-width': '40rem' }" styleClass="p-datatable-gridlines p-datatable-striped">
            <ng-template pTemplate="header">
              <tr>
                <th class="bg-gray-100 font-bold text-gray-700 text-center px-4 py-3 rounded-tl-lg">ชื่อรายการ</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-right px-4 py-3">ยอดเงิน</th>
                <th class="bg-gray-100 font-bold text-gray-700 text-right px-4 py-3 rounded-tr-lg">ยอดค้างชำระ</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td class="px-4 py-3">{{ item.FEEIDNAME }}</td>
                <td class="text-right px-4 py-3">{{ item.AMOUNT | number }}</td>
                <td class="text-right px-4 py-3">{{ item.BALANCE | number }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="footer">
              <tr>
                <td class="text-right px-4 py-3 font-bold">รวม</td>
                <td class="text-right px-4 py-3 font-bold">{{ totalFeeItemAmount | number }}</td>
                <td class="text-right px-4 py-3 font-bold">{{ totalFeeItemBalance | number }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="3" class="text-center py-4">ไม่พบข้อมูลค่าธรรมเนียมย่อย</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
        <ng-template pTemplate="footer">
          <p-button icon="pi pi-times" (click)="showFeeDetailsDialog = false" label="ปิด" styleClass="p-button-text p-button-sm"></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .equal-width { width: 200px; }
    @media (max-width: 768px) { .equal-width { width: 100%; } }
  `],
  providers: [MessageService]
})
export class EnrollfeeComponent {
  products: any[] = [];
  searchTerm: string = '';
  showTable = false;
  showDialog = false;
  showFeeDetailsDialog = false;
  selectedProduct: any = null;
  selectedFeeDetail: any = null;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  onSearch() {
    if (!this.searchTerm) {
      this.messageService.add({ severity: 'warn', summary: 'คำเตือน', detail: 'กรุณาป้อนรหัสนักเรียน', life: 3000 });
      this.products = [];
      this.showTable = false;
      return;
    }

    const apiUrl = `https://api-eduservice.yru.ac.th/satit/enrollfee/?id=${this.searchTerm}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        if (data && Object.keys(data).length > 0) {
          this.products = Array.isArray(data) ? data : [data];
          this.showTable = true;
          this.selectedProduct = this.products.length > 0 ? this.products[0] : null;
        } else {
          this.products = [];
          this.showTable = true;
          this.selectedProduct = null;
          this.messageService.add({ severity: 'info', summary: 'ไม่พบข้อมูล', detail: `ไม่พบข้อมูลสำหรับรหัส: ${this.searchTerm}`, life: 3000 });
        }
      },
      error: () => {
        this.products = [];
        this.showTable = true;
        this.selectedProduct = null;
        this.messageService.add({ severity: 'error', summary: 'ข้อผิดพลาด', detail: 'ไม่สามารถดึงข้อมูลได้', life: 3000 });
      }
    });
  }

  viewDetails(fee: any) {
    this.selectedFeeDetail = fee;
    this.showFeeDetailsDialog = true;
  }

  get totalFeeItemAmount(): number {
    return Array.isArray(this.selectedFeeDetail?.FEEITEM)
      ? this.selectedFeeDetail.FEEITEM.reduce((sum: number, item: { AMOUNT: number }) => sum + item.AMOUNT, 0)
      : 0;
  }

  get totalFeeItemBalance(): number {
    return Array.isArray(this.selectedFeeDetail?.FEEITEM)
      ? this.selectedFeeDetail.FEEITEM.reduce((sum: number, item: { BALANCE: number }) => sum + item.BALANCE, 0)
      : 0;
  }

  get totalEnrollfeeAmount(): number {
    return Array.isArray(this.selectedProduct?.ENROLLFEE)
      ? this.selectedProduct.ENROLLFEE.reduce((sum: number, fee: { AM: number }) => sum + fee.AM, 0)
      : 0;
  }

  get totalEnrollfeeBalance(): number {
    return Array.isArray(this.selectedProduct?.ENROLLFEE)
      ? this.selectedProduct.ENROLLFEE.reduce((sum: number, fee: { BL: number }) => sum + fee.BL, 0)
      : 0;
  }

}
