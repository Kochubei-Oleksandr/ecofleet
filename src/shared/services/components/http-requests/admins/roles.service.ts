import {Injectable} from '@angular/core';
import {CrudService} from "rushapp-angular-core";
import {Role} from "../../../../models/components/admins/role.class";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CrudService {
  protected namespace = 'roles';
  protected modelClass = Role;
}
