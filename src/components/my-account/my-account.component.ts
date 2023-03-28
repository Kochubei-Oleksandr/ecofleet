import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AuthService,
  BrowserLocalStorageService,
  ServerValidationFormService,
  SidenavService
} from "rushapp-angular-core";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../shared/services/components/http-requests/user.service";
import {User} from "../../shared/models/components/user.class";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordComponent} from "../../shared-components/auth/change-password/change-password.component";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  public personalForm: FormGroup;
  public userData: User;

  public constructor(
      public serverValidationForm: ServerValidationFormService,
      private dialog: MatDialog,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private authService: AuthService,
      private translateService: TranslateService,
      private sidenavService: SidenavService,
      private browserLocalStorage: BrowserLocalStorageService
  ) { }

  public ngOnInit(): void {
    this.createPersonalForm();
    this.getUserData();
  }
  public isUserServiceUpdateRequestCompleted(): boolean {
    return this.userService.getIsUpdateRequestCompleted();
  }
  public updateUserData(): void {
    if (this.personalForm.valid) {
      this.userService.updatePersonalData(this.personalForm.value).subscribe(
          (res: User) => {
            this.personalForm.markAsPristine();
            this.personalForm.markAsUntouched();
            this.userData = res;
            this.userService.setIsPersonalDataUpdated(true);
          },
          (res) => {
            if (res.status === 422) {
              this.serverValidationForm.showErrors(res.error.errors, this.personalForm.controls);
            }
          }
      );
    }
  }
  public openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '350px'
    });
  }
  private createPersonalForm(): void {
    this.personalForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
    });
  }
  private getUserData(): void {
    this.userService.getPersonalData().subscribe((res: User) => {
      this.personalForm.patchValue(res);
      this.userData = res;
    });
  }
}
