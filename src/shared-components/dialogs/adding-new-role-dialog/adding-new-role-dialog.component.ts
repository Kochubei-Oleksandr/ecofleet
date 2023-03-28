import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../../shared/services/components/http-requests/admins/roles.service";

@Component({
  selector: 'app-adding-new-role-dialog',
  templateUrl: './adding-new-role-dialog.component.html',
  styleUrls: ['./adding-new-role-dialog.component.scss'],
})
export class AddingNewRoleDialogComponent implements OnInit {
  public roleFormGroup: FormGroup;

  public constructor(
    public serverValidationForm: ServerValidationFormService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddingNewRoleDialogComponent>,
    private roleService: RoleService,
    private notificationService: NotificationService,
  ) { }

  public ngOnInit(): void {
    this.createRoleForm();
  }
  public addNewRole(): void {
    this.roleService.store(this.roleFormGroup.value).subscribe(
      () => {
        this.notificationService.success('DATA_HAS_BEEN_SAVED', 3000, true)
        this.dialogRef.close(true);
      },
      (error: any) => {
        if (error.status === 422) {
          this.serverValidationForm.showErrors(error.error.errors, this.roleFormGroup.controls);
        }
      }
    );
  }
  public isRequestCompleted(): boolean {
    return this.roleService.getIsStoreRequestCompleted();
  }

  private createRoleForm(): void {
    this.roleFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      is_registration_role: ['', [Validators.required]],
      description: ['', [Validators.maxLength(255)]],
    });
  }
}
