import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Product } from '../dto/product.dto';
import { ProductService } from './product.service';
import { Roles } from '../role/roles.decorator';
import { Role } from 'src/role/role.enum';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  @Get()
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
