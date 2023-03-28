import {BaseModel} from "rushapp-angular-core";

export class CssVariableCategory extends BaseModel {
    public id: number;
    public name: string;

    protected fields(): string[] {
        return [
            'id',
            'name',
        ];
    }
}
