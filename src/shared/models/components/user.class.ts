import {BaseModel} from "rushapp-angular-core";

export class User extends BaseModel {
  public id: number;
  public name: string;
  public email: string;

  protected fields(): string[] {
    return [
      'id',
      'name',
      'email',
      'user_roles_ids',
    ];
  }
}
