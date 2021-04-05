export class User {

  id: number;

  userId: string;

  firstName: string;

  middleName: string;

  lastName: string;

  username: string;

  password: string;

  email: string;

  lastLoginDate: Date;

  lastLoginDateDisplay: Date;

  joinDate: Date;

  roles: [];

  isActive: boolean;

  isNotLocked: boolean;

  constructor() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.roles = [];
    this.isActive = false;
    this.isNotLocked = false;
  }
}
