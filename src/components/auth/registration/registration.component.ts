import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ROUTING_NAMES} from '../../../shared/constants/routing-names.const';
import {Router} from '@angular/router';
import {AuthService, ServerValidationFormService, SidenavService} from "rushapp-angular-core";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationFormGroup: FormGroup;
  public isRegistrationRequestCompleted = true;

  public constructor(
      public serverValidationForm: ServerValidationFormService,
      private router: Router,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private dialog: MatDialog,
      private sidenavService: SidenavService,
  ) { }

  public ngOnInit(): void {
    this.createRegistrationForm();
  }
  public registrationHandle(): void {
    this.isRegistrationRequestCompleted = false;
    this.authService.register(this.registrationFormGroup.value).subscribe(
        () => {
          this.isRegistrationRequestCompleted = true;
          this.router.navigate([ROUTING_NAMES.my_account]);
          this.sidenavService.openSidenav();
        },
        () => { this.isRegistrationRequestCompleted = true; }
    );
  }
  private createRegistrationForm(): void {
    this.registrationFormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: [''],
      usage_policy: [false, [Validators.requiredTrue]],
    }, {validator: [this.checkPasswords, this.checkUsagePolicy]});
  }
  private checkPasswords(group: FormGroup): void {
    const pass = group.controls['password'];
    const confirmPass = group.controls['password_confirmation'];

    pass.value === confirmPass.value
      ? confirmPass.setErrors(null)
      : confirmPass.setErrors({ notSame: true });
  }
  private checkUsagePolicy(group: FormGroup): void {
    const usagePolicy = group.controls['usage_policy'];

    usagePolicy.value
      ? usagePolicy.setErrors(null)
      : usagePolicy.setErrors({ notUsagePolicy: true });
  }
}
