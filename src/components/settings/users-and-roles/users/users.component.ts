import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../../shared/models/components/user.class";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ApiService, NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {AddingNewUserDialogComponent} from "../../../../shared-components/dialogs/adding-new-user-dialog/adding-new-user-dialog.component";
import {RoleService} from "../../../../shared/services/components/http-requests/admins/roles.service";
import {UserManagementService} from "../../../../shared/services/components/http-requests/admins/user-management.service";
import {Role} from "../../../../shared/models/components/admins/role.class";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public columnsToDisplay: string[] = ['id', 'name', 'email', 'roles', 'actions'];
  public paginatorPageSizeOptions: number[] = [5, 10, 25, 50];
  public tableDataSource: MatTableDataSource<User>;
  public paginatorPageIndex: number = 0;
  public paginatorPageSize: number = this.paginatorPageSizeOptions[0];
  public paginatorTotalCount: number;
  public filterByString: string = '';
  public filterByRoles: number[] = [];
  public displayedIsArchivedUsers: boolean = false;
  public sortColumn: string;
  public sortDirection: string;
  public usersFormGroup: FormGroup;
  public executionIdentifierForSaveCurrentRequest: number[] = [];
  public roles: Role[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public constructor(
    public serverValidationForm: ServerValidationFormService,
    private userManagementService: UserManagementService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private roleService: RoleService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.initUsersFormGroup();
    this.getRoles();
    this.getUsers();
  }
  public resetFiltersAndGetAllData() {
    this.displayedIsArchivedUsers = false;
    this.filterByString = '';
    this.filterByRoles = [];
    this.getUsers();
  }
  public sortUsersData(sort: Sort): void {
    if (this.getUsersArrayGroup().dirty) {
      if (confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))) {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
        this.getUsers();
      }
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
      this.getUsers();
    }
  }
  public paginateUsersData(event?: PageEvent): void {
    if (this.getUsersArrayGroup().dirty) {
      confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))
        ? this.getUsers(event)
        : this.paginatorPageIndex--;
    } else {
      this.getUsers(event);
    }
  }
  public getUsers(event?: PageEvent): void {
    const parameters: any = {
      paginate: event ? event.pageSize : this.paginatorPageSize,
      page: event ? event.pageIndex + 1 : this.paginatorPageIndex,
      order_by_field: (this.sortColumn && this.sortDirection) ? (this.sortColumn+':'+this.sortDirection) : 'id:asc',
      role_ids: this.filterByRoles.toString(),
      is_deleted: this.displayedIsArchivedUsers,
      with: 'user_role'
    };

    if (this.filterByString) {
      parameters['where_like'] = 'name,email|'+this.filterByString;
    }

    this.userManagementService.indexPaginate(parameters).subscribe((res) => {
      this.getUsersArrayGroup().markAsPristine();
      this.getUsersArrayGroup().markAsUntouched();

      this.setTableDataSource(res.data);
      this.tableDataSource.sort = this.sort;

      res.data.forEach(() => {
        this.addUsersArrayForm();
      });

      this.getUsersArrayGroup().patchValue(res.data);

      this.displayedIsArchivedUsers
        ? this.getUsersArrayGroup().disable()
        : this.getUsersArrayGroup().enable();

      this.paginatorPageIndex = res.current_page - 1;
      this.paginatorPageSize = res.per_page;
      this.paginatorTotalCount = res.total;
    })
  }
  public getIterationControl(iterationIndex: number): AbstractControl {
    return this.getUsersArrayGroup().controls[iterationIndex];
  }
  public isSaveItemRequestInProcess(executionIdentifier: number): boolean {
    return (this.executionIdentifierForSaveCurrentRequest.filter((item: number) => item === executionIdentifier)).length !== 0;
  }
  public isFormControlDataDirty(cellIndex: number): boolean {
    return this.getIterationControl(cellIndex).dirty;
  }
  public getFilterSelectTriggerRoleName(): string {
    return this.filterByRoles.length !== 0
      ? this.roles.find(role => role.id === this.filterByRoles[0]).name
      : '';
  }
  public getUserSelectTriggerRoleName(iterationIndex: number): string {
    const selectedRoles = this.getIterationControl(iterationIndex).value;
    return selectedRoles.user_roles_ids.length !== 0
      ? this.roles.find(role => role.id === selectedRoles.user_roles_ids[0]).name
      : '';
  }
  public isRequestCompleted(): boolean {
    return this.userManagementService.getIsIndexPaginateRequestCompleted();
  }
  public openAddingNewUserDialog(): void {
    const dialogRef = this.dialog.open(AddingNewUserDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
      }
    });
  }
  public archiveUser(cellIndex: number): void {
    const currentFormGroup = this.getIterationControl(cellIndex);
    this.removeItemFromTableDataSource(cellIndex);
    this.getUsersArrayGroup().removeAt(cellIndex);
    this.apiService.sendPost(this.apiService.getEndpoint('archive-account'), {user_id: currentFormGroup.value.id}).subscribe(
      () => this.notificationService.success('USER_HAS_BEEN_ARCHIVED', 3000, true),
      (error: HttpErrorResponse) => {
        this.getUsers();
        this.apiService.httpResponseErrorHandler(error);
      }
    );
  }
  public restoreUser(cellIndex: number): void {
    const currentFormGroup = this.getIterationControl(cellIndex);
    this.removeItemFromTableDataSource(cellIndex);
    this.getUsersArrayGroup().removeAt(cellIndex);
    this.apiService.sendPost(this.apiService.getEndpoint('restore-account'), {user_id: currentFormGroup.value.id}).subscribe(
      () => this.notificationService.success('USER_HAS_BEEN_RESTORED', 3000, true),
      (error: HttpErrorResponse) => {
        this.getUsers();
        this.apiService.httpResponseErrorHandler(error);
      }
    );
  }
  public deleteUserForever(cellIndex: number): void {
    if (confirm(this.translateService.instant('DO_YOU_WANT_TO_DELETE_FOREVER?'))) {
      const currentFormGroup = this.getIterationControl(cellIndex);
      this.removeItemFromTableDataSource(cellIndex);
      this.getUsersArrayGroup().removeAt(cellIndex);
      this.userManagementService.destroy(currentFormGroup.value.id).subscribe(
        () => this.notificationService.success('DATA_HAS_BEEN_DELETE_FOREVER', 3000, true),
        () => this.getUsers()
      );
    }
  }
  public updateTableElement(cellIndex: number): void {
    const currentFormGroup: any = this.getIterationControl(cellIndex);
    if (currentFormGroup.valid) {
      if (currentFormGroup.dirty) {
        this.executionIdentifierForSaveCurrentRequest.push(cellIndex);
        const userData = currentFormGroup.value;
        this.getIterationControl(cellIndex).disable();
        this.userManagementService.update(userData.id, userData).subscribe(
          () => {
            this.executionIdentifierForSaveCurrentRequest = this.executionIdentifierForSaveCurrentRequest.filter(
              (item: number) => item !== cellIndex
            );
            // this.setTableDataSource(this.usersFormGroup.controls['users']['value']);
            this.getIterationControl(cellIndex).enable();
            currentFormGroup.markAsPristine();
            this.notificationService.success('DATA_HAS_BEEN_SAVED', 3000, true);
          },
          (error: any) => {
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
  private getRoles(): void {
    this.roleService.index().subscribe((res: Role[]) => {
      this.roles = res;
    })
  }
  private setTableDataSource(tableData: User[]): void {
    this.tableDataSource = new MatTableDataSource(tableData);
    this.tableDataSource.filterPredicate = (data: User, filter: string) => data.email.indexOf(filter) !== -1;
  }
  private removeItemFromTableDataSource(cellIndex: number): void {
    this.tableDataSource.data.splice(cellIndex, 1);
    this.tableDataSource._updateChangeSubscription();
  }
  private addUsersArrayForm(): void {
    this.getUsersArrayGroup().push(this.initUsersArrayForm());
  }
  private initUsersArrayForm(): FormGroup {
    return this.formBuilder.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      user_roles_ids: ['', [Validators.required]],
    });
  }
  private getUsersArrayGroup(): FormArray {
    return this.usersFormGroup.controls['users'] as FormArray;
  }
  private initUsersFormGroup(): void {
    this.usersFormGroup = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
  }
}
