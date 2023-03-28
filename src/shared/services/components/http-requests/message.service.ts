import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from "rushapp-angular-core";
import {IConsultation} from "../../../interfaces/consultation.interface";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService extends ApiService {
  sendMessage(messageData: IConsultation): Observable<any> {
    return this.sendPost(this.getEndpoint('consultation'), messageData);
  }
}
