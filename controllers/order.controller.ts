import express from "express";
import HttpException from "../exception/http.exception";
import Order from "../entities/order.entity";
import { OrderProduct } from "../repositories/order.repository";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";

export class OrderController {
  router: express.Router;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {
    this.router = express.Router();

    this.router.get("/", this.getOrders.bind(this));
    this.router.post("/", this.createOrder.bind(this));
    this.router.get("/:id", this.getOrderById.bind(this));
    this.router.patch("/:id", this.updateOrder.bind(this));
    this.router.delete("/:id", this.cancelOrder.bind(this));
  }

  public getOrders = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const products = await this.orderService.getOrders(userId!);
    res.status(200).json({ data: products });
  };

  public createOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const orderItems = req.body.orderItems as OrderProduct[];
    const productIds = [...new Set(orderItems.map((item) => item.productId))];
    const products = await this.productService.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new HttpException(404, "some products not found");
    }
    const order = await this.orderService.createOrder(userId!, orderItems, req.body.address);
    res.status(201).json({ data: order });
  };

  public getOrderById = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const orderId = req.params.id;
    const order = await this.orderService.getOrderById(Number(orderId), userId!);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    res.status(200).json({ data: order });
  };

  public updateOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const orderId = req.params.id;
    const updateOrderProperties: Partial<Order> = req.body.updateOrderProperties;
    const order = await this.orderService.updateOrder(Number(orderId), userId!, updateOrderProperties);
    res.status(200).json({ data: order });
  };

  public cancelOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const orderId = req.params.id;
    const result = await this.orderService.cancelOrder(Number(orderId), userId!);
    res.status(200).json({ data: result });
  };
}

export default OrderController;