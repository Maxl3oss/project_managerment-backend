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
  private register(@Body() body: Omit<User, 'id'>) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  private login(@Request() req) {
    return req.user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  private getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(
    @Request() req: Omit<User, 'password'>,
  ): Promise<string | never> {
    return this.authService.refresh(req);
  }
}
