import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AuthService, NotificationService, ServerValidationFormService} from "rushapp-angular-core";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changePassportForm: FormGroup;
  public isChangePasswordRequestCompleted = true;

  public constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog,
    public serverValidationForm: ServerValidationFormService,
  ) {
  }

  public ngOnInit(): void {
    this.createChangePasswordForm();
  }
  public changePasswordBtnHandle(): void {
    this.isChangePasswordRequestCompleted = false;
    this.authService.changePassword(this.changePassportForm.value).subscribe(
      () => {
        this.dialog.closeAll();
        this.isChangePasswordRequestCompleted = true;
        this.notificationService.success('YOUR_PASSWORD_HAS_BEEN_SUCCESSFULLY_CHANGED', 3000, true);
      },
      (res) => {
        this.isChangePasswordRequestCompleted = true;
        if (res.status === 422) {
          this.serverValidationForm.showErrors(res.error.errors, this.changePassportForm.controls);
        }
      }
    );
  }
  private createChangePasswordForm(): void {
    this.changePassportForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: [''],
    }, {validator: [this.checkPasswords]});
  }
  private checkPasswords(group: FormGroup): void {
    const pass = group.controls['password'];
    const confirmPass = group.controls['password_confirmation'];

    pass.value === confirmPass.value
      ? confirmPass.setErrors(null)
      : confirmPass.setErrors({ notSame: true });
  }
}
