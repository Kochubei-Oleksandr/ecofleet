import {ISidenavItem} from "../interfaces/sidenav-item.interface";
import {ROUTING_NAMES} from "./routing-names.const";

export const SIDENAV_ITEMS: ISidenavItem[] = [
  {
    displayName: 'MY_ACCOUNT',
    iconName: 'person',
    route: ROUTING_NAMES.my_account,
  },
  {
    displayName: 'SETTINGS',
    iconName: 'settings',
    children: [
      {
        displayName: 'THEME_SETTINGS',
        iconName: 'format_paint',
        route: ROUTING_NAMES.fr_theme_settings,
      },
      {
        displayName: 'USERS_AND_ROLES',
        iconName: 'group_work',
        route: ROUTING_NAMES.fr_users,
      },
    ]
  },
];
