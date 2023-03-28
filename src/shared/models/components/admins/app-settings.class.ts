import {BaseModel} from "rushapp-angular-core";

export class AppSettings extends BaseModel {
    public id: number;
    public variable_name: string;
    public variable_value: any;
    public variable_default_value: string;

    protected fields(): string[] {
        return [
            'id',
            'variable_name',
            'variable_value',
            'variable_default_value',
        ];
    }
}
