import { Product } from '../dto/product.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Apple', price: 50 },
    { id: 2, name: 'Mango', price: 20 },
    { id: 2, name: 'PineApple', price: 20 },
  ];
  findAll(): Product[] {
    return this.products;
  }

  findById(id: number) {
    return this.products.find((p) => p.id === id);
  }

  findByCondition(predicate: (product: Product) => boolean) {
    return this.products.filter((p) => predicate(p));
  }
}
