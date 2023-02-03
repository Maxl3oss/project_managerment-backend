import { Product } from './../dto/product.dto';
import { Roles } from '../role/roles.decorator';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Role } from 'src/role/roles.enum';
import { RolesGuard } from 'src/role/roles.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addProduct(@Body() body: Omit<Product, 'id'>) {
    return this.productService.addProduct(body);
  }

  @Put('update/:pid')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateProduct(@Param('pid') pid: string, @Body() body: Omit<Product, 'id'>) {
    return this.productService.updateProduct(pid, body);
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  getProducts() {
    return this.productService.findAll();
  }

  @Get('page/:page')
  @UseGuards(JwtAuthGuard)
  getPage(@Param('page') page: string) {
    return this.productService.findByPage(page);
  }

  @Get('next')
  @UseGuards(JwtAuthGuard)
  getNext() {
    return this.productService.next();
  }

  @Get('prev')
  @UseGuards(JwtAuthGuard)
  getPrev() {
    return this.productService.prev();
  }

  @Get('get/:pid')
  @UseGuards(JwtAuthGuard)
  getByIdProduct(@Param('pid') pid: string) {
    return this.productService.findById(pid);
  }

  @Get('name/:str')
  @UseGuards(JwtAuthGuard)
  getByName(@Param('str') str: string) {
    return this.productService.findByName(str);
  }
  // @Get()
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getProductAll(@Query('name') productName?: string): Product[] {
  //   if (productName) {
  //     return this.productService.findByCondition((product) =>
  //       product.name.includes(productName),
  //     );
  //   }
  //   return this.productService.findAll();
  // }

  // @Get(':id')
  // getProductById(@Param('id') id: string) {
  //   return this.productService.findById(Number(id));
  // }
}
