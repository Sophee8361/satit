import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../auth.service";
import {authConfig} from '../../auth.config';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [],
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }


    yruPassport() {
        window.location.href = `${authConfig.authorizeEndpoint}?client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}&response_type=code&scope=*`;
    }

}
