import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassStructure, Schedule } from './model/classtime.model'; // Import SlotModel interface
import { SlotModel } from './slot.model'
@Injectable({
  providedIn: 'root' // กำหนดให้ Service นี้สามารถ Inject ได้ทั่วทั้งแอปพลิเคชัน
})

export class SlotService {
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/slot.php';

  private getAuthHeaders(): HttpHeaders {
    const username = 'admin'; // <-- ชื่อผู้ใช้สำหรับ Basic Auth (ควรเปลี่ยนให้ปลอดภัยใน Production)
    const password = '1234'; // <-- รหัสผ่านสำหรับ Basic Auth (ควรเปลี่ยนให้ปลอดภัยใน Production)
    return new HttpHeaders({
      // เข้ารหัส username:password เป็น Base64 สำหรับ Basic Authentication
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json' // กำหนด Content-Type เป็น JSON
    });
  }
  // Constructor: Inject HttpClient เพื่อใช้ในการเรียก API
  constructor(private http: HttpClient) {}

  // getSlot: เมธอดสำหรับดึงข้อมูล Slot ทั้งหมด
  // คืนค่าเป็น Observable ของ Array ของ SlotModel
  getSlot(): Observable<SlotModel[]> {
    return this.http.get<SlotModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addSlot(slot: Partial<SlotModel>): Observable<{ message: string; status: string; data: SlotModel }> {
    return this.http.post<{ message: string; status: string; data: SlotModel }>(this.apiUrl, slot, {
      headers: this.getAuthHeaders()
    });
  }

  // slot.service.ts
  updateSlot(id: string, slot: SlotModel): Observable<{ message: string; status: string; data: SlotModel }> {
    return this.http.put<{ message: string; status: string; data: SlotModel }>(
      `${this.apiUrl}?id=${id}`,
      slot,
      { headers: this.getAuthHeaders() }
    );
  }



  deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
