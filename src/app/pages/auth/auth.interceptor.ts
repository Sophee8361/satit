import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthLocalStorageService} from "./auth-local-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor
  (
    private authLocalStorageService: AuthLocalStorageService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.authLocalStorageService.getLocalStorage;
    if (auth) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${auth.sanctum_token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}

