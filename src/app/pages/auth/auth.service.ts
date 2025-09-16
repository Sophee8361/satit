import {Injectable} from '@angular/core';
import {AuthLocalStorageService} from "./auth-local-storage.service";
import {BehaviorSubject, map} from 'rxjs';
import {authConfig} from "./auth.config";
import {NgxPermissionsService} from "ngx-permissions";
import { ApiBaseService } from '../../../../../services/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // สร้าง BehaviorSubject ที่ใช้ในการตรวจสอบสถานะการล็อกอิน
  isAuthenticated = new BehaviorSubject<boolean>(false);
  private url = '/auth';

  constructor(
    private api: ApiBaseService,
    private permissionsService: NgxPermissionsService,
    private authLocalStorage: AuthLocalStorageService
  ) {
    this.isAuthenticated.next(this.checkAuthentication());
  }

  // ฟังก์ชันสำหรับตรวจสอบการล็อกอินจาก localStorage
  private checkAuthentication(): boolean {
    const auth = this.authLocalStorage.getLocalStorage;
    return !!auth.passport_token;  // ถ้ามี passport_token แสดงว่าผู้ใช้ล็อกอิน
  }

  callbackYRUPassport(code: any) {
    return this.api.get(`${this.url}/callback?code=${code}`).pipe(map((res) => res));
  }

  logout() {
    this.isAuthenticated.next(false);
    this.authLocalStorage.clearLocalStorage(); // ล้างข้อมูล
    this.clearPermissions();
    this.logout_resApi();
    window.location.href = `${authConfig.logoutEndpoint}`; // redirect ออกไป
  }

  logout_resApi() {
    return this.api.post(`${this.url}/auth/logout`).pipe(map((res) => res));
  }

  // เพิ่มสิทธิ์ตามข้อมูลผู้ใช้
  setPermissions(permissions: string[]) {
    this.permissionsService.loadPermissions(permissions);
  }

  // ลบสิทธิ์ทั้งหมด
  clearPermissions() {
    this.permissionsService.flushPermissions();
  }


}
