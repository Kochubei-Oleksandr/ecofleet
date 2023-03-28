import {IEnvironment} from '../shared/interfaces/environment.interface';

export const environment: IEnvironment = {
  production: false,
  staging: false,
  apiEndpoint: 'http://api.rush-app.local/',
  languages: {
    en: 'en',
    ru: 'ru',
  },
  defaultLanguage: 'en',
  metaTagImage: 'storage/logo.png',
};
