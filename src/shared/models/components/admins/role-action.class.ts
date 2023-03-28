import {BaseModel} from "rushapp-angular-core";

export class RoleAction extends BaseModel {
  public id: number;
  public role_id: number;
  public action_id: number;
  public is_owner: boolean;
  public is_owner_key: boolean;
  public excluded_fields: string;

  protected fields(): string[] {
    return [
      'id',
      'role_id',
      'action_id',
      'is_owner',
      'is_owner_key',
      'excluded_fields',
    ];
  }
}
