import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassStructure, Schedule } from './model/classtime.model'; // Import SlotModel interface
import { SlotModel } from './slot.model'

@Injectable({
  providedIn: 'root' // กำหนดให้ Service นี้สามารถ Inject ได้ทั่วทั้งแอปพลิเคชัน
})
export class ClasstimeService  {
  // กำหนด Base URL สำหรับ API ของ Time Service
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/classstructure.php';
  private apiUrlclasstime = 'https://api-eduservice.yru.ac.th/satit/time/classtime.php';

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



  getclassTime(): Observable<ClassStructure[]> {
    return this.http.get<ClassStructure[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }


  adclassTime(schedule: Partial<Schedule>): Observable<{ message: string; status: string; data: Schedule }> {
    return this.http.post<{ message: string; status: string; data: Schedule }>(this.apiUrlclasstime, schedule, {
      headers: this.getAuthHeaders()
    });
  }

  // delete
  deleteClasstime(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlclasstime}?id=${id}`, {
      headers: this.getAuthHeaders()
    });
  }


}
