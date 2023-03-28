import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {IsActiveMatchOptions, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ISidenavItem} from "../../shared/interfaces/sidenav-item.interface";
import {BrowserLocalStorageService, SidenavService} from "rushapp-angular-core";

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  public expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: ISidenavItem;
  @Input() depth: number;

  constructor(
    public router: Router,
    private sidenavService: SidenavService,
    private browserLocalStorage: BrowserLocalStorageService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  public ngOnInit() {
    this.sidenavService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }
  public isActiveRoute(): boolean {
    const isActiveMatchOptions: IsActiveMatchOptions = {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };
    return this.item.route ? this.router.isActive(this.item.route, isActiveMatchOptions): false
  }
  public onItemSelected(item: ISidenavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
  public isAvailableForUserRole(roles: number[]) {
    return roles.includes(Number(this.browserLocalStorage.getItem('role_id')));
  }
}
