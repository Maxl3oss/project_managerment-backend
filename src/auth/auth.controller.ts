import { CreateUserDto } from './../dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return req.user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@Request() req: Omit<User, 'password'>): Promise<string | never> {
    return this.authService.refresh(req);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadProfile(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.authService.uploadProfile(req.user.id, file);
  }
}
