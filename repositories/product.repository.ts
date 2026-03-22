import { In, Repository } from "typeorm";
import Product from "../entities/product.entity";

class ProductRepository {
  constructor(private repository: Repository<Product>) {}

  async getAll() : Promise<Product[]> {
    return this.repository.find();
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repository.find({ where: { id: In(ids) } });
  }

  async create(product: Product) : Promise<Product> {
    return this.repository.save(product);
  }
}

export default ProductRepository;