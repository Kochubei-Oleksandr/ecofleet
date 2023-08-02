import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TokenInterceptor } from "rushapp-angular-core";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor (private rushappTokenInterceptor: TokenInterceptor) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.startsWith(environment.ecofleetApiEndpoint)) {
      return next.handle(request);
    }
    return this.rushappTokenInterceptor.intercept(request, next);
  }
}
