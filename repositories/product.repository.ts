import { Repository } from "typeorm";
import Product from "../entities/product.entity";

class ProductRepository {
  constructor(private repository: Repository<Product>) {}

  async getAll() : Promise<Product[]> {
    return this.repository.find();
  }

  async create(product: Product) : Promise<Product> {
    return this.repository.save(product);
  }
}

export default ProductRepository;