import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {HexToRgbService, NotificationService, ServerValidationFormService} from "rushapp-angular-core";
import {TranslateService} from "@ngx-translate/core";
import {Color} from "@angular-material-components/color-picker";
import {Subscription} from "rxjs";
import {CssVariable} from "../../../shared/models/components/admins/css-variable.class";
import {CssVariableService} from "../../../shared/services/components/http-requests/admins/css-variable.service";
import {CssVariableCategory} from "../../../shared/models/components/admins/css-variable-category.class";
import {
  CssVariableCategoryService
} from "../../../shared/services/components/http-requests/admins/css-variable-category.service";

@Component({
  selector: 'app-theme-settings',
  templateUrl: './app-theme-settings.component.html',
  styleUrls: ['./app-theme-settings.component.scss']
})
export class AppThemeSettingsComponent implements OnInit, OnDestroy {
  public columnsToDisplay: string[] = ['id', 'variable_name', 'variable_value', 'variable_default_value', 'actions'];
  public paginatorPageSizeOptions: number[] = [5, 10, 25, 50];
  public tableDataSource: MatTableDataSource<CssVariable>;
  public paginatorPageIndex: number = 0;
  public paginatorPageSize: number = this.paginatorPageSizeOptions[0];
  public paginatorTotalCount: number;
  public filterByString: string = '';
  public sortColumn: string;
  public sortDirection: string;
  public cssVariableFormGroup: FormGroup;
  public executionIdentifierForSaveCurrentRequest: number[] = [];
  public allCssVariableCategories: CssVariableCategory[];
  public selectedCategoryId?: number;
  private colorsIdInCssVariableCategoriesInDB: number = 4;
  private subsTranslateService: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public constructor(
    public serverValidationForm: ServerValidationFormService,
    private cssVariableService: CssVariableService,
    private cssVariableCategoryService: CssVariableCategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private hexToRgbService: HexToRgbService,
  ) { }

  public ngOnInit(): void {
    this.subscribed();
    this.initCssVariableFormGroup();
    this.getAllCssVariableCategories();
    this.getCssVariables();
  }
  public ngOnDestroy(): void {
    this.unsubscribed();
  }

  public isVariableForColor(cssVariableCategoryId: number): boolean {
    return cssVariableCategoryId === this.colorsIdInCssVariableCategoriesInDB;
  }
  public resetFiltersAndGetAllData(): void {
    this.selectedCategoryId = null;
    this.filterByString = '';
    this.getCssVariables();
  }
  public sortCssVariableData(sort: Sort): void {
    if (this.getCssVariableArrayGroup().dirty) {
      if (confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))) {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
        this.getCssVariables();
      }
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
      this.getCssVariables();
    }
  }
  public paginateCssVariableData(event?: PageEvent): void {
    if (this.getCssVariableArrayGroup().dirty) {
      confirm(this.translateService.instant('YOU_HAVE_UNSAVED_DATA'))
        ? this.getCssVariables(event)
        : this.paginatorPageIndex--;
    } else {
      this.getCssVariables(event);
    }
  }
  public getCssVariables(event?: PageEvent): void {
    const parameters: any = {
      paginate: event ? event.pageSize : this.paginatorPageSize,
      page: event ? event.pageIndex + 1 : this.paginatorPageIndex,
      order_by_field: (this.sortColumn && this.sortDirection) ? (this.sortColumn+':'+this.sortDirection) : 'id:asc',
      where_like: 'css_variable_category_id,variable_name,variable_value,variable_default_value|'+this.filterByString,
    };
    if (this.selectedCategoryId) {
      parameters['css_variable_category_id'] = this.selectedCategoryId;
    }
    this.cssVariableService.indexPaginate(parameters).subscribe((res) => {
      this.getCssVariableArrayGroup().markAsPristine();
      this.getCssVariableArrayGroup().markAsUntouched();

      const resultData = res.data.map((item: CssVariable) => {
        this.addCssVariableArrayForm()
        if (item.css_variable_category_id === this.colorsIdInCssVariableCategoriesInDB) {
          const temp = this.hexToRgbService.convert(item.variable_value);
          item.variable_value = new Color(temp.r, temp.g, temp.b);
        }
        return item;
      })

      this.setTableDataSource(resultData);
      this.tableDataSource.sort = this.sort;

      this.getCssVariableArrayGroup().patchValue(resultData);

      this.paginatorPageIndex = res.current_page - 1;
      this.paginatorPageSize = res.per_page;
      this.paginatorTotalCount = res.total;
    })
  }
  public getIterationControl(iterationIndex: number): AbstractControl {
    return this.getCssVariableArrayGroup().controls[iterationIndex];
  }
  public isSaveItemRequestInProcess(executionIdentifier: number): boolean {
    return (this.executionIdentifierForSaveCurrentRequest.filter((item: number) => item === executionIdentifier)).length !== 0;
  }
  public isFormControlDataDirty(cellIndex: number): boolean {
    return this.getIterationControl(cellIndex).dirty;
  }
  public isRequestCompleted(): boolean {
    return this.cssVariableService.getIsIndexPaginateRequestCompleted()
      && this.cssVariableCategoryService.getIsIndexRequestCompleted()
      &&  this.cssVariableService.getIsStoreRequestCompleted();
  }
  public updateCssVariable(cellIndex: number): void {
    const currentFormGroup: any = this.getIterationControl(cellIndex);
    if (currentFormGroup.valid) {
      if (currentFormGroup.dirty) {
        this.executionIdentifierForSaveCurrentRequest.push(cellIndex);
        const cssVariable = currentFormGroup.value;
        delete cssVariable['variable_default_value'];
        if (cssVariable['css_variable_category_id'] === this.colorsIdInCssVariableCategoriesInDB) {
          cssVariable['variable_value'] = '#'+cssVariable['variable_value']['hex']
        }
        this.getIterationControl(cellIndex).disable();
        this.cssVariableService.update(cssVariable.id, cssVariable).subscribe(
          (res: CssVariable) => {
            document.documentElement.style.setProperty(res.variable_name, res.variable_value);
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
  private subscribed(): void {
    this.subsTranslateService = this.translateService.onLangChange.subscribe(() => {
      this.getAllCssVariableCategories();
    });
  }
  private unsubscribed(): void {
    if (this.subsTranslateService) {
      this.subsTranslateService.unsubscribe();
    }
  }
  private getAllCssVariableCategories(): void {
    this.cssVariableCategoryService.index().subscribe((res: CssVariableCategory[]) => {
      this.allCssVariableCategories = res;
    })
  }
  private setTableDataSource(tableData: CssVariable[]): void {
    this.tableDataSource = new MatTableDataSource(tableData);
    this.tableDataSource.filterPredicate = (data: CssVariable, filter: string) => data.variable_name.indexOf(filter) !== -1;
  }
  private addCssVariableArrayForm(): void {
    this.getCssVariableArrayGroup().push(this.initCssVariableArrayForm());
  }
  private initCssVariableArrayForm(): FormGroup {
    return this.formBuilder.group({
      id: ['', [Validators.required]],
      css_variable_category_id: ['', [Validators.required]],
      variable_name: ['', [Validators.required, Validators.maxLength(50)]],
      variable_value: ['', [Validators.required, Validators.maxLength(50)]],
      variable_default_value: [''],
    });
  }
  private getCssVariableArrayGroup(): FormArray {
    return this.cssVariableFormGroup.controls['css_variables'] as FormArray;
  }
  private initCssVariableFormGroup(): void {
    this.cssVariableFormGroup = this.formBuilder.group({
      css_variables: this.formBuilder.array([])
    });
  }
}


