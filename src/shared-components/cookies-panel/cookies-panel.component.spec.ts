import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {I18nModule} from "../../shared/ssr-services/i18n/i18n.module";
import {CookiesPanelComponent} from "./cookies-panel.component";

describe('CookiesPanelComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule, I18nModule
            ],
            declarations: [
                CookiesPanelComponent
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

    it('should create the CookiesPanelComponent', () => {
        const fixture = TestBed.createComponent(CookiesPanelComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
