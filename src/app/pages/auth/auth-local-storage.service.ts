import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AuthLocalStorageService {
    constructor() {
    }

    // Getter for username from localStorage
    get getUsername(): string | null {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null; // ตรวจสอบก่อนว่า `userData` เป็น `null` หรือไม่
        return user?.username || null; // ถ้าไม่พบ username ให้คืนค่า `null`
    }


    // Getter for the auth-related items in localStorage
    get getLocalStorage(): { sanctum_token: string; passport_token: string; auth: any; } {
        const authData = localStorage.getItem("auth");

        // ตรวจสอบว่า authData ไม่ใช่ null ก่อนทำการ JSON.parse
        const auth = authData ? JSON.parse(authData) : null;

        // ตรวจสอบค่า sanctum_token และ passport_token ก่อนที่จะคืนค่า
        if (auth && typeof auth.sanctum_token === 'string' && typeof auth.passport_token?.access_token === 'string') {
            return {
                sanctum_token: auth.sanctum_token,
                passport_token: auth.passport_token.access_token,
                auth: auth
            };
        }

        // คืนค่า empty value ถ้าไม่พบข้อมูลที่ถูกต้อง
        return {
            sanctum_token: '',
            passport_token: '',
            auth: null
        };
    }

    // Method to store authentication data in localStorage
    setLocalStorage(res: any): boolean {
        if (res?.sanctum_token && typeof res.sanctum_token === 'string') {
            // Ensure sanctum_token is a string before saving
            localStorage.setItem("auth", JSON.stringify(res));
            return true;
        }
        console.error("Invalid data: sanctum_token is missing or not a string");
        return false; // Return false if invalid data
    }

    // Method to clear authentication data from localStorage
    clearLocalStorage(): boolean {
        localStorage.removeItem("auth");
        return true;
    }

}
