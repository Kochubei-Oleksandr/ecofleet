import {MediaMatcher} from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit, PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {AuthService, CanonicalLinkService} from "rushapp-angular-core";
import { Router} from "@angular/router";
import {ISidenavItem} from "../shared/interfaces/sidenav-item.interface";
import {SIDENAV_ITEMS} from "../shared/constants/sidenav-items.const";
import {isPlatformBrowser} from "@angular/common";
import {SidenavService} from "rushapp-angular-core";
declare var gtag: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  public mobileQuery: MediaQueryList;
  public sidenavItems: ISidenavItem[] = SIDENAV_ITEMS;
  @ViewChild('appDrawer') public appDrawer: ElementRef;
  private mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    private canonicalLinkService: CanonicalLinkService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  public ngOnInit(): void {
    this.setCssVariables();
    this.canonicalLinkService.setCanonicalURL();
    this.setMobileQuery();
  }
  public ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mobileQuery.removeEventListener("change", () => {
        this.mobileQueryListener();
      });
    }
  }
  public ngAfterViewInit() {
    this.sidenavService.appDrawer = this.appDrawer;
  }
  public isLandingPage(): boolean {
    return this.router.url === '/';
  }
  public isUserAuth(): boolean {
    return this.authService.isLoggedIn();
  }
  private setMobileQuery(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      this.mobileQuery.removeEventListener("change", () => {
        this.mobileQueryListener();
      });
    }
  }
  private setCssVariables() {

  }
}
