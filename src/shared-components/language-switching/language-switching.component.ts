import {Component} from '@angular/core';
import {environment} from '../../environments/environment';
import {LanguageService} from "rushapp-angular-core";

@Component({
  selector: 'app-language-switching',
  templateUrl: './language-switching.component.html',
  styleUrls: ['./language-switching.component.scss']
})
export class LanguageSwitchingComponent {
  constructor(private languageService: LanguageService) { }

  public getServiceLanguage(): string {
    return this.languageService.currentLanguage;
  }
  public setServiceLanguage(lang: string): void {
    this.languageService.currentLanguage = lang;
  }
  public getMenuItems(): string[] {
    return Object.values(environment.languages);
  }
  public isMenuItemActive(lang: string): boolean {
    return this.getServiceLanguage() === lang;
  }
}
