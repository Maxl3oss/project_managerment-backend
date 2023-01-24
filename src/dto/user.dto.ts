import { Role } from 'src/role/roles.enum';

export class User {
  name: string;
  email: string;
  password: string;
  id: string;
  roles: Role[];
}
