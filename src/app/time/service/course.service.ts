import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCourse } from './slot.model'

@Injectable({
  providedIn: 'root' // กำหนดให้ Service นี้สามารถ Inject ได้ทั่วทั้งแอปพลิเคชัน
})
export class CourseService {
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/course.php';

  private getAuthHeaders(): HttpHeaders {
    const username = 'admin'; // <-- ชื่อผู้ใช้สำหรับ Basic Auth (ควรเปลี่ยนให้ปลอดภัยใน Production)
    const password = '1234'; // <-- รหัสผ่านสำหรับ Basic Auth (ควรเปลี่ยนให้ปลอดภัยใน Production)
    return new HttpHeaders({
      // เข้ารหัส username:password เป็น Base64 สำหรับ Basic Authentication
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json' // กำหนด Content-Type เป็น JSON
    });
  }
  constructor(private http: HttpClient) {}

  addCourse(course: Partial<ApiCourse>): Observable<{ message: string; status: string; data: ApiCourse }> {
    return this.http.post<{ message: string; status: string; data: ApiCourse }>(this.apiUrl, course, {
      headers: this.getAuthHeaders()
    });
  }

  updateCourse(courseId: string, data: Partial<ApiCourse>): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${courseId}`, data, {
      headers: this.getAuthHeaders()
    });
  }


  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
