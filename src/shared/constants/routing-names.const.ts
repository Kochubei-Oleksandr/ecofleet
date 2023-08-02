import {IRoutingName} from '../interfaces/routing-name.interface';

const MAIN_ROUTES = {
  landing: '',
  login: 'login',
  registration: 'registration',
  change_forgotten_password: 'change-forgotten-password',
  my_account: 'my-account',
  settings: 'settings',
  map: 'map',
};

const CHILD_ROUTES = {
  theme_settings: 'theme-settings',
  users_and_roles: 'users-and-roles',
  roles: 'roles',
  users: 'users',
  access_level_control: 'access-level-control',
};

// fr - prefix - full_route
const FULL_CHILD_ROUTES = {
  fr_theme_settings: MAIN_ROUTES.settings + '/' + CHILD_ROUTES.theme_settings,
  fr_users_and_roles: MAIN_ROUTES.settings + '/' + CHILD_ROUTES.users_and_roles,
  fr_users: MAIN_ROUTES.settings + '/' + CHILD_ROUTES.users_and_roles + '/' + CHILD_ROUTES.users,
  fr_roles: MAIN_ROUTES.settings + '/' + CHILD_ROUTES.users_and_roles + '/' + CHILD_ROUTES.roles,
  fr_access_level_control: MAIN_ROUTES.settings + '/' + CHILD_ROUTES.users_and_roles + '/' + CHILD_ROUTES.access_level_control,
};

export const ROUTING_NAMES: IRoutingName = {
  ...MAIN_ROUTES,
  ...CHILD_ROUTES,
  ...FULL_CHILD_ROUTES,
};
