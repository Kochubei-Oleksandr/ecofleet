import {Injectable} from "@angular/core";
import {CrudService} from "rushapp-angular-core";
import {CssVariableCategory} from "../../../../models/components/admins/css-variable-category.class";

@Injectable({
    providedIn: 'root'
})
export class CssVariableCategoryService extends CrudService {
    protected namespace = 'css-variable-categories';
    protected modelClass = CssVariableCategory;
}
