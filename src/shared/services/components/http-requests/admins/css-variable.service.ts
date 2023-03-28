import {Injectable} from "@angular/core";
import {CrudService} from "rushapp-angular-core";
import {CssVariable} from "../../../../models/components/admins/css-variable.class";

@Injectable({
    providedIn: 'root'
})
export class CssVariableService extends CrudService {
    protected namespace = 'css-variables';
    protected modelClass = CssVariable;
}
