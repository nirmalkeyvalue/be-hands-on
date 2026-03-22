import Product from "../entities/product.entity";
import ProductRepository from "../repositories/product.repository";

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProducts() {
    return this.productRepository.getAll();
  }

  async createProduct(product: Product) {
    return this.productRepository.create(product);
  }

  async findByIds(ids: number[]) {
    return this.productRepository.findByIds(ids);
  }
}

export default ProductService;