import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {NgOptimizedImage} from "@angular/common";
// MAIN_COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/auth/login/login.component';
import {ChangeForgottenPasswordComponent} from "../components/auth/change-forgotten-password/change-forgotten-password.component";
import {RegistrationComponent} from "../components/auth/registration/registration.component";
import {MyAccountComponent} from "../components/my-account/my-account.component";
import {UsersComponent} from "../components/settings/users-and-roles/users/users.component";
import {RolesComponent} from "../components/settings/users-and-roles/roles/roles.component";
import {UsersAndRolesComponent} from "../components/settings/users-and-roles/users-and-roles.component";
import {AccessLevelControlComponent} from "../components/settings/users-and-roles/access-level-control/access-level-control.component";
import {AppThemeSettingsComponent} from "../components/settings/theme-settings/app-theme-settings.component";
// SHARED_SERVICES
import {I18nModule} from "../shared/ssr-services/i18n/i18n.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HeaderRequestInterceptor, PaginatorTranslationsService, TokenInterceptor} from "rushapp-angular-core";
// SHARED_COMPONENTS
import {CookiesPanelComponent} from "../shared-components/cookies-panel/cookies-panel.component";
import {LanguageSwitchingComponent} from "../shared-components/language-switching/language-switching.component";
import {ProgressSpinnerComponent} from "../shared-components/progress-spinner/progress-spinner.component";
import {AlertDialogComponent} from "../shared-components/dialogs/alert-dialog/alert-dialog.component";
import {ChangePasswordComponent} from "../shared-components/auth/change-password/change-password.component";
import {PdfModalDialogComponent} from "../shared-components/dialogs/pdf-modal-dialog/pdf-modal-dialog.component";
import {MenuListItemComponent} from "../shared-components/menu-list-item/menu-list-item.component";
import {MatToolbarComponent} from "../shared-components/mat-toolbar/mat-toolbar.component";
import {CUSTOM_DATE_FORMAT} from "../shared/constants/custom-date-format.const";
import {AddingNewRoleDialogComponent} from "../shared-components/dialogs/adding-new-role-dialog/adding-new-role-dialog.component";
import {AddingNewUserDialogComponent} from "../shared-components/dialogs/adding-new-user-dialog/adding-new-user-dialog.component";
import {ConsultationDialogComponent} from "../shared-components/dialogs/consultation-dialog/consultation-dialog.component";
import {ResetPasswordComponent} from "../shared-components/auth/reset-password/reset-password.component";
//ANGULAR_MATERIAL
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {MatTreeModule} from "@angular/material/tree";
import {MatBadgeModule} from '@angular/material/badge';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatChipsModule} from "@angular/material/chips";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from "@angular/material/list";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTabsModule} from "@angular/material/tabs";
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
// landing modules
import {LandingComponent} from "../components/landing/landing.component";

const LANDING_MODULES = [
  LandingComponent
];
const MAIN_COMPONENTS = [
  AppComponent,
  LoginComponent,
  RegistrationComponent,
  ChangeForgottenPasswordComponent,
  MyAccountComponent,
  RolesComponent,
  UsersComponent,
  AccessLevelControlComponent,
  UsersAndRolesComponent,
  AppThemeSettingsComponent
];
const SHARED_COMPONENTS = [
  CookiesPanelComponent,
  LanguageSwitchingComponent,
  ProgressSpinnerComponent,
  AlertDialogComponent,
  ChangePasswordComponent,
  ResetPasswordComponent,
  PdfModalDialogComponent,
  MenuListItemComponent,
  MatToolbarComponent,
  AddingNewRoleDialogComponent,
  AddingNewUserDialogComponent,
  ConsultationDialogComponent
];
const SHARED_SERVICES = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderRequestInterceptor,
    multi : true
  },
  MatDatepickerModule,
];
const ANGULAR_MATERIAL_MODULES = [
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatCardModule,
  MatTooltipModule,
  MatRadioModule,
  MatSnackBarModule,
  MatTableModule,
  MatTreeModule,
  MatBadgeModule,
  MatToolbarModule,
  MatChipsModule,
  MatSidenavModule,
  MatListModule,
  MatSortModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatTabsModule
];

@NgModule({

  declarations: [
    LANDING_MODULES,
    MAIN_COMPONENTS,
    SHARED_COMPONENTS,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    ...ANGULAR_MATERIAL_MODULES,
    NgxMatColorPickerModule,
    NgOptimizedImage,
  ],
  providers: [
    {provide: 'defaultLanguage', useValue: environment.defaultLanguage},
    {provide: 'languages', useValue: environment.languages},
    {provide: 'apiEndpoint', useValue: environment.apiEndpoint},
    {provide: 'metaTagImage', useValue: environment.metaTagImage},
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorTranslationsService(translateService).getPaginatorIntl()
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
    ...SHARED_SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
