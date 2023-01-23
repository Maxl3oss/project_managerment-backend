import { JwtAuthGuard } from './jwt-auth.guard';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() body: Omit<User, 'id'>) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() req) {
    return req.user;
  }
  // public login(@Body() body: Pick<User, 'email' | 'password'>) {
  //   return this.authService.login(body.email, body.password);
  // }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
