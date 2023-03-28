import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Role} from "../../../shared/models/components/admins/role.class";
import {UserManagementService} from "../../../shared/services/components/http-requests/admins/user-management.service";
import {RoleService} from "../../../shared/services/components/http-requests/admins/roles.service";

@Component({
  selector: 'app-adding-new-user-dialog',
  templateUrl: './adding-new-user-dialog.component.html',
  styleUrls: ['./adding-new-user-dialog.component.scss'],
})
export class AddingNewUserDialogComponent implements OnInit {
  public userFormGroup: FormGroup;
  public roles: Role[];

  public constructor(
      @Inject(MAT_DIALOG_DATA) public matDialogData: any,
      public serverValidationForm: ServerValidationFormService,
      private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<AddingNewUserDialogComponent>,
      private userManagementService: UserManagementService,
      private roleService: RoleService,
      private notificationService: NotificationService,
  ) { }

  public ngOnInit(): void {
    this.createUserForm();
    this.getRoles();
  }

  public getSelectTriggerRoleName(): string {
    return this.userFormGroup.get('user_roles_ids').value.length !== 0
      ? this.roles.find(role => role.id === this.userFormGroup.get('user_roles_ids').value[0]).name
      : '';
  }
  public addNewUser(): void {
    this.userManagementService.store(this.userFormGroup.value).subscribe(
      () => {
        this.notificationService.success('DATA_HAS_BEEN_SAVED', 3000, true)
        this.dialogRef.close(true);
      },
      (error: any) => {
        if (error.status === 422) {
          this.serverValidationForm.showErrors(error.error.errors, this.userFormGroup.controls);
        }
      }
    );
  }
  public isRequestCompleted(): boolean {
    return this.userManagementService.getIsStoreRequestCompleted();
  }
  private createUserForm(): void {
    this.userFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required]],
      password_confirmation: [''],
      user_roles_ids: ['', [Validators.required]],
    }, {validator: [this.checkPasswords]});
  }
  private checkPasswords(group: FormGroup): void {
    const pass = group.controls['password'];
    const confirmPass = group.controls['password_confirmation'];

    pass.value === confirmPass.value
      ? confirmPass.setErrors(null)
      : confirmPass.setErrors({ notSame: true });
  }
  private getRoles(): void {
    this.roleService.index().subscribe((res: Role[]) => {
      this.roles = res;
    })
  }
}
