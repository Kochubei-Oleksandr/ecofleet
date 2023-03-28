import {Injectable} from "@angular/core";
import {CrudService} from "rushapp-angular-core";
import {User} from "../../../../models/components/user.class";

@Injectable({
    providedIn: 'root'
})
export class UserManagementService extends CrudService {
    protected namespace = 'user-management';
    protected modelClass = User;
}
