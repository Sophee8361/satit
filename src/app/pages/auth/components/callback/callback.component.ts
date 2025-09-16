import {Component, OnInit} from '@angular/core';
import {AuthLocalStorageService} from "../../auth-local-storage.service";
import {AuthService} from "../../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  imports: [
    ProgressSpinner
  ],
  standalone: true,
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authLocalStorage: AuthLocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.authService.callbackYRUPassport(params['code']).subscribe({
        next: (res: any) => {

          console.log(res.userClient.permissions);

          // Set permissions in AuthService
          this.authService.setPermissions(res.userClient.permissions);

          this.authLocalStorage.setLocalStorage(res);
          this.authService.isAuthenticated.next(true);

          this.router.navigateByUrl('/pages/student/list');
        },
        error: (res) => console.log(res.error.error)
      });
    });
  }
}
