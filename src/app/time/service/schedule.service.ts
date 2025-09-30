import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../../environments/environment";
import { TeachingSchedule } from './model/classtime.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/time/schedule.php';
  constructor(private http: HttpClient) {}

  getSchedule(params: { year?: string, term?: string, class?: string, room?: string }): Observable<TeachingSchedule[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    });

    // ส่ง parameter ผ่าน query string
    const query = new URLSearchParams();
    if (params.year) query.set('year', params.year);
    if (params.term) query.set('term', params.term);
    if (params.class) query.set('class', params.class);
    if (params.room) query.set('room', params.room);

    const url = `${this.apiUrl}?${query.toString()}`;
    return this.http.get<TeachingSchedule[]>(url, { headers });
  }
  getStaffSchedule(params: { year?: string, term?: string, teacherId?: string | null;   }): Observable<TeachingSchedule[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${environment.userApi.user}:${environment.userApi.pass}`),
      'Content-Type': 'application/json'
    });

    // ส่ง parameter ผ่าน query string
    const query = new URLSearchParams();
    if (params.year) query.set('year', params.year);
    if (params.term) query.set('term', params.term);
    if (params.teacherId) query.set('teacherId', params.teacherId);
    const url = `${this.apiUrl}?${query.toString()}`;
    return this.http.get<TeachingSchedule[]>(url, { headers });
  }

}
