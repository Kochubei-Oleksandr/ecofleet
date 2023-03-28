import {BaseModel} from "rushapp-angular-core";

export class Role extends BaseModel {
  public id: number;
  public name: string;
  public description: string;
  public is_registration_role: boolean;

  protected fields(): string[] {
    return [
      'id',
      'name',
      'description',
      'is_registration_role',
    ];
  }
}
