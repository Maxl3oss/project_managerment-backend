import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, AuthModule],
})
export class ProductModule {}
