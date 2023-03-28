import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {TranslateService} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {MatTreeModule} from "@angular/material/tree";
import {MatBadgeModule} from "@angular/material/badge";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "rushapp-angular-core";
import {I18nModule} from "../../../shared/ssr-services/i18n/i18n.module";
import {environment} from "../../../environments/environment";
import {ChangePasswordComponent} from "./change-password.component";

describe('ChangePasswordComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ChangePasswordComponent
            ],
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
        }).compileComponents();
    });

    it('should create the ChangePasswordComponent', () => {
        const fixture = TestBed.createComponent(ChangePasswordComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
