import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from "../../../models/components/user.class";
import {CrudService} from "rushapp-angular-core";

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService {
  protected namespace = 'users';
  protected modelClass = User;

  private isPersonalDataUpdated = new BehaviorSubject<boolean>(true);

  public setIsPersonalDataUpdated(val: boolean): void {
    this.isPersonalDataUpdated.next(val);
  }
  public getIsPersonalDataUpdated(): Observable<boolean> {
    return this.isPersonalDataUpdated.asObservable();
  }

  public getPersonalData(): Observable<any> {
    this.setShowRequestInProgress();
    return this.sendGet(this.getEndpoint('get-personal-data'))
      .pipe(
        map((res: Response) => {
          this.setShowRequestCompleted();
          return this.buildModel(res);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setShowRequestCompleted();
          return this.httpResponseErrorHandler(error);
        })
      );
  }
  public updatePersonalData(data: any): Observable<any> {
    this.setUpdateRequestInProgress();
    return this.sendPost(this.getEndpoint('update-personal-data'), data)
      .pipe(
        map((res: Response) => {
          this.setUpdateRequestCompleted();
          return this.buildModel(res);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setUpdateRequestCompleted();
          return this.httpResponseErrorHandler(error);
        })
      );
  }
}
