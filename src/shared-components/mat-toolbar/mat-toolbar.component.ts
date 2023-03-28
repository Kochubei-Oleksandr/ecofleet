import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../shared/models/components/user.class";
import {AuthService, BrowserLocalStorageService, SidenavService} from "rushapp-angular-core";
import {UserService} from "../../shared/services/components/http-requests/user.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {ROUTING_NAMES} from "../../shared/constants/routing-names.const";

@Component({
  selector: 'app-mat-toolbar',
  templateUrl: './mat-toolbar.component.html',
  styleUrls: ['./mat-toolbar.component.scss']
})
export class MatToolbarComponent implements OnInit, OnDestroy {
  public user: User;
  private subsUpdateUserData: Subscription;

  constructor(
    public sidenavService: SidenavService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private browserLocalStorage: BrowserLocalStorageService
  ) { }

  public ngOnInit(): void {
    this.getUserData();
    this.subscribed();
  }
  public ngOnDestroy(): void {
    this.unsubscribed();
  }

  public goToLoginPage(): void {
    this.router.navigate([ROUTING_NAMES.login]);
  }
  public goToRegistrationPage(): void {
    this.router.navigate([ROUTING_NAMES.registration]);
  }
  public logout(): void {
    if (confirm(
      this.translateService.instant('ARE_YOU_SURE_THAT_YOU_WANT_TO_GO_OUT?')
    )) {
      this.sidenavService.closeSidenav();
      this.authService.backendLogout();
      this.browserLocalStorage.removeItem('role_id');
    }
  }
  public isUserAuth(): boolean {
    return this.authService.isLoggedIn();
  }
  public isLandingPage(): boolean {
    return this.router.url === '/';
  }

  private subscribed(): void {
    this.subsUpdateUserData = this.userService.getIsPersonalDataUpdated().subscribe(() => {
      this.getUserData();
    });
  }
  private unsubscribed(): void {
    if (this.subsUpdateUserData) {
      this.subsUpdateUserData.unsubscribe();
    }
  }
  private getUserData(): void {
    if (this.isUserAuth()) {
      this.userService.getPersonalData().subscribe((res: User) => {
        this.user = res;
      });
    }
  }
}
