import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// model
import { OfficerModel, OfficerreplaceModel } from './model/officer.model';

@Injectable({
  providedIn: 'root'
})
export class OfficerService {
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/officer/';
  private apiUrlrepalce = 'https://api-eduservice.yru.ac.th/satit/officer/officerreplace.php';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const username = 'admin';
    const password = '1234';
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json'
    });
  }

  /** 📌 ดึงข้อมูลเจ้าหน้าที่ทั้งหมด */
  getOfficers(): Observable<OfficerModel[]> {
    return this.http.get<OfficerModel[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /** 📌 เพิ่มเจ้าหน้าที่ใหม่ */
  addOfficer(officer: Partial<OfficerModel>): Observable<{ message: string; status: string; data: OfficerModel }> {
    return this.http.post<{ message: string; status: string; data: OfficerModel }>(this.apiUrl, officer, {
      headers: this.getAuthHeaders()
    });
  }

  addOfficerreplce(officer: Partial<OfficerreplaceModel>): Observable<{ message: string; status: string; data: OfficerModel }> {
    return this.http.post<{ message: string; status: string; data: OfficerModel }>(this.apiUrlrepalce, officer, {
      headers: this.getAuthHeaders()
    });
  }

  /** 📌 อัปเดตข้อมูลเจ้าหน้าที่ */
  updateOfficer(officerId: string, data: Partial<OfficerModel>): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${officerId}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  /** 📌 ลบเจ้าหน้าที่ */
  deleteOfficer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
