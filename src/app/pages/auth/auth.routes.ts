import {LoginComponent} from "./components/login/login.component";
import {CallbackComponent} from "./components/callback/callback.component";
import {Routes} from '@angular/router';

export default [
  {
    path: 'auth',
    redirectTo: 'login',
    pathMatch: "full",
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: "**",
    component: LoginComponent,
  }
] as Routes;
