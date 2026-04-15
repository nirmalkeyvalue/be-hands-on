import express from "express";
import { CreateProductDto } from "../dto/product/create-product.dto";
import Product from "../entities/product.entity";
import ProductService from "../services/product.service";
import { validateDto } from "../utils/validate-dto";

export class ProductController {
  router: express.Router;

  constructor(private productService: ProductService) {
    this.router = express.Router();

    this.router.get("/", this.getProducts.bind(this));
    this.router.post("/", this.createProduct.bind(this));
  }

  public getProducts = async (req: express.Request, res: express.Response) => {
    const products = await this.productService.getProducts();
    res.status(200).json({ data: products });
  };

  public createProduct = async (req: express.Request, res: express.Response) => {
    const dto = await validateDto(CreateProductDto, req.body);
    const product = new Product();
    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;
    const created = await this.productService.createProduct(product);
    res.status(201).json({ data: created });
  };
}