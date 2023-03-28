import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {AddingNewRoleDialogComponent} from "../../../../shared-components/dialogs/adding-new-role-dialog/adding-new-role-dialog.component";
import {Role} from "../../../../shared/models/components/admins/role.class";
import {RoleService} from "../../../../shared/services/components/http-requests/admins/roles.service";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public columnsToDisplay: string[] = ['id', 'name', 'description', 'is_registration_role', 'actions'];
  public paginatorPageSizeOptions: number[] = [5, 10, 25, 50];
  public tableDataSource: MatTableDataSource<Role>;
  public paginatorPageIndex: number = 0;
  public paginatorPageSize: number = this.paginatorPageSizeOptions[0];
  public paginatorTotalCount: number;
  public filterByString: string = '';
  public sortColumn: string;
  public sortDirection: string;
  public rolesFormGroup: FormGroup;
  public executionIdentifierForSaveCurrentRequest: number[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public constructor(
    public serverValidationForm: ServerValidationFormService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.initRolesFormGroup();
    this.getRoles();
  }

  public sortRolesData(sort: Sort): void {
    if (this.getRolesArrayGroup().dirty) {
      if (confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))) {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
        this.getRoles();
      }
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
      this.getRoles();
    }
  }
  public paginateRolesData(event?: PageEvent): void {
    if (this.getRolesArrayGroup().dirty) {
      confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))
        ? this.getRoles(event)
        : this.paginatorPageIndex--;
    } else {
      this.getRoles(event);
    }
  }
  public getRoles(event?: PageEvent): void {
    this.roleService.indexPaginate({
      paginate: event ? event.pageSize : this.paginatorPageSize,
      page: event ? event.pageIndex + 1 : this.paginatorPageIndex,
      order_by_field: (this.sortColumn && this.sortDirection) ? (this.sortColumn+':'+this.sortDirection) : 'id:asc',
      where_like: 'name,description|'+this.filterByString,
    }).subscribe((res) => {
      this.getRolesArrayGroup().markAsPristine();
      this.getRolesArrayGroup().markAsUntouched();

      res.data.forEach(() => {
        this.addRolesArrayForm();
      })

      this.setTableDataSource(res.data);
      this.tableDataSource.sort = this.sort;

      this.getRolesArrayGroup().patchValue(res.data);

      this.paginatorPageIndex = res.current_page - 1;
      this.paginatorPageSize = res.per_page;
      this.paginatorTotalCount = res.total;
    })
  }
  public getIterationControl(iterationIndex: number): AbstractControl {
    return this.getRolesArrayGroup().controls[iterationIndex];
  }
  public isSaveItemRequestInProcess(executionIdentifier: number): boolean {
    return (this.executionIdentifierForSaveCurrentRequest.filter((item: number) => item === executionIdentifier)).length !== 0;
  }
  public isFormControlDataDirty(cellIndex: number): boolean {
    return this.getIterationControl(cellIndex).dirty;
  }
  public isRequestCompleted(): boolean {
    return this.roleService.getIsIndexPaginateRequestCompleted();
  }
  public openAddingNewRoleDialog(): void {
    const dialogRef = this.dialog.open(AddingNewRoleDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRoles();
      }
    });
  }
  public deleteRole(cellIndex: number): void {
    if (confirm(this.translateService.instant('DO_YOU_WANT_TO_DELETE_FOREVER?'))) {
      const currentFormGroup = this.getIterationControl(cellIndex);
      this.removeItemFromTableDataSource(cellIndex);
      this.getRolesArrayGroup().removeAt(cellIndex);
      this.roleService.destroy(currentFormGroup.value.id).subscribe(
        () => this.notificationService.success('DATA_HAS_BEEN_DELETE_FOREVER', 3000, true),
        () => this.getRoles()
      );
    }
  }
  public updateTableElement(cellIndex: number): void {
    const currentFormGroup: any = this.getIterationControl(cellIndex);
    if (currentFormGroup.valid) {
      if (currentFormGroup.dirty) {
        this.executionIdentifierForSaveCurrentRequest.push(cellIndex);
        this.getIterationControl(cellIndex).disable();
        this.roleService.update(currentFormGroup.value.id, currentFormGroup.value).subscribe(
          () => {
            this.executionIdentifierForSaveCurrentRequest = this.executionIdentifierForSaveCurrentRequest.filter(
              (item: number) => item !== cellIndex
            );
            this.getIterationControl(cellIndex).enable();
            currentFormGroup.markAsPristine();
            this.notificationService.success('DATA_HAS_BEEN_SAVED', 3000, true);
          },
          (error) => {
            this.getIterationControl(cellIndex).enable();
            this.executionIdentifierForSaveCurrentRequest = this.executionIdentifierForSaveCurrentRequest.filter(
              (item: number) => item !== cellIndex
            );
            if (error.status === 422) {
              this.serverValidationForm.showErrors(error.error.errors, currentFormGroup['controls']);
            }
          }
        );
      } else {
        this.notificationService.warn('YOU_HAVENT_MADE_ANY_CHANGES', 3000, true);
      }
    } else {
      this.notificationService.error('THIS_DATA_DOESNT_VALID', 3000, true);
    }
  }
  private setTableDataSource(tableData: Role[]): void {
    this.tableDataSource = new MatTableDataSource(tableData);
    this.tableDataSource.filterPredicate = (data: Role, filter: string) => data.name.indexOf(filter) !== -1;
  }
  private removeItemFromTableDataSource(cellIndex: number): void {
    this.tableDataSource.data.splice(cellIndex, 1);
    this.tableDataSource._updateChangeSubscription();
  }
  private addRolesArrayForm(): void {
    this.getRolesArrayGroup().push(this.initRolesArrayForm());
  }
  private initRolesArrayForm(): FormGroup {
    return this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      is_registration_role: ['', [Validators.required]],
      description: ['', [Validators.maxLength(255)]],
    });
  }
  private getRolesArrayGroup(): FormArray {
    return this.rolesFormGroup.controls['roles'] as FormArray;
  }
  private initRolesFormGroup(): void {
    this.rolesFormGroup = this.formBuilder.group({
      roles: this.formBuilder.array([])
    });
  }
}
