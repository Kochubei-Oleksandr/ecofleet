import {Component} from '@angular/core';
import {ROUTING_NAMES} from '../../../shared/constants/routing-names.const';

@Component({
  selector: 'app-users-and-roles',
  templateUrl: './users-and-roles.component.html',
  styleUrls: ['./users-and-roles.component.scss']
})
export class UsersAndRolesComponent {
  public routingNames = ROUTING_NAMES;
}
