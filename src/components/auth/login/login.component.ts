import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ROUTING_NAMES} from '../../../shared/constants/routing-names.const';
import {Router} from '@angular/router';
import {AuthService, SidenavService} from "rushapp-angular-core";
import {ResetPasswordComponent} from "../../../shared-components/auth/reset-password/reset-password.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public isLoginRequestCompleted = true;

  public constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dialog: MatDialog,
      private sidenavService: SidenavService,
  ) { }

  public ngOnInit(): void {
    this.createLoginForm();
  }
  public resetPasswordHandle(): void {
    this.dialog.open(ResetPasswordComponent, {
      width: '350px',
    });
  }
  public loginHandle(): void {
    this.isLoginRequestCompleted = false;
    this.authService.login(this.loginFormGroup.value).subscribe(
        () => {
          this.isLoginRequestCompleted = true;
          this.router.navigate([ROUTING_NAMES.my_account]);
          this.sidenavService.openSidenav();
        },
        () => { this.isLoginRequestCompleted = true; }
    );
  }
  private createLoginForm(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }
}
