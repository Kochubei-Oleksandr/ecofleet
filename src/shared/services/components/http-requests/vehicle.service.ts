import {Injectable} from '@angular/core';
import {CrudService} from "rushapp-angular-core";
import {environment} from "../../../../environments/environment";
import {Vehicle} from "../../../models/components/vehicle.class";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends CrudService {
  public isGetVehiclesRequestCompleted: boolean = true;
  protected namespace: string = 'Vehicles/getLastData';
  protected modelClass = Vehicle;
  protected override apiEndpoint: string = environment.ecofleetApiEndpoint;

  public getVehicles<T>(parameters?: any): Observable<any> {
    this.isGetVehiclesRequestCompleted = false;
    return this.sendGet(this.getEndpoint(this.namespace), {params: parameters})
      .pipe(
        map((res: any) => {
          this.isGetVehiclesRequestCompleted = true;
          return this.buildModelFromArray(res['response']);
        }),
        catchError((error: HttpErrorResponse) => {
          this.isGetVehiclesRequestCompleted = true;
          return this.httpResponseErrorHandler(error);
        })
      );
  }
}
