import { MulterConfigService } from './../multer/multer.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    // MulterModule.registerAsync({
    //   useClass: MulterConfigService,
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
