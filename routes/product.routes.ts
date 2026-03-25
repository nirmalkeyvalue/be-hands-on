import { ProductController } from "../controllers/product.controller";
import dataSource from "../db/data-source";
import Product from "../entities/product.entity";
import ProductRepository from "../repositories/product.repository";
import ProductService from "../services/product.service";

const productRepository = new ProductRepository(dataSource.getRepository(Product));

const productService = new ProductService(productRepository);
const productController = new ProductController(productService);
const productRouter = productController.router;

export default productRouter;