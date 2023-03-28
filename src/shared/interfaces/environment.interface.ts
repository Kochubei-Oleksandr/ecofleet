import {IServiceLanguage} from "./service-language.interface";

export interface IEnvironment {
  apiEndpoint: string;
  production: boolean;
  staging: boolean;
  languages: IServiceLanguage,
  defaultLanguage: string,
  metaTagImage: string,
}
