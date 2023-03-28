import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "rushapp-angular-core";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Overlay} from "@angular/cdk/overlay";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {I18nModule} from "../../../shared/ssr-services/i18n/i18n.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {MatTreeModule} from "@angular/material/tree";
import {MatBadgeModule} from "@angular/material/badge";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProgressSpinnerComponent} from "../../../shared-components/progress-spinner/progress-spinner.component";

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationComponent, ProgressSpinnerComponent ],
      imports: [
        RouterTestingModule, HttpClientTestingModule, MatDialogModule, I18nModule, MatCheckboxModule,
        MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
        MatTooltipModule, MatRadioModule, MatSnackBarModule, MatTableModule, MatTreeModule, MatBadgeModule,
        BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule,
      ],
      providers: [
        AuthService, TranslateService,
        {provide: 'defaultLanguage', useValue: environment.defaultLanguage},
        {provide: 'languages', useValue: environment.languages},
        {provide: 'apiEndpoint', useValue: environment.apiEndpoint},
        {provide: 'metaTagImage', useValue: environment.metaTagImage},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
