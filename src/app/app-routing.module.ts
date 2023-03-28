import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ROUTING_NAMES} from '../shared/constants/routing-names.const';
import {LoginComponent} from "../components/auth/login/login.component";
import {AuthorizedGuard} from "../shared/guards/authorized.guard";
import {MyAccountComponent} from "../components/my-account/my-account.component";
import {UsersAndRolesComponent} from "../components/settings/users-and-roles/users-and-roles.component";
import {UsersComponent} from "../components/settings/users-and-roles/users/users.component";
import {RolesComponent} from "../components/settings/users-and-roles/roles/roles.component";
import {AccessLevelControlComponent} from "../components/settings/users-and-roles/access-level-control/access-level-control.component";
import {AuthGuard} from "rushapp-angular-core";
import {AppThemeSettingsComponent} from "../components/settings/theme-settings/app-theme-settings.component";
import {LandingComponent} from "../components/landing/landing.component";
import {RegistrationComponent} from "../components/auth/registration/registration.component";
import {
  ChangeForgottenPasswordComponent
} from "../components/auth/change-forgotten-password/change-forgotten-password.component";

const routes: Routes = [
  {
    path: ROUTING_NAMES.landing,
    canActivate: [AuthorizedGuard],
    component: LandingComponent,
  },
  {
    path: ROUTING_NAMES.login,
    canActivate: [AuthorizedGuard],
    component: LoginComponent,
  },
  {
    path: ROUTING_NAMES.registration,
    canActivate: [AuthorizedGuard],
    component: RegistrationComponent,
  },
  {
    path: ROUTING_NAMES.change_forgotten_password,
    canActivate: [AuthorizedGuard],
    component: ChangeForgottenPasswordComponent,
  },
  {
    path: ROUTING_NAMES.my_account,
    component: MyAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ROUTING_NAMES.fr_theme_settings,
    component: AppThemeSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ROUTING_NAMES.fr_users_and_roles,
    component: UsersAndRolesComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: ROUTING_NAMES.roles, pathMatch: 'full'},
      {path: ROUTING_NAMES.users, component: UsersComponent},
      {path: ROUTING_NAMES.roles, component: RolesComponent},
      {path: ROUTING_NAMES.access_level_control, component: AccessLevelControlComponent},
    ],
  },
  { path: '**', redirectTo: ROUTING_NAMES.landing }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
