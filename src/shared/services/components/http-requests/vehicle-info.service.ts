import {Injectable} from '@angular/core';
import {CrudService} from "rushapp-angular-core";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {map, catchError} from 'rxjs/operators';
import {VehicleInfo} from "../../../models/components/vehicle-info.class";

@Injectable({
  providedIn: 'root'
})
export class VehicleInfoService extends CrudService {
  public isVehicleInfoRequestCompleted: boolean = true;
  protected namespace: string = 'Vehicles/getRawData';
  protected modelClass = VehicleInfo;
  protected override apiEndpoint: string = environment.ecofleetApiEndpoint;

  public getVehicleInfo<T>(parameters?: any): Observable<any> {
    this.isVehicleInfoRequestCompleted = false;
    return this.sendGet(this.getEndpoint(this.namespace), {params: parameters})
      .pipe(
        map((res: any) => {
          this.isVehicleInfoRequestCompleted = true;
          return this.buildModelFromArray(res['response']);
        }),
        catchError((error: HttpErrorResponse) => {
          this.isVehicleInfoRequestCompleted = true;
          return this.httpResponseErrorHandler(error);
        })
      );
  }
}
