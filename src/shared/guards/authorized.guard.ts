import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "rushapp-angular-core";
import {ROUTING_NAMES} from "../constants/routing-names.const";

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
  public constructor(
    private authService: AuthService,
    public router: Router
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([ROUTING_NAMES.my_account]);
    }

    return true;
  }
}
