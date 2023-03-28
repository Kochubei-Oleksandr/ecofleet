import {Component} from '@angular/core';
import {LINKS_TO_DOCUMENTS} from '../../shared/constants/links-to-documents.const';
import {BrowserLocalStorageService} from "rushapp-angular-core";

@Component({
  selector: 'app-cookies-panel',
  templateUrl: './cookies-panel.component.html',
  styleUrls: ['./cookies-panel.component.scss']
})
export class CookiesPanelComponent {
  public privacyPolicy = LINKS_TO_DOCUMENTS.privacyPolicy;

  public constructor(protected browserLocalStorage: BrowserLocalStorageService) { }

  public acceptCookies(): void {
    this.browserLocalStorage.setItem('is_accepted_cookies', 'true');
  }
  public isAcceptedCookies(): boolean {
    return !!this.browserLocalStorage.getItem('is_accepted_cookies');
  }
}
