export interface ISidenavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: ISidenavItem[];
  roles?: number[];
}
