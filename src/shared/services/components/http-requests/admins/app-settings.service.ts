import {Injectable} from '@angular/core';
import {CrudService} from "rushapp-angular-core";
import {AppSettings} from "../../../../models/components/admins/app-settings.class";

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService extends CrudService {
  protected namespace = 'settings';
  protected modelClass = AppSettings;
}
