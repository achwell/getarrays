import {Role} from "./role";

export class User {

  id: number;

  firstName: string;

  middleName: string;

  lastName: string;

  username: string;

  password: string;

  email: string;

  lastLoginDate: Date;

  lastLoginDateDisplay: Date;

  joinDate: Date;

  roles: Role[];

  active: boolean;

  notLocked: boolean;

  constructor() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.roles = [];
    this.active = false;
    this.notLocked = false;
  }
}
