import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../../shared/services/components/http-requests/admins/roles.service";
import {ConsultationService} from "../../../shared/services/components/http-requests/message.service";

@Component({
  selector: 'app-consultation-dialog',
  templateUrl: './consultation-dialog.component.html',
  styleUrls: ['./consultation-dialog.component.scss'],
})
export class ConsultationDialogComponent implements OnInit {
  public consultationFormGroup: FormGroup;
  public isRequestCompleted: boolean = true;

  public constructor(
    public serverValidationForm: ServerValidationFormService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ConsultationDialogComponent>,
    private consultationService: ConsultationService,
    private notificationService: NotificationService,
  ) { }

  public ngOnInit(): void {
    this.createConsultationForm();
  }
  public sendMessage(): void {
    this.isRequestCompleted = false;
    this.consultationService.sendMessage(this.consultationFormGroup.value).subscribe(
      () => {
        this.isRequestCompleted = true;
        this.notificationService.success('MESSAGE_HAS_BEEN_SENT', 3000, true)
        this.dialogRef.close(true);
      },
      (error: any) => {
        this.isRequestCompleted = true;
        if (error.status === 422) {
          this.serverValidationForm.showErrors(error.error.errors, this.consultationFormGroup.controls);
        }
      }
    );
  }

  private createConsultationForm(): void {
    this.consultationFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.required, Validators.maxLength(50)]],
      message: ['', [Validators.maxLength(255)]],
    });
  }
}
