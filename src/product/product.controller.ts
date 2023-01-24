import { Roles } from '../role/roles.decorator';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Product } from '../dto/product.dto';
import { ProductService } from './product.service';
import { Role } from 'src/role/roles.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('Test')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProductAll(@Query('name') productName?: string): Product[] {
    if (productName) {
      return this.productService.findByCondition((product) =>
        product.name.includes(productName),
      );
    }
    return this.productService.findAll();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.findById(Number(id));
  }
}
