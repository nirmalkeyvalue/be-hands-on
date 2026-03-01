import express from "express";
import ProductService from "../services/product.service";

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
    const product = await this.productService.createProduct(req.body);
    res.status(201).json({ data: product });
  };
}