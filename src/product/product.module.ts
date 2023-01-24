import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ConfigModule, ProductModule],
  controllers: [ProductController],
  providers: [ProductService, AuthModule, FirebaseService],
})
export class ProductModule {}
