import {IEnvironment} from '../shared/interfaces/environment.interface';

export const environment: IEnvironment = {
  production: true,
  staging: false,
  apiEndpoint: `${process.env['BACKEND_URL']}/`,
  languages: {
    en: 'en',
    ru: 'ru',
  },
  defaultLanguage: 'en',
  metaTagImage: 'storage/logo.png'
};
