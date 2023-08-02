import {IEnvironment} from '../shared/interfaces/environment.interface';

export const environment: IEnvironment = {
  production: false,
  staging: true,
  apiEndpoint: `${process.env['BACKEND_URL']}/`,
  languages: {
    en: 'en',
    ru: 'ru',
  },
  defaultLanguage: 'en',
  metaTagImage: 'storage/logo.png',
  ecofleetApiEndpoint: 'https://app.ecofleet.com/seeme/Api/'

};
