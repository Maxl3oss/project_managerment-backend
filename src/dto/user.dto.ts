import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/role/roles.enum';

export class User {
  name: string;
  email: string;
  password: string;
  id: string;
  roles: Role[];
}
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
