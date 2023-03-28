import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {LanguageSwitchingComponent} from "./language-switching.component";
import {I18nModule} from "../../shared/ssr-services/i18n/i18n.module";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {MatMenuModule} from "@angular/material/menu";

describe('LanguageSwitchingComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule, I18nModule, MatMenuModule
            ],
            declarations: [
                LanguageSwitchingComponent
            ],
            providers: [
                TranslateService,
                {provide: 'defaultLanguage', useValue: environment.defaultLanguage},
                {provide: 'languages', useValue: environment.languages},
                {provide: 'apiEndpoint', useValue: environment.apiEndpoint},
                {provide: 'metaTagImage', useValue: environment.metaTagImage},
            ],
        }).compileComponents();
    });

    it('should create the LanguageSwitchingComponent', () => {
        const fixture = TestBed.createComponent(LanguageSwitchingComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
