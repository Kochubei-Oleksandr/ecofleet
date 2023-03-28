import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from "@angular/material/table";
import {AccessLevelControl} from "../../../../shared/models/components/admins/access-level-control.class";
import {AccessLevelControlService} from "../../../../shared/services/components/http-requests/admins/access-level-control.service";
import {Role} from "../../../../shared/models/components/admins/role.class";
import {RoleService} from "../../../../shared/services/components/http-requests/admins/roles.service";
import {NotificationService} from "rushapp-angular-core";

@Component({
  selector: 'app-access-level-control',
  templateUrl: './access-level-control.component.html',
  styleUrls: ['./access-level-control.component.scss']
})
export class AccessLevelControlComponent implements OnInit {
  public columnsToDisplay: string[] = ['route_name', 'index', 'show', 'store', 'update', 'destroy'];
  public tableDataSource: MatTableDataSource<AccessLevelControl>;
  public routesWithActionsFormGroup: FormGroup;
  public roles: Role[];
  public selectedRoleId: number;

  public constructor(
    private accessLevelControlService: AccessLevelControlService,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private notificationService: NotificationService,
  ) { }

  public ngOnInit(): void {
    this.initRoutesWithActionsFormGroup();
    this.getRoles();
  }

  public getRoutesWithActions(): void {
    if (this.selectedRoleId) {
      this.accessLevelControlService.index({
        role_id: this.selectedRoleId,
        with: 'action',
      }).subscribe((res: AccessLevelControl[]) => {
        this.getRoutesWithActionsArrayGroup().markAsPristine();
        this.getRoutesWithActionsArrayGroup().markAsUntouched();

        const resultData = this.setIsOwnerToAccessLevelControl(res)

        this.setTableDataSource(resultData);
        this.getRoutesWithActionsArrayGroup().patchValue(resultData);
      });
    }
  }
  public isDisableToggleForOwner(cellIndex: number, actionName: string): boolean {
    const valueFormGroup: any = this.getIterationControl(cellIndex).value;

    if (valueFormGroup[actionName]) {
      return !valueFormGroup[actionName].is_owner_key;
    }

    return true;
  }
  public statusToggleHandler(row: AccessLevelControl, actionName: string): void {
    //@ts-ignore
    const roleAction = row[actionName];

    roleAction
      ? this.destroyAccessLevelControl(roleAction.id)
      : this.storeAccessLevelControl(row.route_name+'.'+actionName);
  }
  public ownerToggleHandler(cellIndex: number, actionName: string, formControlName: string): void {
    const valueFormGroup: any = this.getIterationControl(cellIndex).value;
    this.accessLevelControlService.update(
      valueFormGroup[actionName].id, {is_owner: valueFormGroup[formControlName]}
    ).subscribe(
      () => {
        this.notificationService.success('DATA_HAS_BEEN_SAVED', 1500, true);
      },
      (error) => {
        this.notificationService.error('DATA_HASNT_BEEN_SAVED', 1500, true);
      }
    );
  }
  public getIterationControl(iterationIndex: number): AbstractControl {
    return this.getRoutesWithActionsArrayGroup().controls[iterationIndex];
  }

  private destroyAccessLevelControl(roleActionId: number): void {
    this.accessLevelControlService.destroy(roleActionId).subscribe(
      () => {
        this.getRoutesWithActions();
        this.notificationService.success('DATA_HAS_BEEN_DELETE_FOREVER', 3000, true);
      },
      () => {
        this.getRoutesWithActions();
        this.notificationService.error('DATA_HASNT_BEEN_DELETE', 3000, true);
      }
    );
  }
  private storeAccessLevelControl(actionName: string): void {
    this.accessLevelControlService.store({
      action_name: actionName,
      role_id: this.selectedRoleId
    }).subscribe(
      () => {
        this.getRoutesWithActions();
        this.notificationService.success('DATA_HAS_BEEN_SAVED', 1500, true)
      },
      (error: any) => {
        this.getRoutesWithActions();
        this.notificationService.error('DATA_HASNT_BEEN_CHANGED', 1500, true)
      }
    );
  }
  private setIsOwnerToAccessLevelControl(accessLevelControl: AccessLevelControl[]): AccessLevelControl[] {
    return  accessLevelControl.map((item: AccessLevelControl) => {
      this.addRoutesWithActionsArrayForm();

      if (item.index) {
        item['index_is_owner'] = item.index.is_owner;
      }
      if (item.show) {
        item['show_is_owner'] = item.show.is_owner;
      }
      if (item.store) {
        item['store_is_owner'] = item.store.is_owner;
      }
      if (item.update) {
        item['update_is_owner'] = item.update.is_owner;
      }
      if (item.destroy) {
        item['destroy_is_owner'] = item.destroy.is_owner;
      }

      return item;
    });
  }
  public isRequestCompleted(): boolean {
    return this.accessLevelControlService.getIsIndexRequestCompleted()
      && this.accessLevelControlService.getIsStoreRequestCompleted()
      && this.roleService.getIsIndexRequestCompleted();
  }


  private getRoles(): void {
    this.roleService.index().subscribe((res: Role[]) => {
      this.roles = res;
      if (res.length > 0) {
        this.selectedRoleId = res[0]['id'];
        this.getRoutesWithActions();
      }
    })
  }
  private setTableDataSource(tableData: AccessLevelControl[]): void {
    this.tableDataSource = new MatTableDataSource(tableData);
    this.tableDataSource.filterPredicate = (data: AccessLevelControl, filter: string) => data.route_name.indexOf(filter) !== -1;
  }
  private addRoutesWithActionsArrayForm(): void {
    this.getRoutesWithActionsArrayGroup().push(this.initRoutesWithActionsArrayForm());
  }
  private initRoutesWithActionsArrayForm(): FormGroup {
    return this.formBuilder.group({
      route_name: [''],
      index: [''],
      index_is_owner: [''],
      show: [''],
      show_is_owner: [''],
      store: [''],
      store_is_owner: [''],
      update: [''],
      update_is_owner: [''],
      destroy: [''],
      destroy_is_owner: [''],
    });
  }
  private getRoutesWithActionsArrayGroup(): FormArray {
    return this.routesWithActionsFormGroup.controls['routes_with_actions'] as FormArray;
  }
  private initRoutesWithActionsFormGroup(): void {
    this.routesWithActionsFormGroup = this.formBuilder.group({
      routes_with_actions: this.formBuilder.array([])
    });
  }
}
