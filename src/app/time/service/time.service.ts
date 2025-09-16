import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SlotModel } from '../service/slot.model'; // Import SlotModel interface

@Injectable({
  providedIn: 'root' // กำหนดให้ Service นี้สามารถ Inject ได้ทั่วทั้งแอปพลิเคชัน
})
export class TimeService {
  // กำหนด Base URL สำหรับ API ของ Time Service
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/time.php';
  // private apiUrl = 'https://api-eduservice.yru.ac.th/satit/times/index.php'; // อีก URL ที่อาจใช้ได้ (คอมเมนต์ไว้)

  // getAuthHeaders: ฟังก์ชันสำหรับสร้าง HTTP Headers พร้อม Basic Authentication
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

  // addSlot: เมธอดสำหรับเพิ่มข้อมูล Slot ใหม่
  // รับ SlotModel บางส่วนเป็น Input และส่งเป็น POST request
  // คืนค่าเป็น Observable ที่มี Message, Status และ Data ของ Slot ที่เพิ่ม
  addSlot(slot: Partial<SlotModel>): Observable<{ message: string; status: string; data: SlotModel }> {
    return this.http.post<{ message: string; status: string; data: SlotModel }>(this.apiUrl, slot, {
      headers: this.getAuthHeaders()
    });
  }

  // addStaffbycourse: เมธอดสำหรับดึงข้อมูล SlotModel[] (ชื่อเมธอดอาจจะสื่อถึงการเพิ่ม Staff ให้ Course)
  // คืนค่าเป็น Observable ของ Array ของ SlotModel
  // หมายเหตุ: ชื่อเมธอดนี้อาจทำให้สับสน ควรเปลี่ยนเป็นชื่อที่สื่อความหมายชัดเจนกว่านี้ เช่น 'getStaffByCourse' หรือ 'getCourseStaff'

  addStaffbycourse(): Observable<SlotModel[]> {
    return this.http.get<SlotModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // deleteSlot: เมธอดสำหรับลบข้อมูล Slot
  // รับ id ของ Slot ที่ต้องการลบ และส่งเป็น DELETE request
  // ตัวอย่าง URL ที่จะถูกสร้าง: https://api-eduservice.yru.ac.th/satit/time/time.php?id=YOUR_TIMESLOT_ID
  deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
