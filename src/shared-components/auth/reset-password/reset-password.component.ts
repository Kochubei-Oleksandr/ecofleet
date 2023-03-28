import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AuthService, NotificationService} from "rushapp-angular-core";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordFormGroup: FormGroup;
  public isResetPasswordRequestCompleted: boolean = true;

  public constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) private matDialogData: any,
  ) { }

  public ngOnInit(): void {
    this.createResetPasswordForm();
  }
  public resetPasswordHandle(): void {
    this.isResetPasswordRequestCompleted = false;
    this.authService.passwordResetRequest(this.resetPasswordFormGroup.value).subscribe(
      (res) => {
        this.dialog.closeAll();
        this.isResetPasswordRequestCompleted = true;
        this.notificationService.success(res.message, 3000, true);
      },
      () => { this.isResetPasswordRequestCompleted = true; }
    );
  }
  private createResetPasswordForm(): void {
    this.resetPasswordFormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }
}
