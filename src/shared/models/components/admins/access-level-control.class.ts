import {BaseModel} from "rushapp-angular-core";
import {RoleAction} from "./role-action.class";

export class AccessLevelControl extends BaseModel {
  public id: number;
  public route_name: string;
  public index?: RoleAction;
  public index_is_owner: boolean;
  public show?: RoleAction;
  public show_is_owner: boolean;
  public store?: RoleAction;
  public store_is_owner: boolean;
  public update?: RoleAction;
  public update_is_owner: boolean;
  public destroy?: RoleAction;
  public destroy_is_owner: boolean;

  protected fields(): string[] {
    return [
      'id',
      'route_name',
      'index',
      'index_is_owner',
      'show',
      'show_is_owner',
      'store',
      'store_is_owner',
      'update',
      'update_is_owner',
      'destroy',
      'destroy_is_owner'
    ];
  }
}
