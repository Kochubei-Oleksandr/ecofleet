import {Injectable} from "@angular/core";
import {CrudService} from "rushapp-angular-core";
import {AccessLevelControl} from "../../../../models/components/admins/access-level-control.class";

@Injectable({
    providedIn: 'root'
})
export class AccessLevelControlService extends CrudService {
    protected namespace = 'access-level-control';
    protected modelClass = AccessLevelControl;
}
